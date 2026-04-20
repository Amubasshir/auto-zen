"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ChevronRight, Play, LogOut, Menu } from "lucide-react";

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const labels: Record<string, string> = {
    dashboard: "Dashboard",
    today: "Today",
    portfolio: "Portfolio",
    month: "Month",
  };

  const crumbs: { label: string; href: string; current: boolean }[] = [
    { label: "AutoZen", href: "/dashboard", current: false },
  ];

  let path = "";
  for (let i = 0; i < segments.length; i++) {
    path += `/${segments[i]}`;
    const isLast = i === segments.length - 1;
    const label = labels[segments[i]] ?? segments[i];
    if (i === 0) continue;
    crumbs.push({ label, href: path, current: isLast });
  }

  if (segments.length === 1 && segments[0] === "dashboard") {
    crumbs[0].current = true;
  }

  return crumbs;
}

type HeaderProps = {
  streakCount: number;
  overallProgress: number;
  onMobileMenuToggle?: () => void;
};

export function Header({ streakCount, overallProgress, onMobileMenuToggle }: HeaderProps) {
  const crumbs = useBreadcrumbs();
  const { data: session } = useSession();

  const userName = session?.user?.name ?? "A";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="flex items-center gap-3 md:gap-4 px-4 md:px-5 border-b border-zen-line bg-zen-bg/80 backdrop-blur-[10px] sticky top-0 z-20">
      {/* Mobile hamburger */}
      {onMobileMenuToggle && (
        <button
          onClick={onMobileMenuToggle}
          aria-label="Open menu"
          className="md:hidden w-8 h-8 rounded-[8px] grid place-items-center text-zen-text-3 hover:bg-zen-surface hover:text-zen-text transition-colors shrink-0"
        >
          <Menu size={18} />
        </button>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2.5 text-[13px] min-w-0">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-2.5">
            {i > 0 && <ChevronRight size={12} className="text-zen-text-5 shrink-0" />}
            {crumb.current ? (
              <span className="text-zen-text">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-zen-text-3 hover:text-zen-text transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </div>

      <div className="flex-1" />

      {/* Global progress — hidden on mobile */}
      <div className="hidden md:flex items-center gap-3 min-w-65">
        <span className="font-mono text-xs text-zen-text-2 tracking-[0.02em]">
          {overallProgress}%
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-zen-surface-2 overflow-hidden">
          <div
            className="block h-full bg-jade rounded-full"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Streak chip */}
      <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border text-xs whitespace-nowrap border-ember/40 text-zen-text bg-zen-surface">
        <span className="w-1.5 h-1.5 rounded-full bg-ember" />
        {streakCount}d
      </span>

      {/* Resume button — hidden on mobile */}
      <button className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] bg-jade text-jade-ink text-[13px] font-medium border-none hover:brightness-110 transition">
        <Play size={14} />
        Resume
      </button>

      {/* Avatar + sign out */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full bg-linear-to-br from-zen-surface-3 to-zen-surface-2 border border-zen-line grid place-items-center text-xs text-zen-text-2 font-mono shrink-0"
          title={userName}
        >
          {userInitial}
        </div>

        {session && (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            aria-label="Sign out"
            className="w-8 h-8 rounded-[8px] grid place-items-center text-zen-text-4 border border-transparent hover:bg-zen-surface hover:text-zen-text hover:border-zen-line transition-colors duration-150"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </header>
  );
}
