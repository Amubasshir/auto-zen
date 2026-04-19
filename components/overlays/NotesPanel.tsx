"use client";

import { useState, useCallback } from "react";

type Props = {
  weekId: string;
  initialContent?: string;
};

export function NotesPanel({ weekId, initialContent = "" }: Props) {
  const [content, setContent] = useState(initialContent);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);

  // Simulate autosave (Session 10 will wire this to the real API)
  const handleChange = useCallback((value: string) => {
    setContent(value);
    setSaving(true);
    // Debounce simulation — in real app this will be useDebounce → Server Action
    const timer = setTimeout(() => {
      setSaving(false);
      setSavedAt(new Date());
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const savedLabel = savedAt
    ? `Saved ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "Not saved yet";

  return (
    <div className="border border-zen-line rounded-[14px] flex flex-col overflow-hidden min-h-[280px]">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-zen-line shrink-0">
        <h4 className="m-0 text-[13px] font-medium text-zen-text">Notes</h4>
        <span className="font-mono text-[11px] text-zen-text-4 flex items-center gap-1.5">
          {saving ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
              Saving…
            </>
          ) : savedAt ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-jade" />
              {savedLabel}
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-zen-surface-3" />
              Auto-save on
            </>
          )}
        </span>
      </div>

      {/* Textarea body */}
      <div className="flex-1 bg-zen-bg p-5">
        <textarea
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write your notes for this week… ideas, blockers, wins."
          aria-label={`Notes for week ${weekId}`}
          className="w-full h-full min-h-[200px] resize-none bg-transparent border-none outline-none text-zen-text-2 text-[14.5px] leading-relaxed placeholder:text-zen-text-5 font-sans"
        />
      </div>

      {/* Blinking caret style */}
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
