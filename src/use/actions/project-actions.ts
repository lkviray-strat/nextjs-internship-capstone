"use server";

import { queries } from "@/src/lib/db/queries";
import {
  createProjectRequestSchema,
  updateProjectRequestSchema,
} from "@/src/lib/validations";
import type {
  CreateKanbanBoardsRequestInput,
  CreateProjectRequestInput,
  UpdateProjectRequestInput,
} from "@/src/types";
import z from "zod";
import { createKanbanBoardAction } from "./kanban-board-actions";

export async function createProjectAction(project: CreateProjectRequestInput) {
  try {
    const parsed = createProjectRequestSchema.parse(project);
    const result = await queries.projects.createProject(parsed);

    const kanbanBoard: CreateKanbanBoardsRequestInput = {
      name: "Default Board",
      projectId: result[0].id,
    };
    await createKanbanBoardAction(kanbanBoard);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function updateProjectAction(project: UpdateProjectRequestInput) {
  try {
    const existingProject = (
      await queries.projects.getProjectsById(project.id)
    ).at(0);
    if (!existingProject) {
      throw new Error("Project with the given ID does not exist");
    }

    const { id, ...parsedData } = updateProjectRequestSchema.parse(project);
    const result = await queries.projects.updateProject(id, parsedData);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function deleteProjectAction(id: string) {
  try {
    const existingProject = (await queries.projects.getProjectsById(id)).at(0);
    if (!existingProject) {
      throw new Error("Project with the given ID does not exist");
    }

    const result = await queries.projects.deleteProject(id);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}
