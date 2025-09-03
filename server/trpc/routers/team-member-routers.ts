import { queries } from "@/src/lib/db/queries";
import { hasPermission } from "@/src/lib/permissions";
import {
  createTeamMemberRequestSchema,
  teamMemberFiltersSchema,
  updateTeamMemberRequestSchema,
} from "@/src/lib/validations";
import {
  createTeamMembersAction,
  deleteTeamMembersAction,
  updateTeamMembersAction,
} from "@/src/use/actions/team-member-actions";
import { TRPCError } from "@trpc/server";
import console from "console";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const teamMemberRouter = createTRPCRouter({
  getMyTeams: protectedProcedure.query(async ({ ctx }) => {
    return await queries.teamMembers.getTeamMembersByUserIdWithTeams(
      ctx.auth.userId
    );
  }),
  getMyTeamMembers: protectedProcedure
    .input(
      z.object({
        teamId: z.guid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const teamMember = await queries.teamMembers.getTeamMembersByIds(
        ctx.auth.userId,
        input.teamId
      );

      if (teamMember.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You do not belong to this team",
        });
      }

      return await queries.teamMembers.getTeamMembersByTeamId(input.teamId);
    }),
  getTeamMembersByFilter: protectedProcedure
    .input(teamMemberFiltersSchema)
    .query(async ({ ctx, input }) => {
      const teamMember = await queries.teamMembers.getTeamMembersByIds(
        ctx.auth.userId,
        input.teamId
      );

      if (teamMember.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You do not belong to this team",
        });
      }

      return await queries.teamMembers.getTeamMembersByFilter(input);
    }),
  createTeamMember: protectedProcedure
    .input(createTeamMemberRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const perm = await hasPermission(ctx.auth.userId, input.teamId, {
        action: "create",
        resource: "team_member",
      });

      if (!perm) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to create a team member",
        });
      }

      return await createTeamMembersAction(input);
    }),
  updateTeamMember: protectedProcedure
    .input(updateTeamMemberRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const teamMember = await queries.teamMembers.getTeamMembersByIds(
        ctx.auth.userId,
        input.teamId
      );

      if (teamMember.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You do not belong to this team",
        });
      }

      const perm = await hasPermission(ctx.auth.userId, input.teamId, {
        action: "update",
        resource: "team_member",
      });

      console.log("Permission:", perm);
      if (!perm) {
        if (ctx.auth.userId !== input.userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You do not have permission to update a team member for this user.",
          });
        }
      }

      return await updateTeamMembersAction(input);
    }),
  deleteTeamMember: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        teamId: z.guid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const teamMember = await queries.teamMembers.getTeamMembersByIds(
        ctx.auth.userId,
        input.teamId
      );

      if (teamMember.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You do not belong to this team",
        });
      }

      const perm = await hasPermission(ctx.auth.userId, input.teamId, {
        action: "delete",
        resource: "team_member",
      });

      if (!perm) {
        if (ctx.auth.userId !== input.userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to delete this team member.",
          });
        }
      }

      return await deleteTeamMembersAction(input.userId, input.teamId);
    }),
});
