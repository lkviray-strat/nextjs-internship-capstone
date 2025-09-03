import { queries } from "@/src/lib/db/queries";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const projectTeamRouter = createTRPCRouter({
  getProjectTeamsByTeamId: protectedProcedure
    .input(z.object({ teamId: z.guid() }))
    .query(async ({ input }) => {
      const projectTeams = await queries.projectTeams.getProjectTeamsByTeamId(
        input.teamId
      );

      if (projectTeams.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project teams not found",
        });
      }

      return projectTeams;
    }),
  getProjectTeamsByProjectIdWithTeamMembers: protectedProcedure
    .input(z.object({ projectId: z.guid(), teamId: z.guid() }))
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
