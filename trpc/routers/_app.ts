import { queries } from "@/src/lib/db/queries";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  teams: {
    getMyTeams: protectedProcedure.query(async ({ ctx }) => {
      return await queries.teams.getTeamsByLeaderId(ctx.auth.userId);
    }),
  },
  projects: {
    getMyRecentProjects: protectedProcedure
      .input(
        z.object({
          teamId: z.guid(),
        })
      )
      .query(async ({ ctx, input }) => {
        const member = await queries.teamMembers.getTeamMembersByIds(
          ctx.auth.userId,
          input.teamId
        );
        if (member.length === 0) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not a member of this team.",
          });
        }

        return await queries.projects.getProjectsByTeamIdLimitAsc(
          3,
          input.teamId
        );
      }),
  },
});
