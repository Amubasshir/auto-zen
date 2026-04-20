import { z } from "zod";

export const OnboardingSchema = z.object({
  pathType: z.enum(["no-code", "developer"]),
  weeklyHours: z.number().int().min(1).max(80),
  weeklyTarget: z.number().int().min(1).max(20),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
});

export type OnboardingData = z.infer<typeof OnboardingSchema>;
