"use server";

import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/connect";
import Streak from "@/lib/db/models/Streak";

export type StreakData = {
  count: number;
  personalBest: number;
  lastDate: string;
  activeDays: string[];
};

const EMPTY: StreakData = { count: 0, personalBest: 0, lastDate: "", activeDays: [] };

export async function fetchStreak(): Promise<StreakData> {
  const session = await auth();
  if (!session?.user?.id) return EMPTY;

  try {
    await dbConnect();
    const streak = await Streak.findOne({ userId: session.user.id }).lean();
    if (!streak) return EMPTY;
    return {
      count: streak.count,
      personalBest: streak.personalBest ?? 0,
      lastDate: streak.lastDate,
      activeDays: streak.activeDays,
    };
  } catch {
    return EMPTY;
  }
}
