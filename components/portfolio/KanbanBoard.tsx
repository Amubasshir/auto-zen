import { KanbanColumn } from "./KanbanColumn";
import type { ProjectPortfolio, ProjectStatus } from "@/lib/mock-data";

type Props = {
  projects: ProjectPortfolio[];
};

const COLUMNS: ProjectStatus[] = ["planned", "in-progress", "completed"];

export function KanbanBoard({ projects }: Props) {
  const byStatus = (status: ProjectStatus) =>
    projects.filter((p) => p.status === status);

  return (
    <div className="grid grid-cols-3 gap-3.5">
      {COLUMNS.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          projects={byStatus(status)}
        />
      ))}
    </div>
  );
}
