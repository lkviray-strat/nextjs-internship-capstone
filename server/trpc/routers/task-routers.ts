import { publishKanbanEvent } from "@/server/redis/kanban-pub";
import { queries } from "@/src/lib/db/queries";
import { hasPermission } from "@/src/lib/permissions";
import {
  createTaskRequestSchema,
  updateTaskRequestSchema,
} from "@/src/lib/validations";
import {
  createTaskAction,
  deleteTaskAction,
  updateTaskAction,
} from "@/src/use/actions/task-actions";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const taskRouter = createTRPCRouter({
  createTask: protectedProcedure
    .input(
      createTaskRequestSchema.extend({
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
          message: "You are not a member of this team to create a task",
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
        resource: "task",
      });

      if (!perm) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to create a task in this team.",
        });
      }

      const task = await createTaskAction(input);

      await publishKanbanEvent({
        type: "task_created",
        payload: {
          teamId: input.teamId,
          projectId: input.projectId,
          task: task.data[0],
        },
      });

      return task;
    }),
  updateTask: protectedProcedure
    .input(
      updateTaskRequestSchema.extend({
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
          message: "You are not a member of this team to update a task",
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
        resource: "task",
      });

      if (!perm) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to update a kanban column in this team.",
        });
      }

      const task = await updateTaskAction(input);

      await publishKanbanEvent({
        type: "task_updated",
        payload: {
          teamId: input.teamId,
          projectId: input.projectId,
          task: task.data[0],
        },
      });

      return task;
    }),
  deleteTask: protectedProcedure
    .input(z.object({ id: z.number(), teamId: z.guid(), projectId: z.guid() }))
    .mutation(async ({ ctx, input }) => {
      const teamMember = await queries.teamMembers.getTeamMembersByIds(
        ctx.auth.userId,
        input.teamId
      );

      if (teamMember.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this team to delete a task",
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
        const task = await queries.tasks.getTasksById(input.id);
        const hasRelations =
          ctx.auth.userId !== task[0]?.createdById ||
          ctx.auth.userId !== task[0]?.assigneeId;
        if (!hasRelations) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You do not have permission to delete a task in this team.",
          });
        }
      }

      const task = await deleteTaskAction(input.id);

      if (!task.data[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      const kanbanColumn = await queries.kanbanColumns.getKanbanColumnById(
        task.data[0].kanbanColumnId
      );

      await publishKanbanEvent({
        type: "task_deleted",
        payload: {
          teamId: input.teamId,
          projectId: input.projectId,
          id: task.data[0].id,
          boardId: kanbanColumn[0].boardId as string,
        },
      });
      return task;
    }),
});
