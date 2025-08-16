import { queries } from "@/src/lib/db/queries";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  teams: {
    getMyTeams: protectedProcedure.query(async ({ ctx }) => {
      return await queries.teams.getTeamsByLeaderId(ctx.auth.userId as string);
    }),
  },

  getProject: protectedProcedure.query(async () => {
    return await queries.projects.getRecentProjects(3);
  }),
});
