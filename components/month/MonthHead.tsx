import { Trophy } from "lucide-react";
import { Ring } from "@/components/ui/ring";
import type { Month } from "@/lib/mock-data";

type Props = {
  month: Month;
  doneTasks: number;
  totalTasks: number;
};

export function MonthHead({ month, doneTasks, totalTasks }: Props) {
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-[1fr_auto] gap-5 p-7 border border-zen-line rounded-[14px] bg-zen-surface mb-5 relative overflow-hidden">
      {/* Subtle accent glow top-right */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.8 0.07 162 / 0.06), transparent 70%)" }}
        aria-hidden
      />

      {/* Left: text content */}
      <div className="min-w-0">
        <p className="m-0 font-mono text-[11px] text-zen-text-4 tracking-[0.12em] uppercase">
          Month {month.monthNumber} of 6
        </p>

        <h1 className="font-serif text-[42px] leading-tight tracking-tight mt-2.5 mb-3">
          {month.title}
        </h1>

        <p className="m-0 text-zen-text-2 text-[14.5px] leading-relaxed max-w-[60ch]">
          {month.goal}
        </p>

        {/* Milestone */}
        <div className="inline-flex items-center gap-2.5 mt-4 pt-4 border-t border-zen-line text-zen-text-3 text-[13px]">
          <Trophy size={14} className="text-ember shrink-0" />
          Milestone:{" "}
          <b className="text-zen-text font-medium">{month.milestone}</b>
        </div>
      </div>

      {/* Right: Ring + stats */}
      <div className="flex flex-col items-end justify-between gap-4 min-w-[220px]">
        <Ring
          pct={pct}
          size={116}
          strokeWidth={6}
          label={`${pct}`}
          sublabel="complete"
        />

        <div className="flex flex-col items-end gap-1 text-right">
          <span className="font-serif text-[28px] leading-none">
            {doneTasks}
            <span className="font-mono text-base text-zen-text-3 ml-1">/{totalTasks}</span>
          </span>
          <span className="font-mono text-[10px] text-zen-text-4 tracking-[0.12em] uppercase">
            Tasks done
          </span>
        </div>
      </div>
    </div>
  );
}
