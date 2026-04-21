"use server";

import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/connect";
import Note from "@/lib/db/models/Note";

export async function saveNote(
  weekId: string,
  content: string,
): Promise<{ success: boolean; updatedAt?: string; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  if (!weekId) return { success: false, error: "weekId is required" };

  try {
    await dbConnect();

    const doc = await Note.findOneAndUpdate(
      { userId: session.user.id, weekId },
      { $set: { content } },
      { upsert: true, new: true },
    );

    return {
      success: true,
      updatedAt: doc.updatedAt?.toISOString() ?? new Date().toISOString(),
    };
  } catch {
    return { success: false, error: "Failed to save note" };
  }
}

export async function fetchNotes(
  keys: string[],
): Promise<Record<string, string>> {
  const session = await auth();
  if (!session?.user?.id) return {};

  try {
    await dbConnect();

    const docs = await Note.find({
      userId: session.user.id,
      weekId: { $in: keys },
    }).lean();

    return Object.fromEntries(docs.map((d) => [d.weekId, d.content ?? ""]));
  } catch {
    return {};
  }
}
