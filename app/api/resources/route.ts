import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/connect";
import CustomResource from "@/lib/db/models/CustomResource";
import { CreateResourceSchema } from "@/lib/validators/resource";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const weekId = searchParams.get("weekId");

  await dbConnect();

  const query: Record<string, string> = { userId: session.user.id };
  if (weekId) query.weekId = weekId;

  const docs = await CustomResource.find(query).sort({ createdAt: 1 }).lean();

  const resources = docs.map((d) => ({
    id: d._id.toString(),
    weekId: d.weekId,
    title: d.title,
    url: d.url,
    type: d.type,
    difficulty: d.difficulty,
    duration: d.duration,
    tasks: d.tasks ?? [],
    createdAt: d.createdAt?.toISOString() ?? new Date().toISOString(),
  }));

  return NextResponse.json(resources);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CreateResourceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  await dbConnect();

  const doc = await CustomResource.create({
    userId: session.user.id,
    ...parsed.data,
  });

  return NextResponse.json(
    {
      id: doc._id.toString(),
      weekId: doc.weekId,
      title: doc.title,
      url: doc.url,
      type: doc.type,
      difficulty: doc.difficulty,
      duration: doc.duration,
      tasks: doc.tasks ?? [],
      createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
    },
    { status: 201 },
  );
}
