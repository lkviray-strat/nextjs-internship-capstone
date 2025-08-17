import { queries } from "@/src/lib/db/queries";
import { userHasPermission } from "@/src/lib/permissions";
import {
  createTeamRequestSchema,
  updateTeamRequestSchema,
} from "@/src/lib/validations";
import {
  createTeamAction,
  deleteTeamAction,
  updateTeamAction,
} from "@/src/use/actions/team-actions";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const teamRouter = createTRPCRouter({
  getMyTeams: protectedProcedure.query(async ({ ctx }) => {
    return await queries.teams.getTeamsByLeaderId(ctx.auth.userId);
  }),
  createTeams: protectedProcedure
    .input(createTeamRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.auth.userId !== input.leaderId;
      if (user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to create a team for this user.",
        });
      }
      return await createTeamAction(input);
    }),
  updateTeams: protectedProcedure
    .input(updateTeamRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const team = await queries.teams.getTeamsById(input.id);
      if (team[0].leaderId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update a team for this user.",
        });
      }
      if (
        !(await userHasPermission(ctx.auth.userId, team[0].id, {
          action: "update",
          resource: "team",
        }))
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to update this team.",
        });
      }
      return await updateTeamAction(input);
    }),
  deleteTeams: protectedProcedure
    .input(z.guid())
    .mutation(async ({ ctx, input }) => {
      const team = await queries.teams.getTeamsById(input);
      if (team[0].leaderId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to delete a team for this user.",
        });
      }
      if (
        !(await userHasPermission(ctx.auth.userId, team[0].id, {
          action: "delete",
          resource: "team",
        }))
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to delete this team.",
        });
      }
      return await deleteTeamAction(input);
    }),
});
