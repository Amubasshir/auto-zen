import { notFound } from "next/navigation";
import { mockMonths } from "@/lib/mock-data";
import { MonthHead } from "@/components/month/MonthHead";
import { WeekCard } from "@/components/month/WeekCard";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MonthPage({ params }: Props) {
  const { id } = await params;
  const month = mockMonths.find((m) => m.id === id);

  if (!month) notFound();

  // Total progress across all weeks
  let doneTasks = 0;
  let totalTasks = 0;
  for (const week of month.weeks) {
    for (const item of week.items) {
      for (const task of item.tasks) {
        totalTasks++;
        if (task.completed) doneTasks++;
      }
    }
  }

  // Cumulative week number across roadmap (e.g., month 2 week 1 = week 5 overall)
  const weekOffset = (month.monthNumber - 1) * 4;

  return (
    <>
      <MonthHead month={month} doneTasks={doneTasks} totalTasks={totalTasks} />

      {/* Week cards — first week open by default */}
      <div className="flex flex-col gap-3">
        {month.weeks.map((week, i) => (
          <WeekCard
            key={week.id}
            week={week}
            weekIndex={weekOffset + i + 1}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </>
  );
}

export function generateStaticParams() {
  return mockMonths.map((m) => ({ id: m.id }));
}
