"use client";

import { useState } from "react";
import { saveOnboarding } from "@/actions/onboarding";
import { StepPath } from "@/components/onboarding/StepPath";
import { StepHours } from "@/components/onboarding/StepHours";
import { StepTarget } from "@/components/onboarding/StepTarget";
import { StepStart } from "@/components/onboarding/StepStart";
import Image from "next/image";

type PathType = "no-code" | "developer";

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [pathType, setPathType] = useState<PathType | null>(null);
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [weeklyTarget, setWeeklyTarget] = useState(5);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function canAdvance(): boolean {
    if (step === 1) return pathType !== null;
    if (step === 2) return weeklyHours >= 1;
    if (step === 3) return weeklyTarget >= 1;
    if (step === 4) return Boolean(startDate);
    return false;
  }

  async function handleNext() {
    if (!canAdvance()) return;

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }

    setSaving(true);
    setError(null);

    const result = await saveOnboarding({
      pathType: pathType!,
      weeklyHours,
      weeklyTarget,
      startDate,
    });

    if (!result.success) {
      setError(result.error);
      setSaving(false);
      return;
    }

    // Hard redirect — dashboard layout checks onboardingDone from DB directly
    window.location.href = "/dashboard";
  }

  return (
    <div className="w-full max-w-lg">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <Image src="/autozen.png" alt="AutoZen" width={56} height={56} className="block" />
        <p className="text-xs text-zen-muted">Let&apos;s set up your learning profile</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8 flex items-center gap-2.5">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full h-1.5 rounded-full bg-zen-surface overflow-hidden">
              <div
                className="h-full rounded-full transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-700"
                style={{
                  width: step >= s ? '100%' : step === s - 1 ? '0%' : '0%',
                  backgroundColor: step >= s ? 'var(--color-jade)' : 'transparent',
                }}
              />
            </div>
            <span
              className={`text-[10px] font-mono tracking-wider transition-colors duration-500 ${
                step >= s ? 'text-jade' : 'text-zen-muted'
              }`}
            >
              {s}
            </span>
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-zen-border bg-zen-raised p-8 shadow-xl">
        {step === 1 && <StepPath value={pathType} onChange={setPathType} />}
        {step === 2 && <StepHours value={weeklyHours} onChange={setWeeklyHours} />}
        {step === 3 && <StepTarget value={weeklyTarget} onChange={setWeeklyTarget} />}
        {step === 4 && <StepStart value={startDate} onChange={setStartDate} />}

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className="text-sm text-zen-muted hover:text-zen-text disabled:opacity-30 transition-colors cursor-pointer"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance() || saving}
            className="rounded-lg bg-jade px-6 py-2.5 text-sm font-semibold text-jade-ink disabled:opacity-40 hover:brightness-110 transition-all cursor-pointer"
          >
            {saving ? "Saving…" : step < TOTAL_STEPS ? "Continue →" : "Start Learning →"}
          </button>
        </div>
      </div>
    </div>
  );
}
