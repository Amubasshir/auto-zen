import { KanbanColumn } from "./KanbanColumn";
import type { ClientProject, ProjectStatus } from "@/lib/validators/project";

type Props = {
  projects: ClientProject[];
  onStatusChange: (id: string) => void;
  onEdit: (project: ClientProject) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
};

const COLUMNS: ProjectStatus[] = ["planned", "in-progress", "completed"];

export function KanbanBoard({ projects, onStatusChange, onEdit, onDelete, onAddClick }: Props) {
  const byStatus = (status: ProjectStatus) =>
    projects.filter((p) => p.status === status);

  return (
    <div className="grid grid-cols-3 gap-3.5">
      {COLUMNS.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          projects={byStatus(status)}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddClick={onAddClick}
        />
      ))}
    </div>
  );
}
