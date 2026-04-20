"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { KanbanBoard } from "./KanbanBoard";
import { AddProjectForm } from "./AddProjectForm";
import { updateProject, deleteProject } from "@/actions/projects";
import type { ClientProject, ProjectStatus } from "@/lib/validators/project";

type Props = {
  initialProjects: ClientProject[];
};

export function PortfolioClient({ initialProjects }: Props) {
  const [projects, setProjects] = useState(initialProjects);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ClientProject | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const total = projects.length;
  const inProgress = projects.filter((p) => p.status === "in-progress").length;
  const completed = projects.filter((p) => p.status === "completed").length;

  function handleDragStart(id: string) {
    setDraggedId(id);
  }

  function handleDrop(newStatus: ProjectStatus) {
    if (!draggedId) return;
    const project = projects.find((p) => p.id === draggedId);
    if (!project || project.status === newStatus) {
      setDraggedId(null);
      return;
    }

    setProjects((prev) =>
      prev.map((p) => (p.id === draggedId ? { ...p, status: newStatus } : p)),
    );
    const id = draggedId;
    setDraggedId(null);
    startTransition(async () => {
      await updateProject(id, { status: newStatus });
    });
  }

  function handleEdit(project: ClientProject) {
    setEditing(project);
    setFormOpen(true);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    startTransition(async () => {
      await deleteProject(id);
    });
  }

  function handleCreated(project: ClientProject) {
    setProjects((prev) => [...prev, project]);
    setFormOpen(false);
    setEditing(null);
  }

  function handleUpdated(id: string, updates: Partial<ClientProject>) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
    setFormOpen(false);
    setEditing(null);
  }

  function openNewForm() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleClose() {
    setFormOpen(false);
    setEditing(null);
  }

  return (
    <>
      {/* Page head */}
      <div className="flex items-end justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2.5 min-w-0">
          <p className="m-0 text-zen-text-3 text-[13px]">
            Track what you&apos;ve built on your path to{" "}
            <em className="font-serif italic text-zen-text-2">AI Automation Builder</em>.
          </p>
          <h1 className="font-serif text-[36px] leading-tight tracking-tight m-0">
            Project Portfolio
          </h1>
        </div>
        <button
          onClick={openNewForm}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] bg-jade text-jade-ink text-[13px] font-medium border-none hover:brightness-110 transition shrink-0"
        >
          <Plus size={14} />
          New Project
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex gap-3 mb-6">
        <SummaryChip label="Total" value={total} color="text-zen-text-2" />
        <SummaryChip label="In Progress" value={inProgress} color="text-jade" />
        <SummaryChip label="Completed" value={completed} color="text-lavender" />
      </div>

      {/* Kanban board */}
      <KanbanBoard
        projects={projects}
        draggedId={draggedId}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddClick={openNewForm}
      />

      {/* Form overlay */}
      <AddProjectForm
        open={formOpen}
        onClose={handleClose}
        onCreated={handleCreated}
        onUpdated={handleUpdated}
        editing={editing}
      />
    </>
  );
}

function SummaryChip({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-zen-line bg-zen-surface text-[12px]">
      <span className={`font-mono font-medium ${color}`}>{value}</span>
      <span className="text-zen-text-3">{label}</span>
    </div>
  );
}
