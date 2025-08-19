import { queries } from "@/src/lib/db/queries";
import { projectFiltersSchema } from "@/src/lib/validations";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const projectRouter = createTRPCRouter({
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
  getProjectsBySearchAndPageAndFiltersAndOrder: protectedProcedure
    .input(projectFiltersSchema)
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

      return await queries.projects.getProjectsBySearchAndPageAndFiltersAndOrder(
        input
      );
    }),
});
