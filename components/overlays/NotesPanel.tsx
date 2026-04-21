"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { saveNote } from "@/actions/notes";

type Props = {
  noteKey: string;
  initialContent?: string;
};

export function NotesPanel({ noteKey, initialContent = "" }: Props) {
  const [content, setContent] = useState(initialContent);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // True while the user has typed but the debounce hasn't fired yet
  const isPending = content !== useDebounce(content, 0);

  const debouncedContent = useDebounce(content, 1500);
  const isFirstRender = useRef(true);

  // Autosave whenever the debounced value settles (skip initial mount)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaving(true);
    setError("");

    saveNote(noteKey, debouncedContent)
      .then((result) => {
        setSaving(false);
        if (result.success) {
          setSavedAt(new Date());
        } else {
          setError(result.error ?? "Save failed");
        }
      })
      .catch(() => {
        setSaving(false);
        setError("Save failed");
      });
    // noteKey intentionally excluded — changing week closes the panel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent]);

  const savedLabel = savedAt
    ? `Saved ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "Not saved yet";

  return (
    <div className="border border-zen-line rounded-[14px] flex flex-col overflow-hidden min-h-70">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-zen-line shrink-0">
        <h4 className="m-0 text-[13px] font-medium text-zen-text">Notes</h4>

        <span className="font-mono text-[11px] text-zen-text-4 flex items-center gap-1.5">
          {error ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-danger" />
              {error}
            </>
          ) : saving || isPending ? (
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

      {/* Textarea */}
      <div className="flex-1 bg-zen-bg p-5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your notes for this week… ideas, blockers, wins."
          aria-label={`Notes for week ${noteKey}`}
          className="w-full h-full min-h-50 resize-none bg-transparent border-none outline-none text-zen-text-2 text-[14.5px] leading-relaxed placeholder:text-zen-text-5 font-sans"
        />
      </div>
    </div>
  );
}
