'use client';

import { createResource, updateResource } from '@/actions/resources';
import type { ClientResource } from '@/lib/validators/resource';
import { Plus, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Drawer } from './Drawer';

type ResourceType = 'youtube' | 'docs' | 'course' | 'article' | 'github';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const TYPES: { value: ResourceType; label: string }[] = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'docs', label: 'Docs' },
  { value: 'course', label: 'Course' },
  { value: 'article', label: 'Article' },
  { value: 'github', label: 'GitHub' },
];

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

type Props = {
  open: boolean;
  weekId: string;
  weekTitle: string;
  /** When provided, form opens in edit mode */
  editing?: ClientResource | null;
  onClose: () => void;
  onSaved?: (resource: ClientResource) => void;
};

export function ResourceForm({
  open,
  weekId,
  weekTitle,
  editing,
  onClose,
  onSaved,
}: Props) {
  const isEdit = !!editing;
  const [, startTransition] = useTransition();

  const [title, setTitle] = useState(editing?.title ?? '');
  const [url, setUrl] = useState(editing?.url ?? '');
  const [type, setType] = useState<ResourceType>(
    (editing?.type as ResourceType) ?? 'youtube',
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    (editing?.difficulty as Difficulty) ?? 'beginner',
  );
  const [duration, setDuration] = useState(editing?.duration ?? '');
  const [subtasks, setSubtasks] = useState<string[]>(
    editing?.tasks?.length ? editing.tasks : [''],
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Reset form when editing target changes
  function resetForm() {
    setTitle(editing?.title ?? '');
    setUrl(editing?.url ?? '');
    setType((editing?.type as ResourceType) ?? 'youtube');
    setDifficulty((editing?.difficulty as Difficulty) ?? 'beginner');
    setDuration(editing?.duration ?? '');
    setSubtasks(editing?.tasks?.length ? editing.tasks : ['']);
    setError('');
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSave() {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!url.trim()) {
      setError('URL is required.');
      return;
    }

    setError('');
    setSaving(true);

    const filledTasks = subtasks.filter((t) => t.trim().length > 0);

    startTransition(async () => {
      let result;
      if (isEdit && editing) {
        result = await updateResource(editing.id, {
          title: title.trim(),
          url: url.trim(),
          type,
          difficulty,
          duration,
          tasks: filledTasks,
        });
        if (result.success) {
          onSaved?.({
            ...editing,
            title,
            url,
            type,
            difficulty,
            duration,
            tasks: filledTasks,
          });
        }
      } else {
        result = await createResource({
          weekId,
          title: title.trim(),
          url: url.trim(),
          type,
          difficulty,
          duration,
          tasks: filledTasks,
        });
        if (result.success && result.resource) {
          onSaved?.(result.resource);
        }
      }

      setSaving(false);
      if (result?.success) {
        handleClose();
      } else {
        setError(result?.error ?? 'Something went wrong.');
      }
    });
  }

  function addSubtask() {
    setSubtasks((p) => [...p, '']);
  }
  function removeSubtask(i: number) {
    setSubtasks((p) => p.filter((_, idx) => idx !== i));
  }
  function updateSubtask(i: number, val: string) {
    setSubtasks((p) => p.map((s, idx) => (idx === i ? val : s)));
  }

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      kicker={
        <>
          {isEdit ? 'Edit Resource' : 'Add Resource'} · {weekTitle}
        </>
      }
      title={isEdit ? 'Edit Resource' : 'New Resource'}
      footer={
        <>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-jade text-jade-ink text-[13px] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Resource'}
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2.5 rounded-[10px] border border-zen-line text-zen-text-2 text-[13px] hover:bg-zen-surface transition"
          >
            Cancel
          </button>
          {error && (
            <p className="ml-2 text-danger font-mono text-[12px]">{error}</p>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-3.5">
        <Field label="Title">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Make.com webhook tutorial"
            className="w-full bg-zen-bg border border-zen-line text-zen-text px-3 py-2.5 rounded-[8px] text-[13.5px] outline-none focus:border-jade-line transition-colors placeholder:text-zen-text-5"
          />
        </Field>

        <Field label="URL">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
            className="w-full bg-zen-bg border border-zen-line text-zen-text px-3 py-2.5 rounded-[8px] text-[13.5px] outline-none focus:border-jade-line transition-colors placeholder:text-zen-text-5"
          />
        </Field>

        <Field label="Type">
          <SegControl
            options={TYPES}
            value={type}
            onChange={(v) => setType(v as ResourceType)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-2.5">
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
              className="w-full bg-zen-bg border border-zen-line text-zen-text px-3 py-2 rounded-[8px] text-[13.5px] outline-none focus:border-jade-line transition-colors placeholder:text-zen-text-5"
            />
          </Field>
        </div>

        <Field label="Subtasks">
          <div className="flex flex-col gap-2">
            {subtasks.map((task, i) => (
              <div
                key={i}
                className="grid grid-cols-[18px_1fr_22px] gap-2.5 items-center"
              >
                <span className="w-4 h-4 rounded-lg border-[1.5px] border-dashed border-zen-line-strong shrink-0" />
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
                    aria-label="Remove subtask"
                    className="w-5 h-5 grid place-items-center text-zen-text-5 hover:text-danger transition-colors"
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
    <div className="flex flex-wrap gap-1 p-0.75 bg-zen-surface-2 rounded-[8px] border border-zen-line">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2 py-1.5 rounded-[6px] text-[11px] transition-colors duration-150 flex-1
            ${
              value === opt.value
                ? 'bg-jade/15 text-jade shadow-[0_0_0_1px] shadow-jade/30'
                : 'text-zen-text-3 hover:text-zen-text'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
