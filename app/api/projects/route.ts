import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/connect";
import ProjectPortfolio from "@/lib/db/models/ProjectPortfolio";
import { CreateProjectSchema } from "@/lib/validators/project";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const docs = await ProjectPortfolio.find({ userId: session.user.id })
      .sort({ createdAt: 1 })
      .lean();

    const projects = docs.map((d) => ({
      id: d._id.toString(),
      title: d.title,
      description: d.description ?? "",
      status: d.status,
      githubUrl: d.githubUrl,
      demoUrl: d.demoUrl,
      loomUrl: d.loomUrl,
      caseStudy: d.caseStudy,
      completedAt: d.completedAt?.toISOString(),
      createdAt: d.createdAt?.toISOString() ?? new Date().toISOString(),
    }));

    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = CreateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  try {
    await dbConnect();
    const doc = await ProjectPortfolio.create({
      userId: session.user.id,
      ...parsed.data,
    });

    return NextResponse.json(
      {
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
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
