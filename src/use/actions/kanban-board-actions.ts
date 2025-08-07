"use server";

import {
  DEFAULT_KANBAN_BOARD_COLUMNS,
  KANBAN_COLUMN_TW_COLORS,
} from "@/src/lib/db/enums";
import { queries } from "@/src/lib/db/queries";
import {
  createKanbanBoardsRequestSchema,
  updateKanbanBoardsRequestSchema,
} from "@/src/lib/validations";
import type {
  CreateKanbanBoardsRequestInput,
  CreateKanbanColumnRequestInput,
  UpdateKanbanBoardsRequestInput,
  UpdateProjectRequestInput,
} from "@/src/types";
import z from "zod";
import { enumToWord } from "../../lib/utils";
import { createKanbanColumnAction } from "./kanban-column-actions";
import { updateProjectAction } from "./project-actions";

export async function createKanbanBoardAction(
  board: CreateKanbanBoardsRequestInput
) {
  try {
    const parsed = createKanbanBoardsRequestSchema.parse(board);
    const result = await queries.kanbanBoards.createKanbanBoard(parsed);

    const defaultKanban: UpdateProjectRequestInput = {
      id: result[0].projectId as string,
      defaultBoardId: result[0].id,
    };
    await updateProjectAction(defaultKanban);

    DEFAULT_KANBAN_BOARD_COLUMNS.map(async (colName, idx) => {
      const name = enumToWord(colName);
      const column: CreateKanbanColumnRequestInput = {
        name,
        boardId: result[0].id,
        order: idx + 1,
        color: KANBAN_COLUMN_TW_COLORS[colName],
      };
      await createKanbanColumnAction(column);
    });

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
