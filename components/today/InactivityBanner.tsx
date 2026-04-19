import { AlertTriangle } from "lucide-react";

type Props = {
  daysSinceActive: number;
};

export function InactivityBanner({ daysSinceActive }: Props) {
  if (daysSinceActive < 3) return null;

  let heading: string;
  let body: string;

  if (daysSinceActive >= 7) {
    heading = "It's been a while — want to restart?";
    body = "You've been away for over a week. Take a breath, pick up where you left off, and go at your own pace.";
  } else if (daysSinceActive >= 5) {
    heading = "You're falling a little behind";
    body = `${daysSinceActive} days without activity. A short session today keeps the momentum alive.`;
  } else {
    heading = "Ready to pick up where you left off?";
    body = `${daysSinceActive} days since your last session. Your progress is safe — let's continue.`;
  }

  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5 mb-4.5 border border-ember/30 bg-ember/7 rounded-[14px]">
      <div className="w-9 h-9 rounded-[10px] bg-ember/18 text-ember grid place-items-center shrink-0">
        <AlertTriangle size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="m-0 mb-1 font-serif font-normal text-[18px] text-zen-text">{heading}</h4>
        <p className="m-0 text-zen-text-3 text-[13px]">{body}</p>
      </div>
    </div>
  );
}
