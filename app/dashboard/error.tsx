"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to error tracking in production
    if (process.env.NODE_ENV === "production") return;
    // eslint-disable-next-line no-console
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="w-12 h-12 rounded-full bg-ember/14 border border-ember/30 grid place-items-center">
        <span className="text-ember text-xl">!</span>
      </div>
      <div className="space-y-2">
        <h2 className="font-serif text-2xl text-zen-text">Something went wrong</h2>
        <p className="text-sm text-zen-text-3 max-w-sm">
          An unexpected error occurred. Try again or refresh the page.
        </p>
        {error.digest && (
          <p className="font-mono text-[11px] text-zen-text-5">ref: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-[10px] bg-zen-surface-2 border border-zen-line text-zen-text text-sm hover:bg-zen-surface-3 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
