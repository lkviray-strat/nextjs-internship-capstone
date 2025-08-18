import { queries } from "@/src/lib/db/queries";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const userRouter = createTRPCRouter({
  getUserById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return await queries.users.getUsersById(input);
  }),
  getUsersBySearch: protectedProcedure
    .input(
      z.object({
        query: z.string().max(100),
        limit: z.number().min(1).max(100).optional(),
      })
    )
    .query(async ({ input }) => {
      return await queries.users.getUsersBySearch(input.query, input.limit);
    }),
});
