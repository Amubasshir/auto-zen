"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

type Props = {
  children: React.ReactNode;
  streakCount: number;
  activeDays: string[];
  overallProgress: number;
  pathType: "no-code" | "developer";
};

export function DashboardShell({ children, streakCount, activeDays, overallProgress, pathType }: Props) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div
      className="relative grid h-full z-1 transition-[grid-template-columns] duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      style={{
        gridTemplateColumns: sidebarExpanded ? "268px 1fr" : "72px 1fr",
      }}
    >
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((e) => !e)}
        streakCount={streakCount}
        activeDays={activeDays}
        pathType={pathType}
      />
      <div className="grid grid-rows-[64px_1fr] min-w-0">
        <Header streakCount={streakCount} overallProgress={overallProgress} />
        <main className="overflow-auto p-7 pb-20 content-scroll">{children}</main>
      </div>
    </div>
  );
}
