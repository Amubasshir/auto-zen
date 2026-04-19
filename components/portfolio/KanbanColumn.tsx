import { Plus } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import type { ProjectPortfolio, ProjectStatus } from "@/lib/mock-data";

type Props = {
  status: ProjectStatus;
  projects: ProjectPortfolio[];
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

export function KanbanColumn({ status, projects }: Props) {
  const { label, headingColor } = COLUMN_META[status];

  return (
    <div className="bg-zen-raised border border-zen-line rounded-[14px] p-3.5 flex flex-col gap-2.5 min-h-[400px]">
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
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Add button */}
      <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-[8px] border border-dashed border-zen-line text-zen-text-4 text-[12px] font-mono tracking-[0.06em] hover:border-zen-line-strong hover:text-zen-text-3 transition-colors duration-150 mt-auto">
        <Plus size={12} />
        Add project
      </button>
    </div>
  );
}
