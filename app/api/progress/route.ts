import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/connect";
import RoadmapProgress from "@/lib/db/models/RoadmapProgress";
import { PatchProgressSchema, EMPTY_PROGRESS } from "@/lib/validators/progress";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const doc = await RoadmapProgress.findOne({ userId: session.user.id }).lean();

  if (!doc) {
    return NextResponse.json(EMPTY_PROGRESS);
  }

  return NextResponse.json({
    completedItems: doc.completedItems ?? {},
    completedTasks: doc.completedTasks ?? {},
    lastActiveItem: doc.lastActiveItem ?? "",
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = PatchProgressSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  await dbConnect();

  const { type } = parsed.data;

  if (type === "item") {
    const { itemId, completed } = parsed.data;
    await RoadmapProgress.findOneAndUpdate(
      { userId: session.user.id },
      {
        $set: {
          [`completedItems.${itemId}`]: completed,
          lastActiveItem: itemId,
        },
      },
      { upsert: true },
    );
  } else {
    const { itemId, taskId, completed } = parsed.data;
    await RoadmapProgress.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { [`completedTasks.${itemId}.${taskId}`]: completed } },
      { upsert: true },
    );
  }

  return NextResponse.json({ success: true });
}
