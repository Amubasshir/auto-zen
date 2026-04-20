"use client";

import { useState, useTransition } from "react";
import { Check, ChevronRight, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { deleteResource, toggleResourceCompleted } from "@/actions/resources";
import type { ClientResource } from "@/lib/validators/resource";

type Props = {
  resource: ClientResource;
  onOpen: (resource: ClientResource) => void;
  onEdit: (resource: ClientResource) => void;
  onDeleted: (id: string) => void;
  onToggled: (id: string, completed: boolean) => void;
};

const TYPE_META: Record<string, { label: string; className: string }> = {
  youtube: { label: "YouTube", className: "text-[oklch(0.78_0.08_28)] border-[oklch(0.78_0.08_28/0.4)]" },
  docs: { label: "Docs", className: "text-[oklch(0.82_0.05_240)] border-[oklch(0.82_0.05_240/0.4)]" },
  course: { label: "Course", className: "text-jade border-jade-line" },
  article: { label: "Article", className: "text-[oklch(0.82_0.06_90)] border-[oklch(0.82_0.06_90/0.4)]" },
  github: { label: "GitHub", className: "text-zen-text-2 border-zen-line" },
};

export function ResourceRow({ resource, onOpen, onEdit, onDeleted, onToggled }: Props) {
  const [, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);
  const [completed, setCompleted] = useState(resource.completed);
  const [toggling, setToggling] = useState(false);

  const typeMeta = TYPE_META[resource.type] ?? {
    label: resource.type,
    className: "text-zen-text-2 border-zen-line",
  };

  function handleToggle() {
    const next = !completed;
    setCompleted(next);
    setToggling(true);
    startTransition(async () => {
      await toggleResourceCompleted(resource.id, next);
      onToggled(resource.id, next);
      setToggling(false);
    });
  }

  function handleDelete() {
    if (!window.confirm(`Delete "${resource.title}"?`)) return;
    setDeleting(true);
    startTransition(async () => {
      const result = await deleteResource(resource.id);
      if (result.success) {
        onDeleted(resource.id);
      } else {
        setDeleting(false);
      }
    });
  }

  return (
    <div
      onClick={() => onOpen(resource)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(resource)}
      className={`group grid grid-cols-[22px_1fr_auto_auto_auto_auto_auto_auto_28px] gap-4 items-center px-5 py-3.25 border-b border-dashed border-zen-line last:border-b-0 transition-colors duration-150 hover:bg-zen-surface cursor-pointer ${deleting ? "opacity-40 pointer-events-none" : ""}`}
    >
      {/* Checkbox — same style as ItemRow */}
      <button
        onClick={(e) => { e.stopPropagation(); handleToggle(); }}
        disabled={toggling}
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
        className={`w-4.5 h-4.5 rounded-[6px] border-[1.5px] justify-self-center shrink-0 relative transition-all duration-150
          ${completed
            ? "bg-jade border-jade hover:brightness-110"
            : "border-zen-line-strong hover:border-jade/60"}`}
      >
        {completed && (
          <span className="absolute left-1 top-px w-1 h-2.25 border-solid border-jade-ink border-0 border-r-2 border-b-2 rotate-45 block" />
        )}
      </button>

      {/* Title + custom badge */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className={`text-sm truncate transition-colors duration-150 ${completed ? "line-through text-zen-text-4 decoration-zen-text-5" : "text-zen-text"}`}>
          {resource.title}
        </span>
        <span className="font-mono text-[10px] text-jade tracking-[0.06em] uppercase">
          Custom
        </span>
      </div>

      {/* Task count */}
      <span className="font-mono text-[11px] text-zen-text-4 whitespace-nowrap">
        {resource.tasks.length > 0 ? `${resource.tasks.length} tasks` : ""}
      </span>

      {/* Type tag */}
      <span className={`font-mono text-[10.5px] px-1.5 py-0.5 rounded-full border whitespace-nowrap ${typeMeta.className}`}>
        {typeMeta.label}
      </span>

      {/* Duration */}
      <span className="font-mono text-[11px] text-zen-text-4 min-w-12 text-right">
        {resource.duration ?? ""}
      </span>

      {/* Open URL — hover only */}
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open resource"
        onClick={(e) => e.stopPropagation()}
        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-[6px] grid place-items-center text-zen-text-4 border border-transparent hover:bg-zen-surface-2 hover:border-zen-line hover:text-zen-text transition-all duration-150"
      >
        <ExternalLink size={13} />
      </a>

      {/* Edit — hover only */}
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(resource); }}
        aria-label="Edit resource"
        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-[6px] grid place-items-center text-zen-text-4 border border-transparent hover:bg-zen-surface-2 hover:border-zen-line hover:text-zen-text transition-all duration-150"
      >
        <Pencil size={13} />
      </button>

      {/* Delete — hover only */}
      <button
        onClick={(e) => { e.stopPropagation(); handleDelete(); }}
        aria-label="Delete resource"
        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-[6px] grid place-items-center text-zen-text-4 border border-transparent hover:bg-danger/10 hover:border-danger/40 hover:text-danger transition-all duration-150"
      >
        <Trash2 size={13} />
      </button>

      {/* Chevron */}
      <ChevronRight
        size={14}
        className="text-zen-text-5 justify-self-end group-hover:text-zen-text-3 transition-colors duration-150"
      />
    </div>
  );
}
