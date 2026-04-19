import { notFound } from "next/navigation";
import { mockMonths } from "@/lib/mock-data";
import { fetchProgress } from "@/actions/progress";
import { MonthPageClient } from "@/components/month/MonthPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MonthPage({ params }: Props) {
  const { id } = await params;
  const month = mockMonths.find((m) => m.id === id);

  if (!month) notFound();

  // Fetch real progress — falls back to EMPTY_PROGRESS if unauthenticated or DB error
  const progress = await fetchProgress();

  const weekOffset = (month.monthNumber - 1) * 4;

  return (
    <MonthPageClient
      month={month}
      weekOffset={weekOffset}
      initialProgress={progress}
    />
  );
}

export function generateStaticParams() {
  return mockMonths.map((m) => ({ id: m.id }));
}
