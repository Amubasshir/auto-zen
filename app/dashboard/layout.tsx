import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { fetchStreak } from "@/actions/streak";
import { fetchProgress } from "@/actions/progress";
import { mockMonths } from "@/lib/mock-data";

function computeOverallProgress(completedItems: Record<string, boolean>): number {
  let total = 0;
  let done = 0;
  for (const month of mockMonths) {
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
  const [streak, progress] = await Promise.all([fetchStreak(), fetchProgress()]);
  const overallProgress = computeOverallProgress(progress.completedItems);

  return (
    <DashboardShell
      streakCount={streak.count}
      activeDays={streak.activeDays}
      overallProgress={overallProgress}
    >
      {children}
    </DashboardShell>
  );
}
