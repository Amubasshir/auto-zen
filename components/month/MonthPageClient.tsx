"use client";

import { useState } from "react";
import { MonthHead } from "./MonthHead";
import { WeekCard } from "./WeekCard";
import { ItemDrawer } from "@/components/overlays/ItemDrawer";
import type { Month, Week, Item } from "@/lib/mock-data";

type SelectedItem = { item: Item; week: Week; month: Month };

type Props = {
  month: Month;
  doneTasks: number;
  totalTasks: number;
  weekOffset: number;
};

export function MonthPageClient({ month, doneTasks, totalTasks, weekOffset }: Props) {
  const [selected, setSelected] = useState<SelectedItem | null>(null);

  function openItem(item: Item, week: Week) {
    setSelected({ item, week, month });
  }

  function closeDrawer() {
    setSelected(null);
  }

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
            onItemClick={(item) => openItem(item, week)}
          />
        ))}
      </div>

      <ItemDrawer
        open={selected !== null}
        onClose={closeDrawer}
        item={selected?.item ?? null}
        week={selected?.week ?? null}
        month={selected?.month ?? null}
      />
    </>
  );
}
