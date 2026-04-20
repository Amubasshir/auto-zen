"use client";

import { useState, useTransition } from "react";
import { ExternalLink, Pencil, Play } from "lucide-react";
import { Drawer } from "./Drawer";
import { NotesPanel } from "./NotesPanel";
import { toggleResourceCompleted } from "@/actions/resources";
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
}: Props) {
  const [, startTransition] = useTransition();
  const [completed, setCompleted] = useState(resource?.completed ?? false);

  // Sync local state when resource changes
  if (resource && completed !== resource.completed && !open) {
    setCompleted(resource.completed);
  }

  if (!resource) return null;

  const typeLabel = TYPE_LABEL[resource.type] ?? resource.type;
  const typeColor = TYPE_COLOR[resource.type] ?? "text-zen-text-2 border-zen-line";

  function handleToggleCompleted() {
    const next = !completed;
    setCompleted(next);
    startTransition(async () => {
      await toggleResourceCompleted(resource!.id, next);
      onToggled(resource!.id, next);
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-jade text-jade-ink text-[13px] font-medium no-underline hover:brightness-110 transition"
            >
              <Play size={14} />
              Open Resource
            </a>
          )}
          <button
            onClick={handleToggleCompleted}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] border text-[13px] transition
              ${completed ? "border-jade/40 text-jade bg-jade/7" : "border-zen-line text-zen-text-2 hover:bg-zen-surface"}`}
          >
            {completed ? "✓ Completed" : "Mark Complete"}
          </button>
          <button
            onClick={() => { onClose(); onEdit(resource); }}
            className="inline-flex items-center gap-1.5 ml-auto text-zen-text-4 text-[12px] font-mono hover:text-zen-text transition"
          >
            <Pencil size={12} />
            Edit
          </button>
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-zen-text-4 text-[12px] font-mono no-underline hover:text-zen-text transition"
            >
              <ExternalLink size={12} />
              {resource.url.replace(/^https?:\/\//, "").slice(0, 28)}…
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
        {resource.tasks.length > 0 && <Chip>{resource.tasks.length} subtasks</Chip>}
        {completed && <Chip className="text-jade border-jade-line bg-jade/7">Complete</Chip>}
      </div>

      {/* Subtasks */}
      {resource.tasks.length > 0 && (
        <>
          <p className="m-0 mb-2.5 text-[11px] tracking-[0.14em] uppercase text-zen-text-5">Subtasks</p>
          <div className="flex flex-col mb-6">
            {resource.tasks.map((task, i) => (
              <div
                key={i}
                className="grid grid-cols-[22px_1fr] gap-3 items-start py-3 border-b border-dashed border-zen-line last:border-b-0"
              >
                <span
                  className={`w-[18px] h-[18px] mt-0.5 rounded-[5px] border-[1.5px] relative shrink-0
                    ${completed ? "bg-jade border-jade" : "border-zen-line-strong"}`}
                >
                  {completed && (
                    <span className="absolute left-[4px] top-[1px] w-[4px] h-[9px] border-solid border-jade-ink border-0 border-r-2 border-b-2 rotate-45 block" />
                  )}
                </span>
                <span className={`text-sm leading-snug ${completed ? "text-zen-text-4 line-through decoration-zen-text-5" : "text-zen-text"}`}>
                  {task}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Notes */}
      {weekId && (
        <>
          <p className="m-0 mb-2.5 text-[11px] tracking-[0.14em] uppercase text-zen-text-5">Week Notes</p>
          <NotesPanel weekId={weekId} />
        </>
      )}
    </Drawer>
  );
}
