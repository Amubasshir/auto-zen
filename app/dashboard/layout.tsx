"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      />
      <div className="grid grid-rows-[64px_1fr] min-w-0">
        <Header />
        <main className="overflow-auto p-7 pb-20 content-scroll">{children}</main>
      </div>
    </div>
  );
}
