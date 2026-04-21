"use client";

import { useState, useTransition } from "react";
import { MonthHead } from "./MonthHead";
import { WeekCard } from "./WeekCard";
import { ItemDrawer } from "@/components/overlays/ItemDrawer";
import { toggleItem, toggleTask } from "@/actions/progress";
import type { Month, Week, Item } from "@/lib/mock-data";
import type { ProgressState } from "@/lib/validators/progress";
import type { ClientResource } from "@/lib/validators/resource";

type SelectedItem = { item: Item; week: Week; month: Month };

type Props = {
  month: Month;
  weekOffset: number;
  initialProgress: ProgressState;
  initialResources: ClientResource[];
  initialNotes: Record<string, string>;
};

const CACHE_KEY = "az-cache-progress";

function writeCache(progress: ProgressState) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(progress));
  } catch { /* unavailable */ }
}

function countDoneTasksInMonth(month: Month, progress: ProgressState) {
  let done = 0;
  let total = 0;
  for (const week of month.weeks) {
    for (const item of week.items) {
      for (const task of item.tasks) {
        total++;
        const taskMap = progress.completedTasks[item.id];
        const taskDone = taskMap && task.id in taskMap ? taskMap[task.id] : task.completed;
        if (taskDone) done++;
      }
    }
  }
  return { done, total };
}

export function MonthPageClient({
  month,
  weekOffset,
  initialProgress,
  initialResources,
  initialNotes,
}: Props) {
  const [progress, setProgress] = useState<ProgressState>(initialProgress);
  const [resourcesByWeek, setResourcesByWeek] = useState<Record<string, ClientResource[]>>(
    () => {
      const map: Record<string, ClientResource[]> = {};
      for (const week of month.weeks) map[week.id] = [];
      for (const r of initialResources) {
        if (!map[r.weekId]) map[r.weekId] = [];
        map[r.weekId].push(r);
      }
      return map;
    },
  );
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [, startTransition] = useTransition();

  function handleItemToggle(itemId: string, completed: boolean) {
    const next: ProgressState = {
      ...progress,
      completedItems: { ...progress.completedItems, [itemId]: completed },
      lastActiveItem: itemId,
    };
    setProgress(next);
    writeCache(next);
    startTransition(async () => { await toggleItem(itemId, completed); });
  }

  function handleTaskToggle(itemId: string, taskId: string, completed: boolean) {
    const next: ProgressState = {
      ...progress,
      completedTasks: {
        ...progress.completedTasks,
        [itemId]: { ...(progress.completedTasks[itemId] ?? {}), [taskId]: completed },
      },
    };
    setProgress(next);
    writeCache(next);
    startTransition(async () => { await toggleTask(itemId, taskId, completed); });
  }

  function handleResourcesChange(weekId: string, updated: ClientResource[]) {
    setResourcesByWeek((prev) => ({ ...prev, [weekId]: updated }));
  }

  const { done: doneTasks, total: totalTasks } = countDoneTasksInMonth(month, progress);

  return (
    <>
      <MonthHead month={month} doneTasks={doneTasks} totalTasks={totalTasks} />

      <div className="flex flex-col gap-3">
        {month.weeks.map((week, i) => (
          <WeekCard
            key={week.id}
            week={week}
            weekIndex={weekOffset + i + 1}
            monthNumber={month.monthNumber}
            defaultOpen={i === 0}
            progress={progress}
            resources={resourcesByWeek[week.id] ?? []}
            initialNotes={initialNotes}
            onItemClick={(item) => setSelected({ item, week, month })}
            onItemToggle={handleItemToggle}
            onResourcesChange={handleResourcesChange}
          />
        ))}
      </div>

      <ItemDrawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        item={selected?.item ?? null}
        week={selected?.week ?? null}
        month={selected?.month ?? null}
        completedTasks={selected ? (progress.completedTasks[selected.item.id] ?? {}) : {}}
        onTaskToggle={handleTaskToggle}
        initialNoteContent={selected ? (initialNotes[`item-${selected.item.id}`] ?? "") : ""}
      />
    </>
  );
}
