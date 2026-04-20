import { z } from "zod";

export const StatusEnum = z.enum(["planned", "in-progress", "completed"]);

export type ProjectStatus = z.infer<typeof StatusEnum>;

export const STATUS_ORDER: ProjectStatus[] = ["planned", "in-progress", "completed"];

export function nextStatus(current: ProjectStatus): ProjectStatus {
  const idx = STATUS_ORDER.indexOf(current);
  return STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
}

export const CreateProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).trim(),
  description: z.string().max(1000).default(""),
  status: StatusEnum.default("planned"),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  demoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  loomUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  caseStudy: z.string().max(2000).optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

export type ClientProject = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  githubUrl?: string;
  demoUrl?: string;
  loomUrl?: string;
  caseStudy?: string;
  completedAt?: string;
  createdAt: string;
};
