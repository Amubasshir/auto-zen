"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Drawer } from "./Drawer";

type ResourceType = "youtube" | "docs" | "course" | "article" | "github";
type Difficulty = "beginner" | "intermediate" | "advanced";

const TYPES: { value: ResourceType; label: string }[] = [
  { value: "youtube", label: "YouTube" },
  { value: "docs", label: "Docs" },
  { value: "course", label: "Course" },
  { value: "article", label: "Article" },
  { value: "github", label: "GitHub" },
];

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

type Props = {
  open: boolean;
  weekTitle: string;
  onClose: () => void;
};

export function ResourceForm({ open, weekTitle, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<ResourceType>("youtube");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [duration, setDuration] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([""]);

  function addSubtask() {
    setSubtasks((prev) => [...prev, ""]);
  }

  function removeSubtask(i: number) {
    setSubtasks((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateSubtask(i: number, value: string) {
    setSubtasks((prev) => prev.map((s, idx) => (idx === i ? value : s)));
  }

  function handleSave() {
    // Session 9 will wire this to the real API
    onClose();
    setTitle("");
    setUrl("");
    setType("youtube");
    setDifficulty("beginner");
    setDuration("");
    setSubtasks([""]);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      kicker={<>Add Resource · {weekTitle}</>}
      title="New Resource"
      footer={
        <>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-jade text-jade-ink text-[13px] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
          >
            Save Resource
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-[10px] border border-zen-line text-zen-text-2 text-[13px] hover:bg-zen-surface transition"
          >
            Cancel
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3.5">
        {/* Title */}
        <Field label="Title">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Make.com webhook tutorial"
            className="w-full bg-zen-bg border border-zen-line text-zen-text px-3 py-2.5 rounded-[8px] text-[13.5px] outline-none focus:border-jade-line transition-colors placeholder:text-zen-text-5"
          />
        </Field>

        {/* URL */}
        <Field label="URL">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
            className="w-full bg-zen-bg border border-zen-line text-zen-text px-3 py-2.5 rounded-[8px] text-[13.5px] outline-none focus:border-jade-line transition-colors placeholder:text-zen-text-5"
          />
        </Field>

        {/* Type + Difficulty + Duration row */}
        <div className="grid grid-cols-3 gap-2.5">
          <Field label="Type">
            <SegControl
              options={TYPES}
              value={type}
              onChange={(v) => setType(v as ResourceType)}
            />
          </Field>
          <Field label="Difficulty">
            <SegControl
              options={DIFFICULTIES}
              value={difficulty}
              onChange={(v) => setDifficulty(v as Difficulty)}
            />
          </Field>
          <Field label="Duration">
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 45 min"
              className="w-full bg-zen-bg border border-zen-line text-zen-text px-3 py-2.5 rounded-[8px] text-[13.5px] outline-none focus:border-jade-line transition-colors placeholder:text-zen-text-5"
            />
          </Field>
        </div>

        {/* Subtasks */}
        <Field label="Subtasks">
          <div className="flex flex-col gap-2">
            {subtasks.map((task, i) => (
              <div key={i} className="grid grid-cols-[18px_1fr_22px] gap-2.5 items-center">
                <span className="w-4 h-4 rounded-[4px] border-[1.5px] border-dashed border-zen-line-strong shrink-0" />
                <input
                  type="text"
                  value={task}
                  onChange={(e) => updateSubtask(i, e.target.value)}
                  placeholder={`Task ${i + 1}`}
                  className="bg-zen-bg border border-zen-line text-zen-text px-3 py-2 rounded-[8px] text-[13px] outline-none focus:border-jade-line transition-colors placeholder:text-zen-text-5"
                />
                {subtasks.length > 1 && (
                  <button
                    onClick={() => removeSubtask(i)}
                    className="w-5.5 h-5.5 grid place-items-center text-zen-text-5 hover:text-danger transition-colors"
                    aria-label="Remove subtask"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addSubtask}
              className="flex items-center gap-1.5 text-[12px] text-zen-text-4 font-mono hover:text-zen-text-2 transition-colors mt-1"
            >
              <Plus size={12} />
              Add subtask
            </button>
          </div>
        </Field>
      </div>
    </Drawer>
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

function SegControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 p-[3px] bg-zen-surface-2 rounded-[8px] border border-zen-line">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2 py-1.5 rounded-[6px] text-[11px] transition-colors duration-150 flex-1
            ${value === opt.value
              ? "bg-zen-surface text-zen-text shadow-[0_1px_0_0_oklch(1_0_0/0.03)_inset,0_1px_1px_oklch(0_0_0/0.25)]"
              : "text-zen-text-3 hover:text-zen-text"}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
