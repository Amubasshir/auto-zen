"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { PathProvider } from "@/lib/path-context";

type Props = {
  children: React.ReactNode;
  streakCount: number;
  activeDays: string[];
  overallProgress: number;
  pathType: "no-code" | "developer";
};

export function DashboardShell({ children, streakCount, activeDays, overallProgress, pathType }: Props) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <PathProvider pathType={pathType}>
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[268px] md:hidden">
            <Sidebar
              expanded={true}
              onToggle={() => setMobileMenuOpen(false)}
              streakCount={streakCount}
              activeDays={activeDays}
              pathType={pathType}
            />
          </div>
        </>
      )}

      {/* Main layout grid */}
      <div
        className={cn(
          "relative h-full z-1 grid",
          "[grid-template-columns:1fr]",
          "md:transition-[grid-template-columns] md:duration-400 md:ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          sidebarExpanded
            ? "md:[grid-template-columns:268px_1fr]"
            : "md:[grid-template-columns:72px_1fr]"
        )}
      >
        {/* Desktop sidebar — not in grid flow on mobile */}
        <div className="hidden md:block h-full">
          <Sidebar
            expanded={sidebarExpanded}
            onToggle={() => setSidebarExpanded((e) => !e)}
            streakCount={streakCount}
            activeDays={activeDays}
            pathType={pathType}
          />
        </div>

        {/* Content column */}
        <div className="grid grid-rows-[64px_1fr] min-w-0">
          <Header
            streakCount={streakCount}
            overallProgress={overallProgress}
            onMobileMenuToggle={() => setMobileMenuOpen(true)}
          />
          <main className="overflow-auto p-4 md:p-7 pb-20 content-scroll">
            <div className="max-w-[1180px] mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </PathProvider>
  );
}
