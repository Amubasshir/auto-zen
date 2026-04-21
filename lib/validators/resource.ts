import { z } from "zod";

export const ResourceTypeEnum = z.enum(["youtube", "docs", "course", "article", "github"]);
export const DifficultyEnum = z.enum(["beginner", "intermediate", "advanced"]);

export const CreateResourceSchema = z.object({
  weekId: z.string().min(1, "Week is required"),
  title: z.string().min(1, "Title is required").max(200).trim(),
  url: z.string().url("Must be a valid URL"),
  type: ResourceTypeEnum,
  difficulty: DifficultyEnum,
  duration: z.string().default(""),
  tasks: z.array(z.string().min(1)).default([]),
});

export const UpdateResourceSchema = CreateResourceSchema
  .omit({ weekId: true })
  .partial();

export type CreateResourceInput = z.infer<typeof CreateResourceSchema>;
export type UpdateResourceInput = z.infer<typeof UpdateResourceSchema>;

// Safe serialisable type passed to client components
export type ClientResource = {
  id: string;
  weekId: string;
  title: string;
  url: string;
  type: string;
  difficulty: string;
  duration: string;
  tasks: string[];
  completedTasks: boolean[];
  completed: boolean;
  createdAt: string;
};
