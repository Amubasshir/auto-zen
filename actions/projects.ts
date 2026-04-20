"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/connect";
import ProjectPortfolio from "@/lib/db/models/ProjectPortfolio";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  type ClientProject,
  type CreateProjectInput,
  type UpdateProjectInput,
} from "@/lib/validators/project";

function toClient(doc: {
  _id: { toString(): string };
  title: string;
  description?: string;
  status: string;
  githubUrl?: string;
  demoUrl?: string;
  loomUrl?: string;
  caseStudy?: string;
  completedAt?: Date;
  createdAt?: Date;
}): ClientProject {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description ?? "",
    status: doc.status as ClientProject["status"],
    githubUrl: doc.githubUrl,
    demoUrl: doc.demoUrl,
    loomUrl: doc.loomUrl,
    caseStudy: doc.caseStudy,
    completedAt: doc.completedAt?.toISOString(),
    createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function fetchProjects(): Promise<ClientProject[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    await dbConnect();
    const docs = await ProjectPortfolio.find({ userId: session.user.id })
      .sort({ createdAt: 1 })
      .lean();

    return docs.map(toClient);
  } catch {
    return [];
  }
}

export async function createProject(
  input: CreateProjectInput,
): Promise<{ success: boolean; project?: ClientProject; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = CreateProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await dbConnect();
    const doc = await ProjectPortfolio.create({
      userId: session.user.id,
      ...parsed.data,
    });

    revalidatePath("/dashboard/portfolio");
    return { success: true, project: toClient(doc) };
  } catch {
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = UpdateProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const update: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "completed") {
    update.completedAt = new Date();
  } else if (parsed.data.status !== undefined) {
    update.completedAt = null;
  }

  try {
    await dbConnect();
    const doc = await ProjectPortfolio.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: update },
      { new: true },
    );

    if (!doc) return { success: false, error: "Project not found" };

    revalidatePath("/dashboard/portfolio");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProject(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    await dbConnect();
    const doc = await ProjectPortfolio.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!doc) return { success: false, error: "Project not found" };

    revalidatePath("/dashboard/portfolio");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete project" };
  }
}
