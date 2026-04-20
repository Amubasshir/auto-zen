"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { createProject, updateProject } from "@/actions/projects";
import type { ClientProject, ProjectStatus } from "@/lib/validators/project";

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "planned", label: "Planned" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (project: ClientProject) => void;
  onUpdated: (id: string, updates: Partial<ClientProject>) => void;
  editing?: ClientProject | null;
};

export function AddProjectForm({ open, onClose, onCreated, onUpdated, editing }: Props) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [status, setStatus] = useState<ProjectStatus>(editing?.status ?? "planned");
  const [githubUrl, setGithubUrl] = useState(editing?.githubUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(editing?.demoUrl ?? "");
  const [loomUrl, setLoomUrl] = useState(editing?.loomUrl ?? "");
  const [caseStudy, setCaseStudy] = useState(editing?.caseStudy ?? "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!open) return null;

  function handleClose() {
    setError("");
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const payload = {
      title,
      description,
      status,
      githubUrl: githubUrl || undefined,
      demoUrl: demoUrl || undefined,
      loomUrl: loomUrl || undefined,
      caseStudy: caseStudy || undefined,
    };

    startTransition(async () => {
      if (editing) {
        const result = await updateProject(editing.id, payload);
        if (!result.success) {
          setError(result.error ?? "Failed to update project");
          return;
        }
        onUpdated(editing.id, payload);
      } else {
        const result = await createProject(payload);
        if (!result.success || !result.project) {
          setError(result.error ?? "Failed to create project");
          return;
        }
        onCreated(result.project);
      }
      handleClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-zen-base border border-zen-line rounded-[16px] p-6 flex flex-col gap-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="m-0 text-base font-medium text-zen-text">
            {editing ? "Edit Project" : "New Project"}
          </h3>
          <button
            onClick={handleClose}
            aria-label="Close form"
            className="p-1.5 rounded-[6px] text-zen-text-4 hover:text-zen-text hover:bg-zen-raised transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <Field label="Title *">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My awesome project"
              required
              className="w-full bg-zen-raised border border-zen-line rounded-[8px] px-3 py-2 text-sm text-zen-text placeholder:text-zen-text-5 focus:outline-none focus:border-jade transition-colors"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you build?"
              rows={3}
              className="w-full bg-zen-raised border border-zen-line rounded-[8px] px-3 py-2 text-sm text-zen-text placeholder:text-zen-text-5 focus:outline-none focus:border-jade transition-colors resize-none"
            />
          </Field>

          <Field label="Status">
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`flex-1 px-2 py-1.5 rounded-[7px] text-[12px] font-mono border transition-colors ${
                    status === opt.value
                      ? "border-jade bg-jade/10 text-jade"
                      : "border-zen-line text-zen-text-4 hover:border-zen-line-strong"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="GitHub URL">
            <input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              type="url"
              className="w-full bg-zen-raised border border-zen-line rounded-[8px] px-3 py-2 text-sm text-zen-text placeholder:text-zen-text-5 focus:outline-none focus:border-jade transition-colors"
            />
          </Field>

          <Field label="Demo URL">
            <input
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://..."
              type="url"
              className="w-full bg-zen-raised border border-zen-line rounded-[8px] px-3 py-2 text-sm text-zen-text placeholder:text-zen-text-5 focus:outline-none focus:border-jade transition-colors"
            />
          </Field>

          <Field label="Loom URL">
            <input
              value={loomUrl}
              onChange={(e) => setLoomUrl(e.target.value)}
              placeholder="https://loom.com/..."
              type="url"
              className="w-full bg-zen-raised border border-zen-line rounded-[8px] px-3 py-2 text-sm text-zen-text placeholder:text-zen-text-5 focus:outline-none focus:border-jade transition-colors"
            />
          </Field>

          <Field label="Case Study">
            <textarea
              value={caseStudy}
              onChange={(e) => setCaseStudy(e.target.value)}
              placeholder="Key insight or outcome..."
              rows={2}
              className="w-full bg-zen-raised border border-zen-line rounded-[8px] px-3 py-2 text-sm text-zen-text placeholder:text-zen-text-5 focus:outline-none focus:border-jade transition-colors resize-none"
            />
          </Field>

          {error && (
            <p className="m-0 text-[12px] text-danger">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 rounded-[8px] border border-zen-line text-zen-text-3 text-sm hover:border-zen-line-strong transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 rounded-[8px] bg-jade text-jade-ink text-sm font-medium hover:brightness-110 transition disabled:opacity-50"
            >
              {isPending ? "Saving…" : editing ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11.5px] font-mono text-zen-text-3 tracking-[0.06em] uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
