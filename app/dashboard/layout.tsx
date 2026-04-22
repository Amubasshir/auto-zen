import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { fetchStreak } from "@/actions/streak";
import { fetchProgress } from "@/actions/progress";
import { mockMonths } from "@/lib/mock-data";
import { filterMonthsByPath, type PathType } from "@/lib/path-filter";

function computeOverallProgress(
  completedItems: Record<string, boolean>,
  pathType: PathType,
): number {
  const filtered = filterMonthsByPath(mockMonths, pathType);
  let total = 0;
  let done = 0;
  for (const month of filtered) {
    for (const week of month.weeks) {
      for (const item of week.items) {
        total++;
        if (completedItems[item.id]) done++;
      }
    }
  }
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Gate: redirect to onboarding if user hasn't completed it; also read pathType
  const session = await auth();
  let pathType: "no-code" | "developer" = "developer";
  if (session?.user?.id) {
    await dbConnect();
    const user = await User.findById(session.user.id).select("onboardingDone pathType").lean();
    if (!user?.onboardingDone) redirect("/onboarding");
    if (user?.pathType) pathType = user.pathType as "no-code" | "developer";
  }

  const [streak, progress] = await Promise.all([fetchStreak(), fetchProgress()]);
  const overallProgress = computeOverallProgress(progress.completedItems, pathType);

  return (
    <DashboardShell
      streakCount={streak.count}
      activeDays={streak.activeDays}
      overallProgress={overallProgress}
      pathType={pathType}
    >
      {children}
    </DashboardShell>
  );
}
