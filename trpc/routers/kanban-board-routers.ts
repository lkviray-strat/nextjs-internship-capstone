import { queries } from "@/src/lib/db/queries";
import { kanbanBoardFiltersSchema } from "@/src/lib/validations";
import { createTRPCRouter, protectedProcedure } from "../init";

export const kanbanBoardRouter = createTRPCRouter({
  getKanbanBoardByFilters: protectedProcedure
    .input(kanbanBoardFiltersSchema)
    .query(async ({ input }) => {
      return await queries.kanbanBoards.getKanbanBoardByFilters(input);
    }),
});
