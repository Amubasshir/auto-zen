import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/connect";
import Streak from "@/lib/db/models/Streak";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const streak = await Streak.findOne({ userId: session.user.id }).lean();
    if (!streak) {
      return NextResponse.json({ count: 0, personalBest: 0, lastDate: "", activeDays: [] });
    }
    return NextResponse.json({
      count: streak.count,
      personalBest: streak.personalBest ?? 0,
      lastDate: streak.lastDate,
      activeDays: streak.activeDays,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch streak" }, { status: 500 });
  }
}
