"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    // eslint-disable-next-line no-console
    console.error("[RootError]", error);
  }, [error]);

  return (
    <div className="min-h-screen grid place-items-center bg-zen-bg px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="w-14 h-14 rounded-full bg-ember/14 border border-ember/30 grid place-items-center">
          <span className="text-ember text-2xl">!</span>
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-zen-text">Something went wrong</h1>
          <p className="text-sm text-zen-text-3 max-w-sm">
            An unexpected error occurred. You can try again or return to the dashboard.
          </p>
          {error.digest && (
            <p className="font-mono text-[11px] text-zen-text-5">ref: {error.digest}</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-[10px] bg-zen-surface-2 border border-zen-line text-zen-text text-sm hover:bg-zen-surface-3 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-[10px] bg-jade text-jade-ink text-sm font-medium hover:brightness-110 transition no-underline"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
