import { queries } from "@/src/lib/db/queries";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  getProject: protectedProcedure.query(async () => {
    return await queries.projects.getProjectByRecent(3);
  }),
});

export type AppRouter = typeof appRouter;
