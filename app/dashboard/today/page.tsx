import { mockMonths, mockUser } from "@/lib/mock-data";
import type { Item, Month, Week } from "@/lib/mock-data";
import { TodayHero } from "@/components/today/TodayHero";
import { BreathWidget } from "@/components/today/BreathWidget";
import { PendingGrid } from "@/components/today/PendingGrid";
import { InactivityBanner } from "@/components/today/InactivityBanner";

type CurrentItem = { item: Item; week: Week; month: Month };

function findCurrentItem(): CurrentItem | null {
  for (const month of mockMonths) {
    for (const week of month.weeks) {
      for (const item of week.items) {
        if (!item.completed) {
          return { item, week, month };
        }
        // Pick an item that is partially done (some tasks incomplete)
        const hasIncompleteTasks = item.tasks.some((t) => !t.completed);
        if (hasIncompleteTasks) {
          return { item, week, month };
        }
      }
    }
  }
  return null;
}

function daysSinceLastActive(): number {
  // With mock data, we derive from the streak count and activity grid
  // If streak > 0 and today would be active, assume 0 days inactive
  // For mock purposes: streak 12 means active recently
  if (mockUser.streak > 0) return 0;
  return 4; // mock inactive state
}

export default function TodayPage() {
  const current = findCurrentItem();
  const inactiveDays = daysSinceLastActive();

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <>
      {/* Page head */}
      <div className="mb-6">
        <p className="m-0 text-zen-text-3 text-[13px]">
          {greeting}, <em className="font-serif italic text-zen-text-2">{mockUser.name}</em>.{" "}
          {dayNames[now.getDay()]}, {monthNames[now.getMonth()]} {now.getDate()}.
        </p>
        <h1 className="font-serif text-[36px] leading-tight tracking-tight m-0 mt-2">
          Your focus for today.
        </h1>
      </div>

      {/* Inactivity banner */}
      <InactivityBanner daysSinceActive={inactiveDays} />

      {/* Hero section: current item + breath widget */}
      {current ? (
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-4.5 mb-5.5">
          <TodayHero
            item={current.item}
            week={current.week}
            month={current.month}
          />
          <BreathWidget />
        </div>
      ) : (
        <div className="border border-jade-line bg-jade/7 rounded-[18px] p-9 mb-5.5 text-center">
          <p className="font-serif italic text-[28px] text-zen-text-2 m-0">
            All done for today!
          </p>
          <p className="text-zen-text-4 font-mono text-xs tracking-[0.08em] mt-3 m-0">
            You&apos;ve completed everything on the roadmap. Incredible work.
          </p>
        </div>
      )}

      {/* Pending items */}
      <PendingGrid months={mockMonths} />
    </>
  );
}
