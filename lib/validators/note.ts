import { z } from "zod";

export const CreateNoteSchema = z.object({
  weekId: z.string().min(1, "Week is required"),
  content: z.string().default(""),
});

export const UpdateNoteSchema = z.object({
  content: z.string(),
});

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
