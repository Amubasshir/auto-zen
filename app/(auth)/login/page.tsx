"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGitHub() {
    await signIn("github", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="w-full max-w-sm">
      {/* Brand */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="w-10 h-10 grid place-items-center">
          <svg width="40" height="40" viewBox="0 0 28 28" fill="none" className="text-jade">
            <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2" />
            <path d="M9 14.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-serif text-[28px] tracking-tight text-zen-text">AutoZen</h1>
        <p className="text-zen-text-3 text-[13px] text-center">
          Welcome back. Continue your path.
        </p>
      </div>

      {/* Card */}
      <div className="bg-zen-surface border border-zen-line rounded-[18px] p-7 flex flex-col gap-5">
        {/* GitHub OAuth */}
        <button
          onClick={handleGitHub}
          className="flex items-center justify-center gap-2.5 w-full px-4 py-2.5 rounded-[10px] border border-zen-line bg-zen-surface-2 text-zen-text text-[13px] font-medium hover:bg-zen-surface-3 hover:border-zen-line-strong transition-colors duration-150"
        >
          <GitHubIcon />
          Continue with GitHub
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zen-line" />
          <span className="font-mono text-[11px] text-zen-text-5 tracking-[0.08em]">OR</span>
          <div className="flex-1 h-px bg-zen-line" />
        </div>

        {/* Credentials form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full bg-zen-bg border border-zen-line text-zen-text px-3 py-2.5 rounded-[8px] text-[13.5px] outline-none focus:border-jade-line transition-colors placeholder:text-zen-text-5"
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-zen-bg border border-zen-line text-zen-text px-3 py-2.5 rounded-[8px] text-[13.5px] outline-none focus:border-jade-line transition-colors placeholder:text-zen-text-5"
            />
          </Field>

          {error && (
            <p className="text-danger text-[12.5px] font-mono m-0">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-[10px] bg-jade text-jade-ink text-[13px] font-medium hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      {/* Footer link */}
      <p className="text-center text-zen-text-4 text-[13px] mt-5">
        New to AutoZen?{" "}
        <Link href="/signup" className="text-jade hover:text-jade/80 transition-colors">
          Create an account
        </Link>
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] tracking-[0.12em] uppercase text-zen-text-4 font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-zen-text-2">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
