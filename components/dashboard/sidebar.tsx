"use client";

import {
  LayoutDashboard,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { mockMonths, mockActivityGrid, mockUser } from "@/lib/mock-data";

type SidebarProps = {
  expanded: boolean;
  onToggle: () => void;
};

function countProgress(month: (typeof mockMonths)[number]) {
  let done = 0;
  let total = 0;
  for (const week of month.weeks) {
    for (const item of week.items) {
      for (const task of item.tasks) {
        total++;
        if (task.completed) done++;
      }
    }
  }
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  return (
    <aside className="border-r border-zen-line bg-zen-raised flex flex-col min-w-0 relative">
      {/* Brand */}
      <div className="h-16 flex items-center gap-2.5 px-4 border-b border-zen-line text-zen-text shrink-0">
        <div className="w-7 h-7 shrink-0 grid place-items-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            className="text-jade"
          >
            <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2" />
            <path
              d="M9 14.5l3 3 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span
          className="font-serif text-[22px] tracking-tight whitespace-nowrap transition-all duration-250"
          style={{
            opacity: expanded ? 1 : 0,
            transform: expanded ? "none" : "translateX(-4px)",
          }}
        >
          AutoZen
        </span>
      </div>

      {/* Nav */}
      <nav className="p-3 flex flex-col gap-0.5">
        <NavItem
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          expanded={expanded}
          active
        />
        <NavItem
          icon={<Sun size={18} />}
          label="Today"
          expanded={expanded}
        />
      </nav>

      {/* Section label */}
      <div
        className="text-[10.5px] tracking-[0.16em] uppercase px-5 pt-4 pb-2 whitespace-nowrap transition-opacity duration-250"
        style={{ color: expanded ? "oklch(0.36 0.012 90)" : "transparent" }}
      >
        {expanded ? "Roadmap" : <span className="block w-5.5 h-px mx-auto bg-zen-line" />}
      </div>

      {/* Month cards */}
      <div className="px-2.5 flex flex-col gap-1 overflow-hidden flex-1">
        {mockMonths.map((month, i) => {
          const { done, total, pct } = countProgress(month);
          const isActive = month.monthNumber === 2;
          return (
            <button
              key={month.id}
              className={`grid items-center rounded-[10px] p-2 transition-colors duration-150 w-full text-left
                ${expanded ? "grid-cols-[28px_1fr_auto] gap-2.5 px-3 py-2" : "grid-cols-1 justify-items-center"}
                ${isActive ? "bg-zen-surface-2 text-zen-text" : "text-zen-text-3 hover:bg-zen-surface hover:text-zen-text"}`}
            >
              <span
                className={`w-6.5 h-6.5 rounded-lg grid place-items-center font-mono text-[11px] border shrink-0
                  ${isActive || pct === 100
                    ? "bg-jade-soft text-jade border-jade-line"
                    : "bg-zen-surface-2 text-zen-text-3 border-zen-line"}`}
              >
                {month.monthNumber}
              </span>
              {expanded && (
                <div className="min-w-0">
                  <div className="text-[13px] text-zen-text truncate">
                    {month.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-[3px] rounded-full bg-zen-surface-3 overflow-hidden">
                      <div
                        className="block h-full bg-jade rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
              {expanded && (
                <span className="font-mono text-[10.5px] text-zen-text-4">
                  {done}/{total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Activity grid */}
      {expanded && (
        <div className="mt-auto p-4 pt-4 border-t border-zen-line">
          <div className="flex justify-between items-baseline text-[11px] tracking-[0.12em] uppercase text-zen-text-5 mb-2.5">
            <span>Activity</span>
            <span className="font-mono text-ember tracking-[0.04em]">
              {mockUser.streak}d
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {mockActivityGrid.map((active, i) => (
              <div
                key={i}
                className={`aspect-square rounded-[4px] ${
                  active
                    ? "bg-jade/25"
                    : "bg-zen-surface-2"
                }`}
              />
            ))}
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-zen-text-4 font-mono">
            <span>Less</span>
            <span className="inline-flex gap-1">
              {[0, 0.18, 0.38, 0.62, 1].map((opacity, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-[2px]"
                  style={{
                    background:
                      opacity === 0
                        ? "oklch(0.256 0.006 260)"
                        : opacity === 1
                          ? "oklch(0.80 0.07 162)"
                          : `oklch(0.80 0.07 162 / ${opacity})`,
                  }}
                />
              ))}
            </span>
            <span>More</span>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-2.5 top-[52px] w-5.5 h-5.5 rounded-full bg-zen-surface-2 border border-zen-line-strong grid place-items-center text-zen-text-3 z-30 hover:text-zen-text transition-colors"
      >
        {expanded ? <PanelLeftClose size={12} /> : <PanelLeftOpen size={12} />}
      </button>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  expanded,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  active?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] whitespace-nowrap transition-colors duration-150 w-full text-left relative
        ${active
          ? "bg-zen-surface-2 text-zen-text"
          : "text-zen-text-3 hover:bg-zen-surface hover:text-zen-text"}`}
    >
      {active && (
        <span className="absolute -left-2.5 top-3.5 bottom-3.5 w-0.5 bg-jade rounded-sm" />
      )}
      {icon}
      <span
        className="transition-all duration-250"
        style={{
          opacity: expanded ? 1 : 0,
          transform: expanded ? "none" : "translateX(-4px)",
          pointerEvents: expanded ? "auto" : "none",
        }}
      >
        {label}
      </span>
    </button>
  );
}
