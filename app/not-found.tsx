import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-zen-bg px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="font-mono text-[80px] leading-none text-zen-surface-3 select-none">
          404
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-zen-text">Page not found</h1>
          <p className="text-sm text-zen-text-3 max-w-sm">
            This page doesn&apos;t exist. It may have been moved or removed.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-[10px] bg-jade text-jade-ink text-sm font-medium hover:brightness-110 transition no-underline"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
