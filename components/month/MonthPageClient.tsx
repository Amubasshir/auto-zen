"use client";

import { useState, useTransition } from "react";
import { MonthHead } from "./MonthHead";
import { WeekCard } from "./WeekCard";
import { ItemDrawer } from "@/components/overlays/ItemDrawer";
import { toggleItem, toggleTask } from "@/actions/progress";
import type { Month, Week, Item } from "@/lib/mock-data";
import type { ProgressState } from "@/lib/validators/progress";

type SelectedItem = { item: Item; week: Week; month: Month };

type Props = {
  month: Month;
  weekOffset: number;
  initialProgress: ProgressState;
};

const CACHE_KEY = "az-cache-progress";

function writeCache(progress: ProgressState) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(progress));
  } catch { /* storage unavailable in SSR or private mode */ }
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

export function MonthPageClient({ month, weekOffset, initialProgress }: Props) {
  const [progress, setProgress] = useState<ProgressState>(initialProgress);
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [, startTransition] = useTransition();

  function openItem(item: Item, week: Week) {
    setSelected({ item, week, month });
  }

  function closeDrawer() {
    setSelected(null);
  }

  function handleItemToggle(itemId: string, completed: boolean) {
    // Optimistic update
    const next: ProgressState = {
      ...progress,
      completedItems: { ...progress.completedItems, [itemId]: completed },
      lastActiveItem: itemId,
    };
    setProgress(next);
    writeCache(next);

    // Persist via Server Action (non-blocking)
    startTransition(async () => {
      await toggleItem(itemId, completed);
    });
  }

  function handleTaskToggle(itemId: string, taskId: string, completed: boolean) {
    const next: ProgressState = {
      ...progress,
      completedTasks: {
        ...progress.completedTasks,
        [itemId]: {
          ...(progress.completedTasks[itemId] ?? {}),
          [taskId]: completed,
        },
      },
    };
    setProgress(next);
    writeCache(next);

    startTransition(async () => {
      await toggleTask(itemId, taskId, completed);
    });
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
            defaultOpen={i === 0}
            progress={progress}
            onItemClick={(item) => openItem(item, week)}
            onItemToggle={handleItemToggle}
          />
        ))}
      </div>

      <ItemDrawer
        open={selected !== null}
        onClose={closeDrawer}
        item={selected?.item ?? null}
        week={selected?.week ?? null}
        month={selected?.month ?? null}
        completedTasks={
          selected ? (progress.completedTasks[selected.item.id] ?? {}) : {}
        }
        onTaskToggle={handleTaskToggle}
      />
    </>
  );
}
