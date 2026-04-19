"use client";

import { useState } from "react";
import { ChevronRight, StickyNote, Plus } from "lucide-react";
import { ItemRow } from "./ItemRow";
import { NotesPanel } from "@/components/overlays/NotesPanel";
import { ResourceForm } from "@/components/overlays/ResourceForm";
import type { Item, Week } from "@/lib/mock-data";

type Props = {
  week: Week;
  weekIndex: number;
  defaultOpen?: boolean;
  onItemClick?: (item: Item) => void;
};

export function WeekCard({ week, weekIndex, defaultOpen = false, onItemClick }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [showNotes, setShowNotes] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);

  const totalTasks = week.items.reduce((s, item) => s + item.tasks.length, 0);
  const doneTasks = week.items.reduce(
    (s, item) => s + item.tasks.filter((t) => t.completed).length,
    0,
  );
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const estMinutes = totalTasks * 15;
  const estLabel =
    estMinutes >= 60
      ? `~${Math.round(estMinutes / 60)}h ${estMinutes % 60 > 0 ? `${estMinutes % 60}m` : ""}`.trim()
      : `~${estMinutes}m`;

  return (
    <>
      <div
        className={`border border-zen-line bg-zen-surface rounded-[14px] overflow-hidden transition-shadow duration-150 ${open ? "shadow-[0_2px_12px_oklch(0_0_0/0.2)]" : ""}`}
      >
        {/* Week header */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="grid grid-cols-[36px_1fr_140px_52px_28px] gap-4 items-center w-full px-5 py-4 text-left hover:bg-zen-surface-2 transition-colors duration-150"
        >
          <span className="w-8 h-8 rounded-[8px] grid place-items-center bg-zen-surface-2 border border-zen-line font-mono text-[12px] text-zen-text-2">
            W{weekIndex}
          </span>
          <div className="flex flex-col gap-[3px] min-w-0">
            <b className="font-medium text-zen-text text-[15px] truncate">{week.title}</b>
            <span className="text-zen-text-4 text-xs font-mono">
              {week.items.length} items · {estLabel}
            </span>
          </div>
          <div className="h-1 bg-zen-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-jade rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-xs text-zen-text-3 text-right">
            {doneTasks}/{totalTasks}
          </span>
          <ChevronRight
            size={16}
            className="text-zen-text-4 transition-transform duration-250 justify-self-end"
            style={{ transform: open ? "rotate(90deg)" : "none" }}
          />
        </button>

        {/* Week body */}
        {open && (
          <div className="border-t border-zen-line bg-zen-raised">
            {/* Toolbar */}
            <div className="flex items-center gap-2.5 px-5 py-2.5 border-b border-dashed border-zen-line text-[12px] text-zen-text-3">
              <span className="flex-1 truncate">
                Week {weekIndex} — {week.title}
              </span>
              <button
                onClick={() => setShowNotes((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] border text-[11px] transition-colors duration-150
                  ${showNotes
                    ? "border-jade-line text-jade bg-jade/7"
                    : "border-zen-line hover:bg-zen-surface hover:text-zen-text"}`}
              >
                <StickyNote size={12} />
                Notes
              </button>
              <button
                onClick={() => setShowResourceForm(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] border border-zen-line hover:bg-zen-surface hover:text-zen-text transition-colors duration-150 text-[11px]"
              >
                <Plus size={12} />
                Resource
              </button>
            </div>

            {/* Item rows */}
            <div className="flex flex-col">
              {week.items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onClick={() => onItemClick?.(item)}
                />
              ))}
            </div>

            {/* Inline notes panel */}
            {showNotes && (
              <div className="px-5 py-4 border-t border-zen-line">
                <NotesPanel weekId={week.id} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resource form drawer — rendered outside the card to avoid z-index stacking */}
      <ResourceForm
        open={showResourceForm}
        weekTitle={week.title}
        onClose={() => setShowResourceForm(false)}
      />
    </>
  );
}
