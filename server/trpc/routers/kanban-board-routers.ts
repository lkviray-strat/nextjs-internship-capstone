import { queries } from "@/src/lib/db/queries";
import { kanbanBoardFiltersSchema } from "@/src/lib/validations";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const kanbanBoardRouter = createTRPCRouter({
  getKanbanBoardsByProjectId: protectedProcedure
    .input(z.guid())
    .query(async ({ input }) => {
      return await queries.kanbanBoards.getKanbanBoardByProjectId(input);
    }),
  getKanbanBoardByFilters: protectedProcedure
    .input(kanbanBoardFiltersSchema)
    .query(async ({ input }) => {
      return await queries.kanbanBoards.getKanbanBoardByFilters(input);
    }),
});
