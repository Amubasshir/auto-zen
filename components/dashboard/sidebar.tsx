'use client';

import { mockMonths } from '@/lib/mock-data';
import { buildActivityGrid } from '@/lib/streak-utils';
import { Briefcase, LayoutDashboard, PanelLeftClose, Sun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarProps = {
  expanded: boolean;
  onToggle: () => void;
  streakCount: number;
  activeDays: string[];
  pathType: 'no-code' | 'developer';
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

const LEVEL_STYLE: Record<number, string> = {
  0: 'bg-zen-surface-2',
  1: 'bg-jade/18',
  2: 'bg-jade/38',
  3: 'bg-jade/62',
  4: 'bg-jade',
};

export function Sidebar({
  expanded,
  onToggle,
  streakCount,
  activeDays,
  pathType,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="h-full border-r border-zen-line bg-zen-raised flex flex-col min-w-0 relative">
      {/* Brand */}
      {expanded ? (
        <div className="h-16 flex items-center gap-2.5 px-4 border-b border-zen-line text-zen-text shrink-0">
          <LogoIcon />
          <span className="font-serif text-[22px] leading-none tracking-tight whitespace-nowrap">
            AutoZen
          </span>
        </div>
      ) : (
        <button
          onClick={onToggle}
          aria-label="Expand sidebar"
          className="group h-16 w-full flex items-center justify-center border-b border-zen-line text-zen-text shrink-0 hover:bg-zen-surface transition-colors duration-150 relative"
        >
          <LogoIcon />
          <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-[8px] bg-zen-surface-2 border border-zen-line text-[11px] text-zen-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-sm">
            Click to expand
          </span>
        </button>
      )}

      {/* Nav */}
      <nav className="p-3 flex flex-col gap-0.5">
        <NavLink
          href="/dashboard"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          expanded={expanded}
          active={pathname === '/dashboard'}
        />
        <NavLink
          href="/dashboard/today"
          icon={<Sun size={18} />}
          label="Today"
          expanded={expanded}
          active={pathname === '/dashboard/today'}
        />
        <NavLink
          href="/dashboard/portfolio"
          icon={<Briefcase size={18} />}
          label="Portfolio"
          expanded={expanded}
          active={pathname === '/dashboard/portfolio'}
        />
      </nav>

      {/* Section label: Roadmap */}
      {expanded && (
        <div className="text-[10.5px] tracking-[0.16em] uppercase px-5 pt-4 pb-2 whitespace-nowrap shrink-0 text-[oklch(0.36_0.012_90)]">
          Roadmap
        </div>
      )}
      {!expanded && (
        <div className="mx-auto w-5 h-px bg-zen-line my-2 shrink-0" />
      )}

      {/* Month cards */}
      <div
        className={`flex flex-col gap-1 overflow-y-auto flex-1 min-h-0 ${expanded ? 'px-2.5' : 'px-2 items-center'}`}
      >
        {mockMonths.map((month) => {
          const { done, total, pct } = countProgress(month);
          const isActive = pathname === `/dashboard/month/${month.id}`;
          const isDone = pct === 100;

          return expanded ? (
            <Link
              key={month.id}
              href={`/dashboard/month/${month.id}`}
              className={`grid grid-cols-[28px_1fr_auto] items-center gap-2.5 px-3 py-2 rounded-[10px] transition-colors duration-150 w-full text-left no-underline
                ${isActive ? 'bg-zen-surface-2 text-zen-text' : 'text-zen-text-3 hover:bg-zen-surface hover:text-zen-text'}`}
            >
              <span
                className={`w-6 h-6 rounded-lg grid place-items-center font-mono text-[11px] border shrink-0
                  ${isActive || isDone ? 'bg-jade/14 text-jade border-jade/34' : 'bg-zen-surface-2 text-zen-text-3 border-zen-line'}`}
              >
                {month.monthNumber}
              </span>
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
              <span className="font-mono text-[10.5px] text-zen-text-4 shrink-0">
                {done}/{total}
              </span>
            </Link>
          ) : (
            <Link
              key={month.id}
              href={`/dashboard/month/${month.id}`}
              className={`w-8 h-8 rounded-lg grid place-items-center font-mono text-[11px] border transition-colors duration-150 no-underline
                ${isActive || isDone ? 'bg-jade/14 text-jade border-jade/34' : 'bg-zen-surface-2 text-zen-text-3 border-zen-line hover:border-jade/34 hover:text-jade hover:bg-jade/14'}`}
            >
              {month.monthNumber}
            </Link>
          );
        })}
      </div>

      {/* Path filter — expanded only */}
      {expanded && (
        <div className="px-4 pb-3 pt-3 border-t border-zen-line shrink-0">
          <h4 className="text-[11px] font-medium tracking-[0.02em] text-zen-text mb-2.5">
            Learning Path
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <PathButton
              name="No-Code"
              hint="N8N · Make"
              active={pathType === 'no-code'}
            />
            <PathButton
              name="Developer"
              hint="APIs · Code"
              active={pathType === 'developer'}
            />
          </div>
        </div>
      )}

      {/* Activity grid — expanded only */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-zen-line shrink-0">
          <div className="flex justify-between items-baseline text-[11px] tracking-[0.12em] uppercase text-zen-text-5 mb-2.5 pt-3">
            <span>Activity</span>
            <span className="font-mono text-ember tracking-[0.04em]">
              {streakCount}d
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {buildActivityGrid(activeDays).map((lvl, i) => (
              <div
                key={i}
                className={`aspect-square rounded-[4px] ${LEVEL_STYLE[lvl]}`}
              />
            ))}
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-zen-text-4 font-mono">
            <span>Less</span>
            <span className="inline-flex gap-1">
              {([0, 1, 2, 3, 4] as const).map((lvl) => (
                <span
                  key={lvl}
                  className={`w-2 h-2 rounded-[2px] ${LEVEL_STYLE[lvl]}`}
                />
              ))}
            </span>
            <span>More</span>
          </div>
        </div>
      )}

      {/* Collapse button — expanded only, overflows right edge */}
      {expanded && (
        <button
          onClick={onToggle}
          aria-label="Collapse sidebar"
          className="absolute -right-2.5 top-[52px] w-5 h-5 rounded-full bg-zen-surface-2 border border-zen-line-strong grid place-items-center text-zen-text-3 z-30 hover:text-zen-text transition-colors"
        >
          <PanelLeftClose size={11} />
        </button>
      )}
    </aside>
  );
}

function LogoIcon() {
  return (
    <Image
      src="/autozen.png"
      alt="AutoZen"
      width={40}
      height={40}
      className="block shrink-0 mb-2"
    />
  );
}

function NavLink({
  href,
  icon,
  label,
  expanded,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-[10px] whitespace-nowrap transition-colors duration-150 w-full relative no-underline
        ${expanded ? 'px-3 py-2.5' : 'justify-center p-2.5'}
        ${active ? 'bg-zen-surface-2 text-zen-text' : 'text-zen-text-3 hover:bg-zen-surface hover:text-zen-text'}`}
    >
      {active && expanded && (
        <span className="absolute -left-2.5 top-3.5 bottom-3.5 w-0.5 bg-jade rounded-sm" />
      )}
      {icon}
      {expanded && <span className="text-sm">{label}</span>}
    </Link>
  );
}

function PathButton({
  name,
  hint,
  active,
}: {
  name: string;
  hint: string;
  active: boolean;
}) {
  return (
    <button
      className={`text-left px-3 py-2.5 border rounded-[10px] flex flex-col gap-1 transition-colors duration-150
        ${
          active
            ? 'border-lavender bg-lavender/14'
            : 'border-zen-line bg-zen-surface-2 hover:bg-zen-surface'
        }`}
    >
      <span className="text-[13px] text-zen-text">{name}</span>
      <span className="font-mono text-[10.5px] text-zen-text-4">{hint}</span>
    </button>
  );
}
