"use client";

import { useState } from "react";
import { ChevronRight, StickyNote, Plus } from "lucide-react";
import { ItemRow } from "./ItemRow";
import { ResourceRow } from "./ResourceRow";
import { NotesPanel } from "@/components/overlays/NotesPanel";
import { ResourceForm } from "@/components/overlays/ResourceForm";
import type { Week, Item } from "@/lib/mock-data";
import type { ProgressState } from "@/lib/validators/progress";
import type { ClientResource } from "@/lib/validators/resource";

type Props = {
  week: Week;
  weekIndex: number;
  defaultOpen?: boolean;
  progress: ProgressState;
  resources: ClientResource[];
  initialNoteContent?: string;
  onItemClick?: (item: Item) => void;
  onItemToggle?: (itemId: string, completed: boolean) => void;
  onResourcesChange?: (weekId: string, resources: ClientResource[]) => void;
};

function resolveItemDone(itemId: string, itemCompleted: boolean, progress: ProgressState) {
  return itemId in progress.completedItems
    ? progress.completedItems[itemId]
    : itemCompleted;
}

function resolveTaskDoneCount(
  itemId: string,
  tasks: { id: string; completed: boolean }[],
  progress: ProgressState,
) {
  return tasks.filter((t) => {
    const taskMap = progress.completedTasks[itemId];
    return taskMap && t.id in taskMap ? taskMap[t.id] : t.completed;
  }).length;
}

export function WeekCard({
  week,
  weekIndex,
  defaultOpen = false,
  progress,
  resources,
  initialNoteContent = "",
  onItemClick,
  onItemToggle,
  onResourcesChange,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [showNotes, setShowNotes] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResource, setEditingResource] = useState<ClientResource | null>(null);

  const totalTasks = week.items.reduce((s, item) => s + item.tasks.length, 0);
  const doneTasks = week.items.reduce(
    (s, item) => s + resolveTaskDoneCount(item.id, item.tasks, progress),
    0,
  );
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const estMinutes = totalTasks * 15;
  const estLabel =
    estMinutes >= 60
      ? `~${Math.round(estMinutes / 60)}h ${estMinutes % 60 > 0 ? `${estMinutes % 60}m` : ""}`.trim()
      : `~${estMinutes}m`;

  function openAddForm() {
    setEditingResource(null);
    setShowResourceForm(true);
  }

  function openEditForm(resource: ClientResource) {
    setEditingResource(resource);
    setShowResourceForm(true);
  }

  function handleResourceSaved(saved: ClientResource) {
    const updated = editingResource
      ? resources.map((r) => (r.id === saved.id ? saved : r))
      : [...resources, saved];
    onResourcesChange?.(week.id, updated);
  }

  function handleResourceDeleted(id: string) {
    onResourcesChange?.(week.id, resources.filter((r) => r.id !== id));
  }

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
          <div className="flex flex-col gap-0.75 min-w-0">
            <b className="font-medium text-zen-text text-[15px] truncate">{week.title}</b>
            <span className="text-zen-text-4 text-xs font-mono">
              {week.items.length} items
              {resources.length > 0 && ` · ${resources.length} custom`}
              {" · "}
              {estLabel}
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
              <span className="flex-1 truncate">Week {weekIndex} — {week.title}</span>
              <button
                onClick={() => setShowNotes((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] border text-[11px] transition-colors duration-150
                  ${showNotes ? "border-jade-line text-jade bg-jade/7" : "border-zen-line hover:bg-zen-surface hover:text-zen-text"}`}
              >
                <StickyNote size={12} />
                Notes
              </button>
              <button
                onClick={openAddForm}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] border border-zen-line hover:bg-zen-surface hover:text-zen-text transition-colors duration-150 text-[11px]"
              >
                <Plus size={12} />
                Resource
              </button>
            </div>

            {/* Roadmap item rows */}
            <div className="flex flex-col">
              {week.items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  isDone={resolveItemDone(item.id, item.completed, progress)}
                  doneTasks={resolveTaskDoneCount(item.id, item.tasks, progress)}
                  onClick={() => onItemClick?.(item)}
                  onToggle={(completed) => onItemToggle?.(item.id, completed)}
                />
              ))}
            </div>

            {/* Custom resource rows */}
            {resources.length > 0 && (
              <div className="border-t border-dashed border-zen-line flex flex-col">
                {resources.map((resource) => (
                  <ResourceRow
                    key={resource.id}
                    resource={resource}
                    onEdit={openEditForm}
                    onDeleted={handleResourceDeleted}
                  />
                ))}
              </div>
            )}

            {/* Inline notes panel */}
            {showNotes && (
              <div className="px-5 py-4 border-t border-zen-line">
                <NotesPanel weekId={week.id} initialContent={initialNoteContent} />
              </div>
            )}
          </div>
        )}
      </div>

      <ResourceForm
        open={showResourceForm}
        weekId={week.id}
        weekTitle={week.title}
        editing={editingResource}
        onClose={() => setShowResourceForm(false)}
        onSaved={handleResourceSaved}
      />
    </>
  );
}
