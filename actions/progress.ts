"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/connect";
import RoadmapProgress from "@/lib/db/models/RoadmapProgress";
import Streak from "@/lib/db/models/Streak";
import { EMPTY_PROGRESS, type ProgressState } from "@/lib/validators/progress";

async function touchStreak(userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  const streak = await Streak.findOne({ userId });

  if (!streak) {
    await Streak.create({ userId, count: 1, lastDate: today, activeDays: [today] });
    return;
  }

  if (streak.lastDate === today) return; // already counted today

  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const newCount = streak.lastDate === yesterday ? streak.count + 1 : 1;
  const newPersonalBest = Math.max(streak.personalBest ?? 0, newCount);
  const activeDays = [...streak.activeDays, today].slice(-28); // keep last 28

  await Streak.findByIdAndUpdate(streak._id, {
    count: newCount,
    personalBest: newPersonalBest,
    lastDate: today,
    activeDays,
  });
}

export async function toggleItem(
  itemId: string,
  completed: boolean,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    await dbConnect();

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

    if (completed) await touchStreak(session.user.id);

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save progress" };
  }
}

export async function toggleTask(
  itemId: string,
  taskId: string,
  completed: boolean,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    await dbConnect();

    await RoadmapProgress.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { [`completedTasks.${itemId}.${taskId}`]: completed } },
      { upsert: true },
    );

    if (completed) await touchStreak(session.user.id);

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save progress" };
  }
}

export async function fetchProgress(): Promise<ProgressState> {
  const session = await auth();
  if (!session?.user?.id) return EMPTY_PROGRESS;

  try {
    await dbConnect();
    const doc = await RoadmapProgress.findOne({ userId: session.user.id }).lean();
    if (!doc) return EMPTY_PROGRESS;
    return {
      completedItems: (doc.completedItems as Record<string, boolean>) ?? {},
      completedTasks: (doc.completedTasks as Record<string, Record<string, boolean>>) ?? {},
      lastActiveItem: doc.lastActiveItem,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}
