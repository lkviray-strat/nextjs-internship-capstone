import { queries } from "@/src/lib/db/queries";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const roleRouter = createTRPCRouter({
  getRoleByDescLimitOffset: protectedProcedure
    .input(
      z.object({
        offset: z.number().min(0).optional(),
        limit: z.number().min(1).optional(),
      })
    )
    .query(async ({ input }) => {
      return await queries.roles.getRoleByDescLimitOffset(
        input.limit,
        input.offset
      );
    }),
});
