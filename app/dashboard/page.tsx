import { mockMonths, mockUser } from "@/lib/mock-data";
import { Play, ChevronRight, Plus } from "lucide-react";

function countAllTasks() {
  let done = 0;
  let total = 0;
  let monthsStarted = 0;
  for (const month of mockMonths) {
    let monthHasProgress = false;
    for (const week of month.weeks) {
      for (const item of week.items) {
        for (const task of item.tasks) {
          total++;
          if (task.completed) {
            done++;
            monthHasProgress = true;
          }
        }
      }
    }
    if (monthHasProgress) monthsStarted++;
  }
  return { done, total, monthsStarted };
}

export default function DashboardPage() {
  const { done, total, monthsStarted } = countAllTasks();

  const now = new Date();
  const hour = now.getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayName = dayNames[now.getDay()];
  const monthName = monthNames[now.getMonth()];
  const dateNum = now.getDate();

  return (
    <>
      {/* Page head */}
      <div className="flex items-end justify-between gap-4 mb-7">
        <div className="flex flex-col gap-2.5 min-w-0">
          <span className="text-zen-text-3 text-[13px]">
            {timeGreeting}, <em className="font-serif italic text-zen-text-2">{mockUser.name}</em>. Breathe in — today is {dayName}, {monthName} {dateNum}.
          </span>
          <h1 className="font-serif text-[36px] leading-tight tracking-tight m-0">
            Where you are on the path.
          </h1>
        </div>
        <div className="flex gap-2.5">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] border border-zen-line bg-transparent text-zen-text-2 text-[13px] font-medium hover:bg-zen-surface-2 transition">
            <Plus size={14} />
            Resource
          </button>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] bg-jade text-jade-ink text-[13px] font-medium border-none hover:brightness-110 transition">
            <Play size={14} />
            Resume learning
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr] gap-3.5 mb-5">
        <StatCard
          label="Overall Progress"
          value={`${mockUser.overallProgress}`}
          suffix="%"
          sub="On track"
          delta="+4% this week"
        />
        <StatCard
          label="Tasks Completed"
          value={`${done}`}
          suffix={`/${total}`}
          sub="Keep going"
        />
        <StatCard
          label="Months Started"
          value={`${monthsStarted}`}
          suffix="/6"
          sub="Good momentum"
        />
        <StatCard
          label="Current Streak"
          value={`${mockUser.streak}`}
          suffix="days"
          sub="Personal best: 18d"
        />
      </div>

      {/* Main grid: Roadmap + Today card */}
      <div className="grid grid-cols-[1.6fr_1fr] gap-4.5">
        <RoadmapTable />
        <TodayCard />
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  suffix,
  sub,
  delta,
}: {
  label: string;
  value: string;
  suffix: string;
  sub: string;
  delta?: string;
}) {
  return (
    <div className="p-5 rounded-[14px] border border-zen-line bg-zen-surface relative overflow-hidden">
      <div className="text-zen-text-4 text-[11.5px] tracking-[0.14em] uppercase">
        {label}
      </div>
      <div className="mt-3 font-serif text-[44px] leading-none tracking-tight">
        {value}
        <span className="font-mono text-base text-zen-text-3 ml-1 tracking-normal">
          {suffix}
        </span>
      </div>
      <div className="mt-2.5 text-zen-text-3 text-[12.5px] flex items-center gap-2">
        {sub}
        {delta && (
          <span className="text-jade font-mono text-[11.5px]">{delta}</span>
        )}
      </div>
    </div>
  );
}

function RoadmapTable() {
  return (
    <div className="border border-zen-line bg-zen-surface rounded-[14px] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-zen-line">
        <h2 className="text-base font-medium tracking-[0.005em] text-zen-text m-0">
          Roadmap Progress
        </h2>
        <div className="inline-flex p-[3px] bg-zen-surface-2 rounded-[10px] border border-zen-line">
          <button className="px-2.5 py-1.5 rounded-[7px] bg-zen-surface text-zen-text text-xs shadow-[0_1px_0_0_oklch(1_0_0/0.03)_inset,0_1px_1px_oklch(0_0_0/0.3)]">
            All
          </button>
          <button className="px-2.5 py-1.5 rounded-[7px] text-zen-text-3 text-xs">
            Active
          </button>
          <button className="px-2.5 py-1.5 rounded-[7px] text-zen-text-3 text-xs">
            Done
          </button>
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {mockMonths.map((month) => {
          let done = 0;
          let total = 0;
          for (const week of month.weeks) {
            for (const item of week.items) {
              for (const task of item.tasks) {
                total++;
                if (task.completed) done++;
              }
            }
          }
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const isActive = month.monthNumber === 2;

          return (
            <button
              key={month.id}
              className={`grid grid-cols-[48px_1fr_160px_120px_28px] gap-4 items-center px-5 py-4 border-b border-zen-line text-zen-text-2 transition-colors duration-150 w-full text-left
                ${isActive ? "bg-zen-surface-2" : "hover:bg-zen-surface-2"}`}
            >
              <span
                className={`font-mono text-[11px] tracking-[0.04em] ${isActive ? "text-jade" : "text-zen-text-4"}`}
              >
                M{month.monthNumber}
              </span>
              <div className="flex flex-col gap-1 min-w-0">
                <b className="font-medium text-zen-text text-sm">{month.title}</b>
                <span className="text-zen-text-4 text-xs truncate">
                  {month.goal}
                </span>
              </div>
              <div className="h-1 bg-zen-surface-2 rounded-full overflow-hidden">
                <div
                  className="block h-full bg-jade rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-mono text-xs text-zen-text-3 text-right">
                <b className="text-zen-text font-medium">{done}</b>/{total} tasks
              </span>
              <span className="text-zen-text-5 grid place-items-center">
                <ChevronRight size={14} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TodayCard() {
  // Find next unfinished items
  const todayItems: { title: string; type: string; duration: string; completed: boolean }[] = [];
  for (const month of mockMonths) {
    for (const week of month.weeks) {
      for (const item of week.items) {
        if (todayItems.length >= 4) break;
        todayItems.push({
          title: item.title,
          type: item.type,
          duration: "15 min",
          completed: item.completed,
        });
      }
      if (todayItems.length >= 4) break;
    }
    if (todayItems.length >= 4) break;
  }

  return (
    <div className="flex flex-col gap-4.5">
      {/* Today card */}
      <div className="border border-zen-line bg-zen-surface rounded-[14px] overflow-hidden">
        <div className="px-5 pt-4 pb-2 flex justify-between items-baseline">
          <h3 className="font-serif text-[22px] font-normal tracking-tight m-0">
            Today
          </h3>
          <span className="font-mono text-[11px] text-zen-text-4 tracking-[0.08em]">
            ~45 MIN
          </span>
        </div>
        <div className="px-5 pb-5 flex flex-col gap-3.5">
          {todayItems.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-[18px_1fr_auto] gap-3 items-start pt-3 first:pt-0 first:border-t-0 border-t border-dashed border-zen-line"
            >
              <span
                className={`w-[18px] h-[18px] rounded-[6px] border-[1.5px] mt-0.5 shrink-0 relative
                  ${item.completed
                    ? "bg-jade border-jade after:content-[''] after:absolute after:left-[4px] after:top-[1px] after:w-[4px] after:h-[9px] after:border-solid after:border-jade-ink after:border-0 after:border-r-2 after:border-b-2 after:rotate-45"
                    : "border-zen-line-strong"}`}
              />
              <div>
                <span
                  className={`text-sm leading-snug ${item.completed ? "text-zen-text-4 line-through" : "text-zen-text"}`}
                >
                  {item.title}
                </span>
                <div className="flex gap-2 mt-1 font-mono text-[11px] text-zen-text-4">
                  <span className="px-1.5 py-[1px] rounded bg-zen-surface-2 text-zen-text-3">
                    {item.type}
                  </span>
                </div>
              </div>
              <span className="font-mono text-[11px] text-zen-text-4">
                {item.duration}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Zen quote */}
      <div
        className="font-serif italic text-[17px] leading-relaxed text-zen-text-2 p-5 border border-zen-line rounded-[14px] bg-zen-surface relative"
      >
        <span
          className="font-serif text-[56px] leading-none text-jade/60 absolute left-3.5 top-0.5"
        >
          &ldquo;
        </span>
        <p className="mt-0 mb-1.5 ml-7.5">
          The secret of getting ahead is getting started.
        </p>
        <cite className="block ml-7.5 not-italic font-mono text-[11px] text-zen-text-4 tracking-[0.08em]">
          Mark Twain
        </cite>
      </div>
    </div>
  );
}
