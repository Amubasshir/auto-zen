import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/connect";
import Note from "@/lib/db/models/Note";
import { CreateNoteSchema } from "@/lib/validators/note";

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

  const docs = await Note.find(query).lean();

  const notes = docs.map((d) => ({
    id: d._id.toString(),
    weekId: d.weekId,
    content: d.content,
    updatedAt: d.updatedAt?.toISOString() ?? new Date().toISOString(),
  }));

  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CreateNoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { weekId, content } = parsed.data;

  await dbConnect();

  // Upsert: one note per user per week
  const doc = await Note.findOneAndUpdate(
    { userId: session.user.id, weekId },
    { $set: { content } },
    { upsert: true, new: true },
  );

  return NextResponse.json(
    {
      id: doc._id.toString(),
      weekId: doc.weekId,
      content: doc.content,
      updatedAt: doc.updatedAt?.toISOString() ?? new Date().toISOString(),
    },
    { status: 201 },
  );
}
