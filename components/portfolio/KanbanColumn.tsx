"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import type { ClientProject, ProjectStatus } from "@/lib/validators/project";

type Props = {
  status: ProjectStatus;
  projects: ClientProject[];
  draggedId: string | null;
  onDragStart: (id: string) => void;
  onDrop: (status: ProjectStatus) => void;
  onEdit: (project: ClientProject) => void;
  onDelete: (id: string) => void;
  onAddClick?: () => void;
};

const COLUMN_META: Record<ProjectStatus, { label: string; headingColor: string }> = {
  planned: {
    label: "Planned",
    headingColor: "text-zen-text-3",
  },
  "in-progress": {
    label: "In Progress",
    headingColor: "text-jade",
  },
  completed: {
    label: "Completed",
    headingColor: "text-lavender",
  },
};

export function KanbanColumn({
  status,
  projects,
  draggedId,
  onDragStart,
  onDrop,
  onEdit,
  onDelete,
  onAddClick,
}: Props) {
  const { label, headingColor } = COLUMN_META[status];
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (draggedId) setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    // Only clear if leaving the column entirely (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(status);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border rounded-[14px] p-3.5 flex flex-col gap-2.5 min-h-[400px] transition-colors duration-150 ${
        isDragOver
          ? "bg-zen-raised/80 border-jade/40"
          : "bg-zen-raised border-zen-line"
      }`}
    >
      {/* Column header */}
      <div className="flex justify-between items-center px-1 pb-2">
        <h4 className={`m-0 text-xs font-medium tracking-[0.12em] uppercase ${headingColor}`}>
          {label}
        </h4>
        <span className="font-mono text-[11px] text-zen-text-5">{projects.length}</span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2.5 flex-1">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDragStart={onDragStart}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}

        {/* Drop zone hint when dragging over an empty column */}
        {isDragOver && projects.length === 0 && (
          <div className="flex-1 rounded-[8px] border border-dashed border-jade/40 flex items-center justify-center min-h-[80px]">
            <span className="text-[11px] font-mono text-jade/60">Drop here</span>
          </div>
        )}
      </div>

      {/* Add button — only in Planned column */}
      {onAddClick && (
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-[8px] border border-dashed border-zen-line text-zen-text-4 text-[12px] font-mono tracking-[0.06em] hover:border-zen-line-strong hover:text-zen-text-3 transition-colors duration-150 mt-auto"
        >
          <Plus size={12} />
          Add project
        </button>
      )}
    </div>
  );
}
