import { queries } from "@/src/lib/db/queries";
import { hasPermission } from "@/src/lib/permissions";
import {
  createKanbanColumnRequestSchema,
  updateKanbanColumnRequestSchema,
} from "@/src/lib/validations";
import {
  createKanbanColumnAction,
  deleteKanbanColumnAction,
  updateKanbanColumnAction,
} from "@/src/use/actions/kanban-column-actions";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const kanbanColumnRouter = createTRPCRouter({
  createKanbanColumn: protectedProcedure
    .input(
      createKanbanColumnRequestSchema.extend({
        teamId: z.guid(),
        projectId: z.guid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const teamMember = await queries.teamMembers.getTeamMembersByIds(
        ctx.auth.userId,
        input.teamId
      );

      if (teamMember.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not a member of this team to create a kanban column",
        });
      }

      const projectTeam = await queries.projectTeams.getProjectTeamsByIds(
        input.projectId,
        input.teamId
      );

      if (projectTeam.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This project doesnt belong to this team.",
        });
      }

      const perm = await hasPermission(ctx.auth.userId, input.teamId, {
        action: "create",
        resource: "kanban_column",
      });

      if (!perm) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to create a kanban column in this team.",
        });
      }

      return await createKanbanColumnAction(input);
    }),
  updateKanbanColumn: protectedProcedure
    .input(
      updateKanbanColumnRequestSchema.extend({
        teamId: z.guid(),
        projectId: z.guid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const teamMember = await queries.teamMembers.getTeamMembersByIds(
        ctx.auth.userId,
        input.teamId
      );

      if (teamMember.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not a member of this team to update a kanban column",
        });
      }

      const projectTeam = await queries.projectTeams.getProjectTeamsByIds(
        input.projectId,
        input.teamId
      );

      if (projectTeam.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This project doesnt belong to this team.",
        });
      }

      const perm = await hasPermission(ctx.auth.userId, input.teamId, {
        action: "update",
        resource: "kanban_column",
      });

      if (!perm) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to update a kanban column in this team.",
        });
      }

      revalidatePath(`${input.teamId}/projects/${input.id}`);
      return await updateKanbanColumnAction(input);
    }),
  deleteKanbanColumn: protectedProcedure
    .input(z.object({ id: z.guid(), teamId: z.guid(), projectId: z.guid() }))
    .mutation(async ({ ctx, input }) => {
      const teamMember = await queries.teamMembers.getTeamMembersByIds(
        ctx.auth.userId,
        input.teamId
      );

      if (teamMember.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not a member of this team to delete a kanban column",
        });
      }

      const projectTeam = await queries.projectTeams.getProjectTeamsByIds(
        input.projectId,
        input.teamId
      );

      if (projectTeam.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This project doesnt belong to this team.",
        });
      }

      const perm = await hasPermission(ctx.auth.userId, input.teamId, {
        action: "delete",
        resource: "kanban_column",
      });

      if (!perm) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to delete a kanban column in this team.",
        });
      }

      revalidatePath(`${input.teamId}/projects/${input.id}`);
      return await deleteKanbanColumnAction(input.id);
    }),
});
