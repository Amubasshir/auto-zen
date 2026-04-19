"use client";

import { ChevronRight } from "lucide-react";
import type { Item } from "@/lib/mock-data";

type Props = {
  item: Item;
  onClick?: () => void;
};

const TYPE_META: Record<string, { label: string; className: string }> = {
  youtube: {
    label: "YouTube",
    className: "text-[oklch(0.78_0.08_28)] border-[oklch(0.78_0.08_28/0.4)]",
  },
  docs: {
    label: "Docs",
    className: "text-[oklch(0.82_0.05_240)] border-[oklch(0.82_0.05_240/0.4)]",
  },
  course: {
    label: "Course",
    className: "text-jade border-jade-line",
  },
  article: {
    label: "Article",
    className: "text-[oklch(0.82_0.06_90)] border-[oklch(0.82_0.06_90/0.4)]",
  },
  github: {
    label: "GitHub",
    className: "text-zen-text-2 border-zen-line",
  },
};

export function ItemRow({ item, onClick }: Props) {
  const doneTasks = item.tasks.filter((t) => t.completed).length;
  const totalTasks = item.tasks.length;
  const estMin = totalTasks * 15;
  const durLabel = estMin >= 60 ? `${Math.round(estMin / 60)}h` : `${estMin}m`;

  const typeMeta = TYPE_META[item.type] ?? {
    label: item.type,
    className: "text-zen-text-2 border-zen-line",
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={`group grid grid-cols-[22px_1fr_auto_auto_auto_28px] gap-4 items-center px-5 py-3.25 border-b border-zen-line last:border-b-0 transition-colors duration-150 hover:bg-zen-surface
        ${onClick ? "cursor-pointer" : ""}
        ${item.completed ? "opacity-75" : ""}`}
    >
      {/* Checkbox */}
      <span
        className={`w-4.5 h-4.5 rounded-[6px] border-[1.5px] justify-self-center shrink-0 relative
          ${item.completed ? "bg-jade border-jade" : "border-zen-line-strong"}`}
      >
        {item.completed && (
          <span className="absolute left-1 top-px w-1 h-2.25 border-solid border-jade-ink border-0 border-r-2 border-b-2 rotate-45 block" />
        )}
      </span>

      {/* Title */}
      <span
        className={`text-sm min-w-0 overflow-hidden text-ellipsis whitespace-nowrap
          ${item.completed ? "text-zen-text-4 line-through decoration-zen-text-5" : "text-zen-text"}`}
      >
        {item.title}
      </span>

      {/* Task count */}
      <span className="font-mono text-[11px] text-zen-text-4 whitespace-nowrap">
        {doneTasks}/{totalTasks} tasks
      </span>

      {/* Type tag */}
      <span className={`font-mono text-[10.5px] px-1.5 py-0.5 rounded-full border whitespace-nowrap ${typeMeta.className}`}>
        {typeMeta.label}
      </span>

      {/* Duration */}
      <span className="font-mono text-[11px] text-zen-text-4 min-w-12 text-right">
        {durLabel}
      </span>

      {/* Chevron */}
      <ChevronRight
        size={14}
        className="text-zen-text-5 justify-self-end group-hover:text-zen-text-3 transition-colors duration-150"
      />
    </div>
  );
}
