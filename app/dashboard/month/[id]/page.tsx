import { notFound } from "next/navigation";
import { mockMonths } from "@/lib/mock-data";
import { fetchProgress } from "@/actions/progress";
import { fetchResourcesForWeeks } from "@/actions/resources";
import { fetchNotes } from "@/actions/notes";
import { MonthPageClient } from "@/components/month/MonthPageClient";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { filterMonthsByPath, type PathType } from "@/lib/path-filter";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MonthPage({ params }: Props) {
  const { id } = await params;

  let pathType: PathType = "developer";
  const session = await auth();
  if (session?.user?.id) {
    await dbConnect();
    const user = await User.findById(session.user.id).select("pathType").lean();
    if (user?.pathType) pathType = user.pathType as PathType;
  }

  const filtered = filterMonthsByPath(mockMonths, pathType);
  const month = filtered.find((m) => m.id === id);

  if (!month) notFound();

  const weekIds = month.weeks.map((w) => w.id);
  const itemKeys = month.weeks.flatMap((w) => w.items.map((i) => `item-${i.id}`));

  const resources = await fetchResourcesForWeeks(weekIds);
  const resourceKeys = resources.map((r) => `resource-${r.id}`);

  const [progress, notes] = await Promise.all([
    fetchProgress(),
    fetchNotes([...weekIds, ...itemKeys, ...resourceKeys]),
  ]);

  const weekOffset = (month.monthNumber - 1) * 4;

  return (
    <MonthPageClient
      month={month}
      weekOffset={weekOffset}
      initialProgress={progress}
      initialResources={resources}
      initialNotes={notes}
    />
  );
}

export function generateStaticParams() {
  return mockMonths.map((m) => ({ id: m.id }));
}
