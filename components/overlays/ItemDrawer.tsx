"use client";

import { ExternalLink, Play } from "lucide-react";
import { Drawer } from "./Drawer";
import { NotesPanel } from "./NotesPanel";
import type { Item, Week, Month } from "@/lib/mock-data";

type Props = {
  open: boolean;
  onClose: () => void;
  item: Item | null;
  week: Week | null;
  month: Month | null;
  /** Task completion state from real progress (taskId → boolean) */
  completedTasks?: Record<string, boolean>;
  /** Called when a task checkbox is toggled */
  onTaskToggle?: (itemId: string, taskId: string, completed: boolean) => void;
  initialNoteContent?: string;
};

const TYPE_LABEL: Record<string, string> = {
  youtube: "YouTube",
  docs: "Docs",
  course: "Course",
  article: "Article",
  github: "GitHub",
};

const TYPE_COLOR: Record<string, string> = {
  youtube: "text-[oklch(0.78_0.08_28)] border-[oklch(0.78_0.08_28/0.4)]",
  docs: "text-[oklch(0.82_0.05_240)] border-[oklch(0.82_0.05_240/0.4)]",
  course: "text-jade border-jade-line",
  article: "text-[oklch(0.82_0.06_90)] border-[oklch(0.82_0.06_90/0.4)]",
  github: "text-zen-text-2 border-zen-line",
};

export function ItemDrawer({
  open,
  onClose,
  item,
  week,
  month,
  completedTasks = {},
  onTaskToggle,
  initialNoteContent = "",
}: Props) {
  if (!item || !week || !month) return null;

  function isTaskDone(task: { id: string; completed: boolean }) {
    return task.id in completedTasks ? completedTasks[task.id] : task.completed;
  }

  const typeLabel = TYPE_LABEL[item.type] ?? item.type;
  const typeColor = TYPE_COLOR[item.type] ?? "text-zen-text-2 border-zen-line";
  const doneTasks = item.tasks.filter(isTaskDone).length;
  const totalTasks = item.tasks.length;
  const allDone = doneTasks === totalTasks && totalTasks > 0;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      kicker={
        <>
          <span>Month {month.monthNumber}</span>
          <span className="text-zen-text-5">·</span>
          <span>Week {week.weekNumber}</span>
          <span className="text-zen-text-5">·</span>
          <span className={`px-1.5 py-0.5 rounded-full border font-mono text-[10px] ${typeColor}`}>
            {typeLabel}
          </span>
        </>
      }
      title={item.title}
      footer={
        <>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-jade text-jade-ink text-[13px] font-medium no-underline hover:brightness-110 transition whitespace-nowrap shrink-0"
            >
              <Play size={14} />
              Open Resource
            </a>
          )}
          <button
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] border text-[13px] transition whitespace-nowrap shrink-0
              ${allDone ? "border-jade/40 text-jade bg-jade/7" : "border-zen-line text-zen-text-2 hover:bg-zen-surface"}`}
          >
            {allDone ? "✓ Completed" : "Mark Complete"}
          </button>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 ml-auto text-zen-text-4 text-[12px] font-mono no-underline hover:text-zen-text transition"
            >
              <ExternalLink size={12} />
              {item.url.replace(/^https?:\/\//, "").slice(0, 30)}…
            </a>
          )}
        </>
      }
    >
      {/* Meta chips */}
      <div className="flex gap-2 flex-wrap mb-5">
        <Chip>{typeLabel}</Chip>
        <Chip>~{totalTasks * 15} min</Chip>
        <Chip>{doneTasks}/{totalTasks} tasks</Chip>
        {allDone && <Chip className="text-jade border-jade-line bg-jade/7">Complete</Chip>}
      </div>

      {/* Tasks */}
      <p className="m-0 mb-2.5 text-[11px] tracking-[0.14em] uppercase text-zen-text-5">Tasks</p>
      <div className="flex flex-col mb-6">
        {item.tasks.map((task) => {
          const done = isTaskDone(task);
          return (
            <button
              key={task.id}
              onClick={() => onTaskToggle?.(item.id, task.id, !done)}
              className="grid grid-cols-[22px_1fr] gap-3 items-start py-3 border-b border-dashed border-zen-line last:border-b-0 text-left group"
            >
              <span
                className={`w-[18px] h-[18px] mt-0.5 rounded-[5px] border-[1.5px] relative shrink-0 transition-all duration-150
                  ${done ? "bg-jade border-jade" : "border-zen-line-strong group-hover:border-jade/60"}`}
              >
                {done && (
                  <span className="absolute left-[4px] top-[1px] w-[4px] h-[9px] border-solid border-jade-ink border-0 border-r-2 border-b-2 rotate-45 block" />
                )}
              </span>
              <span className={`text-sm leading-snug transition-colors ${done ? "text-zen-text-4 line-through decoration-zen-text-5" : "text-zen-text"}`}>
                {task.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notes */}
      <p className="m-0 mb-2.5 text-[11px] tracking-[0.14em] uppercase text-zen-text-5">Notes</p>
      <NotesPanel noteKey={`item-${item.id}`} initialContent={initialNoteContent} />
    </Drawer>
  );
}

function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 border border-zen-line rounded-full font-mono text-[11px] text-zen-text-3 ${className}`}>
      {children}
    </span>
  );
}
