"use client";

import { mockUser } from "@/lib/mock-data";
import { ChevronRight, Play } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center gap-4 px-5 border-b border-zen-line bg-zen-bg/80 backdrop-blur-[10px] sticky top-0 z-20">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2.5 text-zen-text-3 text-[13px] min-w-0">
        <span className="text-zen-text-3">AutoZen</span>
        <ChevronRight size={12} className="text-zen-text-5" />
        <span className="text-zen-text">Dashboard</span>
      </div>

      <div className="flex-1" />

      {/* Progress */}
      <div className="flex items-center gap-3 min-w-[260px]">
        <span className="font-mono text-xs text-zen-text-2 tracking-[0.02em]">
          {mockUser.overallProgress}%
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-zen-surface-2 overflow-hidden">
          <div
            className="block h-full bg-jade rounded-full"
            style={{ width: `${mockUser.overallProgress}%` }}
          />
        </div>
      </div>

      {/* Streak chip */}
      <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border text-xs whitespace-nowrap border-ember/40 text-zen-text bg-zen-surface">
        <span className="w-1.5 h-1.5 rounded-full bg-ember" />
        {mockUser.streak}d
      </span>

      {/* Resume button */}
      <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] bg-jade text-jade-ink text-[13px] font-medium border-none hover:brightness-110 transition">
        <Play size={14} />
        Resume
      </button>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zen-surface-3 to-zen-surface-2 border border-zen-line grid place-items-center text-xs text-zen-text-2 font-mono">
        {mockUser.name.charAt(0)}
      </div>
    </header>
  );
}
