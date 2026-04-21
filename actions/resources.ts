"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/connect";
import CustomResource from "@/lib/db/models/CustomResource";
import {
  CreateResourceSchema,
  UpdateResourceSchema,
  type ClientResource,
  type CreateResourceInput,
  type UpdateResourceInput,
} from "@/lib/validators/resource";

export async function fetchResourcesForWeeks(
  weekIds: string[],
): Promise<ClientResource[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    await dbConnect();
    const docs = await CustomResource.find({
      userId: session.user.id,
      weekId: { $in: weekIds },
    })
      .sort({ createdAt: 1 })
      .lean();

    return docs.map((d) => ({
      id: d._id.toString(),
      weekId: d.weekId,
      title: d.title,
      url: d.url,
      type: d.type,
      difficulty: d.difficulty,
      duration: d.duration,
      tasks: d.tasks ?? [],
      completedTasks: d.completedTasks ?? [],
      completed: d.completed ?? false,
      createdAt: d.createdAt?.toISOString() ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function createResource(
  input: CreateResourceInput,
): Promise<{ success: boolean; resource?: ClientResource; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = CreateResourceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await dbConnect();
    const doc = await CustomResource.create({
      userId: session.user.id,
      ...parsed.data,
    });

    revalidatePath("/dashboard", "layout");

    return {
      success: true,
      resource: {
        id: doc._id.toString(),
        weekId: doc.weekId,
        title: doc.title,
        url: doc.url,
        type: doc.type,
        difficulty: doc.difficulty,
        duration: doc.duration,
        tasks: doc.tasks ?? [],
        completedTasks: doc.completedTasks ?? [],
        completed: doc.completed ?? false,
        createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
      },
    };
  } catch {
    return { success: false, error: "Failed to create resource" };
  }
}

export async function updateResource(
  id: string,
  input: UpdateResourceInput,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = UpdateResourceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await dbConnect();
    const doc = await CustomResource.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: parsed.data },
      { new: true },
    );

    if (!doc) return { success: false, error: "Resource not found" };

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update resource" };
  }
}

export async function toggleResourceCompleted(
  id: string,
  completed: boolean,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    await dbConnect();
    const doc = await CustomResource.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: { completed } },
      { new: true },
    );

    if (!doc) return { success: false, error: "Resource not found" };

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update resource" };
  }
}

export async function deleteResource(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    await dbConnect();
    const doc = await CustomResource.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!doc) return { success: false, error: "Resource not found" };

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete resource" };
  }
}

export async function toggleResourceSubtask(
  id: string,
  index: number,
  completed: boolean,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    await dbConnect();
    const doc = await CustomResource.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: { [`completedTasks.${index}`]: completed } },
      { new: true },
    );
    if (!doc) return { success: false, error: "Resource not found" };
    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update subtask" };
  }
}

export async function setAllResourceSubtasks(
  id: string,
  completedTasks: boolean[],
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    await dbConnect();
    const doc = await CustomResource.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: { completedTasks } },
      { new: true },
    );
    if (!doc) return { success: false, error: "Resource not found" };
    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update subtasks" };
  }
}
