"use server";

import { queries } from "@/src/lib/db/queries";
import {
  createTaskRequestSchema,
  updateTaskRequestSchema,
} from "@/src/lib/validations";
import type {
  CreateTaskRequestInput,
  UpdateTaskRequestInput,
} from "@/src/types";
import z from "zod";

export async function createTaskAction(task: CreateTaskRequestInput) {
  try {
    const parsed = createTaskRequestSchema.parse(task);
    const result = await queries.tasks.createTask(parsed);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function updateTaskAction(task: UpdateTaskRequestInput) {
  try {
    const existingTask = (await queries.tasks.getTasksById(task.id)).at(0);
    if (!existingTask) {
      throw new Error("Task with the given ID does not exist");
    }

    const { id, ...parsedData } = updateTaskRequestSchema.parse(task);
    const result = await queries.tasks.updateTask(id, parsedData);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function deleteTaskAction(taskId: number) {
  try {
    const existingTask = (await queries.tasks.getTasksById(taskId)).at(0);
    if (!existingTask) {
      throw new Error("Task with the given ID does not exist");
    }

    const result = await queries.tasks.deleteTask(taskId);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}
