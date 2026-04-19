"use client";

import { useState, useTransition } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { deleteResource } from "@/actions/resources";
import type { ClientResource } from "@/lib/validators/resource";

type Props = {
  resource: ClientResource;
  onEdit: (resource: ClientResource) => void;
  onDeleted: (id: string) => void;
};

const TYPE_META: Record<string, { label: string; className: string }> = {
  youtube: { label: "YouTube", className: "text-[oklch(0.78_0.08_28)] border-[oklch(0.78_0.08_28/0.4)]" },
  docs: { label: "Docs", className: "text-[oklch(0.82_0.05_240)] border-[oklch(0.82_0.05_240/0.4)]" },
  course: { label: "Course", className: "text-jade border-jade-line" },
  article: { label: "Article", className: "text-[oklch(0.82_0.06_90)] border-[oklch(0.82_0.06_90/0.4)]" },
  github: { label: "GitHub", className: "text-zen-text-2 border-zen-line" },
};

export function ResourceRow({ resource, onEdit, onDeleted }: Props) {
  const [, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);

  const typeMeta = TYPE_META[resource.type] ?? {
    label: resource.type,
    className: "text-zen-text-2 border-zen-line",
  };

  function handleDelete() {
    if (!confirm(`Delete "${resource.title}"?`)) return;
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
      className={`group grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-center px-5 py-3 border-b border-dashed border-zen-line last:border-b-0 transition-colors duration-150 hover:bg-zen-surface ${deleting ? "opacity-40 pointer-events-none" : ""}`}
    >
      {/* Title + custom badge */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm text-zen-text-2 truncate">{resource.title}</span>
        <span className="font-mono text-[10px] text-jade tracking-[0.06em] uppercase">
          Custom
        </span>
      </div>

      {/* Type tag */}
      <span className={`font-mono text-[10.5px] px-1.5 py-0.5 rounded-full border whitespace-nowrap ${typeMeta.className}`}>
        {typeMeta.label}
      </span>

      {/* Duration */}
      {resource.duration && (
        <span className="font-mono text-[11px] text-zen-text-4 whitespace-nowrap">
          {resource.duration}
        </span>
      )}

      {/* Open URL */}
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open resource"
        className="w-7 h-7 rounded-[6px] grid place-items-center text-zen-text-4 border border-transparent hover:bg-zen-surface-2 hover:border-zen-line hover:text-zen-text transition-colors"
      >
        <ExternalLink size={13} />
      </a>

      {/* Edit */}
      <button
        onClick={() => onEdit(resource)}
        aria-label="Edit resource"
        className="w-7 h-7 rounded-[6px] grid place-items-center text-zen-text-4 border border-transparent hover:bg-zen-surface-2 hover:border-zen-line hover:text-zen-text transition-colors"
      >
        <Pencil size={13} />
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        aria-label="Delete resource"
        className="w-7 h-7 rounded-[6px] grid place-items-center text-zen-text-4 border border-transparent hover:bg-danger/10 hover:border-danger/40 hover:text-danger transition-colors"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
