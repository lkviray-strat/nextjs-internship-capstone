import { queries } from "@/src/lib/db/queries";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const projectTeamRouter = createTRPCRouter({
  getProjectTeamsByProjectIdWithTeamMembers: protectedProcedure
    .input(z.object({ projectId: z.uuid(), teamId: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const teamMember = await queries.teamMembers.getTeamMembersByIds(
        ctx.auth.userId,
        input.teamId
      );

      if (teamMember.length === 0 || !teamMember[0].teamId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team member not found",
        });
      }

      const projectTeam = await queries.projectTeams.getProjectTeamsByIds(
        input.projectId,
        teamMember[0].teamId
      );

      if (projectTeam.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project team not found",
        });
      }

      return await queries.projectTeams.getProjectTeamsByProjectIdWithTeamMembers(
        input.projectId
      );
    }),
});
