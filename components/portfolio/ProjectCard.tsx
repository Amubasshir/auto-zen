"use client";

import { GitBranch, ExternalLink, Video, FileText, GripVertical } from "lucide-react";
import type { ProjectPortfolio } from "@/lib/mock-data";

type Props = {
  project: ProjectPortfolio;
};

export function ProjectCard({ project }: Props) {
  const hasLinks = project.githubUrl || project.demoUrl || project.loomUrl;

  const formattedDate = project.completedAt
    ? new Date(project.completedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="group bg-zen-surface border border-zen-line rounded-[10px] p-3.5 pb-3 flex flex-col gap-2.5 cursor-grab hover:border-zen-line-strong hover:-translate-y-px transition-all duration-150">
      {/* Title */}
      <p className="m-0 text-sm text-zen-text font-medium leading-snug">
        {project.title}
      </p>

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
        <GripVertical size={12} className="text-zen-text-5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
      className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.75 rounded-[5px] border border-zen-line text-zen-text-3 no-underline hover:border-zen-line-strong hover:text-zen-text transition-colors duration-150"
    >
      {icon}
      {label}
    </a>
  );
}
