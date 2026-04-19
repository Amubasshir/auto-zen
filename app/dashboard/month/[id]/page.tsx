import { notFound } from "next/navigation";
import { mockMonths } from "@/lib/mock-data";
import { fetchProgress } from "@/actions/progress";
import { fetchResourcesForWeeks } from "@/actions/resources";
import { MonthPageClient } from "@/components/month/MonthPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MonthPage({ params }: Props) {
  const { id } = await params;
  const month = mockMonths.find((m) => m.id === id);

  if (!month) notFound();

  const weekIds = month.weeks.map((w) => w.id);

  const [progress, resources] = await Promise.all([
    fetchProgress(),
    fetchResourcesForWeeks(weekIds),
  ]);

  const weekOffset = (month.monthNumber - 1) * 4;

  return (
    <MonthPageClient
      month={month}
      weekOffset={weekOffset}
      initialProgress={progress}
      initialResources={resources}
    />
  );
}

export function generateStaticParams() {
  return mockMonths.map((m) => ({ id: m.id }));
}
