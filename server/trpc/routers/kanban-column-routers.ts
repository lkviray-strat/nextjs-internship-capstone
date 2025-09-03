import { publishKanbanEvent } from "@/server/redis/kanban-pub";
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

      const kanbanColumn = await createKanbanColumnAction(input);

      await publishKanbanEvent({
        type: "kanban_column_created",
        clientId: ctx.clientId ?? "",
        payload: {
          teamId: input.teamId,
          projectId: input.projectId,
          kanbanColumn: kanbanColumn.data[0],
        },
      });

      return kanbanColumn;
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

      const kanbanColumn = await updateKanbanColumnAction(input);

      await publishKanbanEvent({
        type: "kanban_column_updated",
        clientId: ctx.clientId ?? "",
        payload: {
          teamId: input.teamId,
          projectId: input.projectId,
          kanbanColumn: kanbanColumn.data[0],
        },
      });

      return kanbanColumn;
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

      const kanbanColumn = await deleteKanbanColumnAction(input.id);

      await publishKanbanEvent({
        type: "kanban_column_deleted",
        clientId: ctx.clientId ?? "",
        payload: {
          teamId: input.teamId,
          projectId: input.projectId,
          id: kanbanColumn.data[0].id,
          boardId: kanbanColumn.data[0].boardId as string,
        },
      });

      return kanbanColumn;
    }),
});
