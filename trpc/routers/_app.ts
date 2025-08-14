import { queries } from "@/src/lib/db/queries";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  getProject: protectedProcedure.query(async () => {
    return await queries.projects.getRecentProjects(3);
  }),
});
