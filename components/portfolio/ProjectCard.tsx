"use client";

import { GitBranch, ExternalLink, Video, FileText, ArrowRight, Pencil, Trash2 } from "lucide-react";
import type { ClientProject } from "@/lib/validators/project";

type Props = {
  project: ClientProject;
  onStatusChange: (id: string) => void;
  onEdit: (project: ClientProject) => void;
  onDelete: (id: string) => void;
};

export function ProjectCard({ project, onStatusChange, onEdit, onDelete }: Props) {
  const hasLinks = project.githubUrl || project.demoUrl || project.loomUrl;

  const formattedDate = project.completedAt
    ? new Date(project.completedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="group bg-zen-surface border border-zen-line rounded-[10px] p-3.5 pb-3 flex flex-col gap-2.5 hover:border-zen-line-strong hover:-translate-y-px transition-all duration-150">
      {/* Title + actions */}
      <div className="flex items-start justify-between gap-2">
        <p className="m-0 text-sm text-zen-text font-medium leading-snug flex-1">
          {project.title}
        </p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(project)}
            aria-label="Edit project"
            className="p-1 rounded-[5px] text-zen-text-4 hover:text-zen-text hover:bg-zen-raised transition-colors"
          >
            <Pencil size={11} />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            aria-label="Delete project"
            className="p-1 rounded-[5px] text-zen-text-4 hover:text-danger transition-colors"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="m-0 text-[12.5px] text-zen-text-4 leading-relaxed line-clamp-3">
          {project.description}
        </p>
      )}

      {/* Case study */}
      {project.caseStudy && (
        <p className="m-0 text-[11.5px] text-jade font-mono leading-relaxed border-l-2 border-jade-line pl-2.5">
          {project.caseStudy}
        </p>
      )}

      {/* Links */}
      {hasLinks && (
        <div className="flex gap-1.5 flex-wrap">
          {project.githubUrl && (
            <ProjectLink href={project.githubUrl} icon={<GitBranch size={10} />} label="GitHub" />
          )}
          {project.demoUrl && (
            <ProjectLink href={project.demoUrl} icon={<ExternalLink size={10} />} label="Demo" />
          )}
          {project.loomUrl && (
            <ProjectLink href={project.loomUrl} icon={<Video size={10} />} label="Loom" />
          )}
          {project.caseStudy && (
            <ProjectLink href="#" icon={<FileText size={10} />} label="Case Study" />
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-2 border-t border-dashed border-zen-line font-mono text-[10.5px] text-zen-text-5">
        <span>{formattedDate ?? "In progress"}</span>
        <button
          onClick={() => onStatusChange(project.id)}
          aria-label="Advance status"
          className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 hover:text-zen-text transition-all duration-150"
        >
          <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
}

function ProjectLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded-[5px] border border-zen-line text-zen-text-3 no-underline hover:border-zen-line-strong hover:text-zen-text transition-colors duration-150"
    >
      {icon}
      {label}
    </a>
  );
}
