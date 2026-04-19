import { z } from "zod";

export const PatchProgressSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("item"),
    itemId: z.string().min(1),
    completed: z.boolean(),
  }),
  z.object({
    type: z.literal("task"),
    itemId: z.string().min(1),
    taskId: z.string().min(1),
    completed: z.boolean(),
  }),
]);

export type PatchProgressPayload = z.infer<typeof PatchProgressSchema>;

export type ProgressState = {
  completedItems: Record<string, boolean>;
  completedTasks: Record<string, Record<string, boolean>>;
  lastActiveItem?: string;
};

export const EMPTY_PROGRESS: ProgressState = {
  completedItems: {},
  completedTasks: {},
};
