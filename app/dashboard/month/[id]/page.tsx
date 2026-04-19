import { notFound } from "next/navigation";
import { mockMonths } from "@/lib/mock-data";
import { MonthPageClient } from "@/components/month/MonthPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MonthPage({ params }: Props) {
  const { id } = await params;
  const month = mockMonths.find((m) => m.id === id);

  if (!month) notFound();

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

  const weekOffset = (month.monthNumber - 1) * 4;

  return (
    <MonthPageClient
      month={month}
      doneTasks={doneTasks}
      totalTasks={totalTasks}
      weekOffset={weekOffset}
    />
  );
}

export function generateStaticParams() {
  return mockMonths.map((m) => ({ id: m.id }));
}
