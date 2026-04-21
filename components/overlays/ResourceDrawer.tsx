"use client";

import { useState, useTransition, useEffect } from "react";
import { Check, ExternalLink, Play } from "lucide-react";
import { Drawer } from "./Drawer";
import { NotesPanel } from "./NotesPanel";
import { toggleResourceCompleted, toggleResourceSubtask, setAllResourceSubtasks } from "@/actions/resources";
import type { ClientResource } from "@/lib/validators/resource";

type Props = {
  open: boolean;
  onClose: () => void;
  resource: ClientResource | null;
  weekId: string | null;
  weekIndex: number | null;
  monthNumber: number | null;
  onEdit: (resource: ClientResource) => void;
  onToggled: (id: string, completed: boolean) => void;
  onSubtasksChanged?: (id: string, completedTasks: boolean[]) => void;
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

function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 border border-zen-line rounded-full font-mono text-[11px] text-zen-text-3 ${className}`}>
      {children}
    </span>
  );
}

export function ResourceDrawer({
  open,
  onClose,
  resource,
  weekId,
  weekIndex,
  monthNumber,
  onEdit,
  onToggled,
  onSubtasksChanged,
  initialNoteContent = "",
}: Props) {
  const [, startTransition] = useTransition();
  const [completed, setCompleted] = useState(resource?.completed ?? false);
  const [subtasksDone, setSubtasksDone] = useState<boolean[]>([]);

  // Sync state whenever the resource changes (different drawer opened, or same resource refreshed)
  useEffect(() => {
    if (resource) {
      const ct = resource.completedTasks ?? [];
      setSubtasksDone(resource.tasks.map((_, i) => ct[i] ?? false));
      setCompleted(resource.completed);
    }
  }, [resource?.id]);

  if (!resource) return null;

  const typeLabel = TYPE_LABEL[resource.type] ?? resource.type;
  const typeColor = TYPE_COLOR[resource.type] ?? "text-zen-text-2 border-zen-line";
  const doneCount = subtasksDone.filter(Boolean).length;
  const totalCount = resource.tasks.length;

  function handleSubtaskToggle(index: number) {
    const next = subtasksDone.map((v, i) => (i === index ? !v : v));
    setSubtasksDone(next);
    onSubtasksChanged?.(resource!.id, next);

    startTransition(async () => {
      await toggleResourceSubtask(resource!.id, index, next[index]);
    });

    // Auto-complete when all subtasks done (guard against empty array vacuous truth)
    if (next.length > 0 && next.every(Boolean) && !completed) {
      setCompleted(true);
      startTransition(async () => {
        await toggleResourceCompleted(resource!.id, true);
        onToggled(resource!.id, true);
      });
    }
    // Auto-incomplete when any subtask unchecked
    if (!next[index] && completed) {
      setCompleted(false);
      startTransition(async () => {
        await toggleResourceCompleted(resource!.id, false);
        onToggled(resource!.id, false);
      });
    }
  }

  function handleToggleCompleted() {
    const next = !completed;
    setCompleted(next);
    const nextSubtasks = resource!.tasks.map(() => next);
    setSubtasksDone(nextSubtasks);
    onSubtasksChanged?.(resource!.id, nextSubtasks);

    startTransition(async () => {
      await toggleResourceCompleted(resource!.id, next);
      onToggled(resource!.id, next);
      if (resource!.tasks.length > 0) {
        await setAllResourceSubtasks(resource!.id, nextSubtasks);
      }
    });
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      kicker={
        <>
          {monthNumber !== null && <span>Month {monthNumber}</span>}
          {monthNumber !== null && <span className="text-zen-text-5">·</span>}
          {weekIndex !== null && <span>Week {weekIndex}</span>}
          {weekIndex !== null && <span className="text-zen-text-5">·</span>}
          <span className={`px-1.5 py-0.5 rounded-full border font-mono text-[10px] ${typeColor}`}>
            {typeLabel}
          </span>
        </>
      }
      title={resource.title}
      footer={
        <>
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-jade text-jade-ink text-[13px] font-medium no-underline hover:brightness-110 transition whitespace-nowrap shrink-0"
            >
              <Play size={14} />
              Open Resource
            </a>
          )}
          <button
            onClick={handleToggleCompleted}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] border text-[13px] transition whitespace-nowrap shrink-0
              ${completed ? "border-jade/40 text-jade bg-jade/7" : "border-zen-line text-zen-text-2 hover:bg-zen-surface"}`}
          >
            {completed ? "✓ Completed" : "Mark Complete"}
          </button>
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 ml-auto text-zen-text-4 text-[12px] font-mono no-underline hover:text-zen-text transition"
            >
              <ExternalLink size={12} />
              {resource.url.replace(/^https?:\/\//, "").slice(0, 30)}…
            </a>
          )}
        </>
      }
    >
      {/* Meta chips */}
      <div className="flex gap-2 flex-wrap mb-5">
        <Chip>{typeLabel}</Chip>
        {resource.duration && <Chip>{resource.duration}</Chip>}
        <Chip className="capitalize">{resource.difficulty}</Chip>
        {totalCount > 0 && <Chip>{doneCount}/{totalCount} subtasks</Chip>}
        {completed && <Chip className="text-jade border-jade-line bg-jade/7">Complete</Chip>}
      </div>

      {/* Subtasks */}
      {resource.tasks.length > 0 && (
        <>
          <p className="m-0 mb-2.5 text-[11px] tracking-[0.14em] uppercase text-zen-text-5">Subtasks</p>
          <div className="flex flex-col mb-6">
            {resource.tasks.map((task, i) => {
              const done = subtasksDone[i] ?? false;
              return (
                <button
                  key={i}
                  onClick={() => handleSubtaskToggle(i)}
                  className="grid grid-cols-[22px_1fr] gap-3 items-start py-3 border-b border-dashed border-zen-line last:border-b-0 text-left hover:bg-zen-surface/50 transition-colors duration-150 -mx-5 px-5 rounded-none"
                >
                  <span
                    className={`w-4.5 h-4.5 mt-0.5 rounded-[5px] border-[1.5px] relative shrink-0 transition-all duration-150
                      ${done ? "bg-jade border-jade" : "border-zen-line-strong"}`}
                  >
                    {done && (
                      <Check size={11} strokeWidth={2.5} className="absolute inset-0 m-auto text-jade-ink" />
                    )}
                  </span>
                  <span className={`text-sm leading-snug transition-colors duration-150 ${done ? "text-zen-text-4 line-through decoration-zen-text-5" : "text-zen-text"}`}>
                    {task}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Notes */}
      <p className="m-0 mb-2.5 text-[11px] tracking-[0.14em] uppercase text-zen-text-5">Notes</p>
      <NotesPanel noteKey={`resource-${resource.id}`} initialContent={initialNoteContent} />
    </Drawer>
  );
}
