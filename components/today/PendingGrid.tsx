import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Month } from "@/lib/mock-data";

type PendingItem = {
  id: string;
  title: string;
  type: string;
  weekTitle: string;
  monthId: string;
  doneTasks: number;
  totalTasks: number;
};

type Props = {
  months: Month[];
};

const TYPE_LABEL: Record<string, string> = {
  youtube: "YouTube",
  docs: "Docs",
  course: "Course",
  article: "Article",
  github: "GitHub",
};

const TYPE_COLOR: Record<string, string> = {
  youtube: "text-ember border-ember/40",
  docs: "text-lavender border-lavender/40",
  course: "text-jade border-jade-line",
  article: "text-zen-text-2 border-zen-line",
  github: "text-zen-text-2 border-zen-line",
};

export function PendingGrid({ months }: Props) {
  const pending: PendingItem[] = [];

  for (const month of months) {
    for (const week of month.weeks) {
      for (const item of week.items) {
        if (item.completed) continue;
        const doneTasks = item.tasks.filter((t) => t.completed).length;
        pending.push({
          id: item.id,
          title: item.title,
          type: item.type,
          weekTitle: week.title,
          monthId: month.id,
          doneTasks,
          totalTasks: item.tasks.length,
        });
        if (pending.length >= 6) break;
      }
      if (pending.length >= 6) break;
    }
    if (pending.length >= 6) break;
  }

  if (pending.length === 0) {
    return (
      <div className="border border-zen-line rounded-[14px] bg-zen-surface p-8 text-center">
        <p className="font-serif italic text-[20px] text-zen-text-2 m-0">All caught up!</p>
        <p className="text-zen-text-4 font-mono text-xs tracking-[0.08em] mt-2 m-0">
          No pending items — great work.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-baseline justify-between mb-3.5">
        <h2 className="m-0 font-serif text-[22px] font-normal tracking-tight">Pending</h2>
        <span className="font-mono text-[11px] text-zen-text-4 tracking-[0.08em]">
          {pending.length} items
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4.5">
        {pending.map((item) => {
          const pct = item.totalTasks > 0
            ? Math.round((item.doneTasks / item.totalTasks) * 100)
            : 0;
          const typeLabel = TYPE_LABEL[item.type] ?? item.type;
          const typeColor = TYPE_COLOR[item.type] ?? "text-zen-text-2 border-zen-line";

          return (
            <Link
              key={item.id}
              href={`/dashboard/month/${item.monthId}`}
              className="group border border-zen-line bg-zen-surface rounded-[14px] p-4 flex flex-col gap-3 no-underline hover:bg-zen-surface-2 hover:border-zen-line-strong transition-colors duration-150"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`font-mono text-[10.5px] px-2 py-0.5 rounded-full border ${typeColor}`}
                >
                  {typeLabel}
                </span>
                <ChevronRight
                  size={14}
                  className="text-zen-text-5 shrink-0 group-hover:text-zen-text-3 transition-colors mt-0.5"
                />
              </div>

              {/* Title */}
              <p className="m-0 text-zen-text text-sm font-medium leading-snug line-clamp-2">
                {item.title}
              </p>

              {/* Week label */}
              <p className="m-0 text-zen-text-4 font-mono text-[11px] truncate">
                {item.weekTitle}
              </p>

              {/* Progress */}
              {item.totalTasks > 0 && (
                <div className="flex items-center gap-2 mt-auto">
                  <div className="flex-1 h-[3px] rounded-full bg-zen-surface-3 overflow-hidden">
                    <div
                      className="h-full bg-jade rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10.5px] text-zen-text-4 shrink-0">
                    {item.doneTasks}/{item.totalTasks}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
