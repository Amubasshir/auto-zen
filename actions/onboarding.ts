"use server";

import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { OnboardingSchema, type OnboardingData } from "@/lib/validators/onboarding";

type Result =
  | { success: true }
  | { success: false; error: string };

export async function saveOnboarding(data: OnboardingData): Promise<Result> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = OnboardingSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await dbConnect();
    const updated = await User.findByIdAndUpdate(
      session.user.id,
      {
        pathType: parsed.data.pathType,
        weeklyHours: parsed.data.weeklyHours,
        weeklyTarget: parsed.data.weeklyTarget,
        startDate: parsed.data.startDate,
        onboardingDone: true,
      },
      { new: true },
    );

    if (!updated) {
      return { success: false, error: "User not found" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to save onboarding data" };
  }
}
