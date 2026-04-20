import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/connect";
import ProjectPortfolio from "@/lib/db/models/ProjectPortfolio";
import { UpdateProjectSchema } from "@/lib/validators/project";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = UpdateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const update: Record<string, unknown> = { ...parsed.data };

  if (parsed.data.status === "completed") {
    update.completedAt = new Date();
  } else if (parsed.data.status !== undefined) {
    update.completedAt = null;
  }

  try {
    await dbConnect();
    const doc = await ProjectPortfolio.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: update },
      { new: true },
    );

    if (!doc) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      project: {
        id: doc._id.toString(),
        title: doc.title,
        description: doc.description ?? "",
        status: doc.status,
        githubUrl: doc.githubUrl,
        demoUrl: doc.demoUrl,
        loomUrl: doc.loomUrl,
        caseStudy: doc.caseStudy,
        completedAt: doc.completedAt?.toISOString(),
        createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await dbConnect();
    const doc = await ProjectPortfolio.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!doc) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
