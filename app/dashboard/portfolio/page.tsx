import { mockProjects } from "@/lib/mock-data";
import { KanbanBoard } from "@/components/portfolio/KanbanBoard";
import { Plus } from "lucide-react";

export default function PortfolioPage() {
  const total = mockProjects.length;
  const completed = mockProjects.filter((p) => p.status === "completed").length;
  const inProgress = mockProjects.filter((p) => p.status === "in-progress").length;

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
        <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] bg-jade text-jade-ink text-[13px] font-medium border-none hover:brightness-110 transition shrink-0">
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
      <KanbanBoard projects={mockProjects} />
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
