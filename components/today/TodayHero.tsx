import Link from "next/link";
import { Play, ExternalLink } from "lucide-react";
import type { Item, Month, Week } from "@/lib/mock-data";

type Props = {
  item: Item;
  week: Week;
  month: Month;
};

const TYPE_LABEL: Record<string, string> = {
  youtube: "YouTube",
  docs: "Docs",
  course: "Course",
  article: "Article",
  github: "GitHub",
};

export function TodayHero({ item, week, month }: Props) {
  const doneTasks = item.tasks.filter((t) => t.completed).length;
  const totalTasks = item.tasks.length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div
      className="p-9 border border-zen-line rounded-[18px] relative overflow-hidden"
      style={{
        background: `radial-gradient(600px 300px at 100% 0%, oklch(0.8 0.06 162 / 0.06), transparent 70%), oklch(0.222 0.006 260)`,
      }}
    >
      {/* Kicker */}
      <p className="m-0 font-mono text-[11px] text-jade tracking-[0.14em] uppercase">
        Month {month.monthNumber} · Week {week.weekNumber}
      </p>

      {/* Title */}
      <h1 className="font-serif text-[40px] leading-tight tracking-tight mt-3.5 mb-2 max-w-[22ch]">
        {item.title}
      </h1>

      {/* Subtitle */}
      <p className="m-0 text-zen-text-3 text-sm max-w-[50ch] leading-relaxed">
        {month.goal}
      </p>

      {/* Meta pills */}
      <div className="flex gap-3.5 mt-5 mb-5 flex-wrap">
        <MetaPill icon="⏱">~30 min</MetaPill>
        <MetaPill icon="📄">{TYPE_LABEL[item.type] ?? item.type}</MetaPill>
        <MetaPill icon="📅">Week {week.weekNumber} of 4</MetaPill>
        {totalTasks > 0 && (
          <MetaPill icon="✓">
            {doneTasks}/{totalTasks} tasks · {pct}%
          </MetaPill>
        )}
      </div>

      {/* Progress bar */}
      {totalTasks > 0 && (
        <div className="h-1 bg-zen-surface-2 rounded-full overflow-hidden mb-6 max-w-[300px]">
          <div
            className="h-full bg-jade rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* CTA buttons */}
      <div className="flex gap-2.5">
        <Link
          href={`/dashboard/month/${month.id}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-jade text-jade-ink text-[13px] font-medium no-underline hover:brightness-110 transition"
        >
          <Play size={14} />
          Start Learning
        </Link>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-zen-line bg-zen-surface text-zen-text-2 text-[13px] no-underline hover:bg-zen-surface-2 hover:border-zen-line-strong transition"
          >
            <ExternalLink size={14} />
            Open Resource
          </a>
        )}
      </div>
    </div>
  );
}

function MetaPill({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-zen-line rounded-full font-mono text-[11.5px] text-zen-text-2">
      <span aria-hidden>{icon}</span>
      {children}
    </span>
  );
}
