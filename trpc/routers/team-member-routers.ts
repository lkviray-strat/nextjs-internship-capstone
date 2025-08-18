import { userHasPermission } from "@/src/lib/permissions";
import {
  createTeamMemberRequestSchema,
  updateTeamMemberRequestSchema,
} from "@/src/lib/validations";
import {
  createTeamMembersAction,
  deleteTeamMembersAction,
  updateTeamMembersAction,
} from "@/src/use/actions/team-member-actions";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const teamMemberRouter = createTRPCRouter({
  createTeamMembers: protectedProcedure
    .input(createTeamMemberRequestSchema)
    .mutation(async ({ input }) => {
      if (
        !(await userHasPermission(input.userId, input.teamId, {
          action: "create",
          resource: "team_member",
        }))
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to create a team member",
        });
      }
      return await createTeamMembersAction(input);
    }),
  updateTeamMembers: protectedProcedure
    .input(updateTeamMemberRequestSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.userId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update a team member for this user.",
        });
      }
      if (
        !(await userHasPermission(input.userId, input.teamId, {
          action: "update",
          resource: "team_member",
        }))
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to update a team member for this user.",
        });
      }
      return await updateTeamMembersAction(input);
    }),
  deleteTeamMembers: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        teamId: z.guid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to delete a team member for this user.",
        });
      }
      if (
        !(await userHasPermission(ctx.auth.userId, input.teamId, {
          action: "delete",
          resource: "team_member",
        }))
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to delete this team member.",
        });
      }
      return await deleteTeamMembersAction(input.userId, input.teamId);
    }),
});
