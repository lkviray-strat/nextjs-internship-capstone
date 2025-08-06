"use server";

import { queries } from "@/src/lib/db/queries";
import {
  createKanbanBoardsRequestSchema,
  updateKanbanBoardsRequestSchema,
} from "@/src/lib/validations";
import type {
  CreateKanbanBoardsRequestInput,
  UpdateKanbanBoardsRequestInput,
} from "@/src/types";
import z from "zod";

export async function createKanbanBoardAction(
  board: CreateKanbanBoardsRequestInput
) {
  try {
    const parsed = createKanbanBoardsRequestSchema.parse(board);
    const result = await queries.kanbanBoards.createKanbanBoard(parsed);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function updateKanbanBoardAction(
  board: UpdateKanbanBoardsRequestInput
) {
  try {
    const existingBoard = (
      await queries.kanbanBoards.getKanbanBoardById(board.id)
    ).at(0);
    if (!existingBoard) {
      throw new Error("Kanban board with the given ID does not exist");
    }

    const { id, ...parsedData } = updateKanbanBoardsRequestSchema.parse(board);
    const result = await queries.kanbanBoards.updateKanbanBoard(id, parsedData);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function deleteKanbanBoardAction(id: string) {
  try {
    const existingBoard = (
      await queries.kanbanBoards.getKanbanBoardById(id)
    ).at(0);
    if (!existingBoard) {
      throw new Error("Kanban board with the given ID does not exist");
    }

    const result = await queries.kanbanBoards.deleteKanbanBoard(id);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}
