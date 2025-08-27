"use server";

import { queries } from "@/src/lib/db/queries";
import {
  createKanbanColumnRequestSchema,
  updateKanbanColumnRequestSchema,
} from "@/src/lib/validations";
import type {
  CreateKanbanColumnRequestInput,
  UpdateKanbanBoardsRequestInput,
} from "@/src/types";
import z from "zod";

export async function createKanbanColumnAction(
  column: CreateKanbanColumnRequestInput
) {
  try {
    const parsed = createKanbanColumnRequestSchema.parse(column);
    const result = await queries.kanbanColumns.createKanbanColumn(parsed);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function updateKanbanColumnAction(
  column: UpdateKanbanBoardsRequestInput
) {
  try {
    const existingColumn = (
      await queries.kanbanColumns.getKanbanColumnById(column.id)
    ).at(0);
    if (!existingColumn) {
      throw new Error("Kanban column with the given ID does not exist");
    }

    const { id, ...parsedData } = updateKanbanColumnRequestSchema.parse(column);
    const result = await queries.kanbanColumns.updateKanbanColumn(
      id,
      parsedData
    );

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function deleteKanbanColumnAction(id: string) {
  try {
    const existingColumn = (
      await queries.kanbanColumns.getKanbanColumnById(id)
    ).at(0);
    if (!existingColumn) {
      throw new Error("Kanban column with the given ID does not exist");
    }

    const existingColumnTasks =
      await queries.tasks.getTasksByKanbanColumnId(id);

    if (existingColumnTasks.length > 0) {
      throw new Error("Kanban column contains tasks");
    }
    const result = await queries.kanbanColumns.deleteKanbanColumn(id);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}
