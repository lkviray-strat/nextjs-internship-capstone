import { publishKanbanEvent } from "@/server/redis/kanban-pub";
import { queries } from "@/src/lib/db/queries";
import { hasPermission } from "@/src/lib/permissions";
import {
  createTaskRequestSchema,
  updateTaskRequestSchema,
} from "@/src/lib/validations";
import type { User } from "@/src/types";
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
          message:
            "You do not have permission to create the task in this team.",
        });
      }

      const task = await createTaskAction(input);

      const kanbanColumn = await queries.kanbanColumns.getKanbanColumnById(
        task.data[0].kanbanColumnId
      );

      let user = null;
      if (task.data[0].assigneeId) {
        user = (await queries.users.getUsersById(task.data[0].assigneeId)).at(
          0
        );
      }

      await publishKanbanEvent({
        type: "task_created",
        clientId: ctx.clientId,
        payload: {
          teamId: input.teamId,
          projectId: input.projectId,
          boardId: kanbanColumn[0].boardId as string,
          task: { ...task.data[0], assignee: user as User | null },
        },
      });

      return task;
    }),
  updateTask: protectedProcedure
    .input(
      updateTaskRequestSchema.extend({
        teamId: z.guid(),
        projectId: z.guid(),
        boardId: z.guid(),
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

      const existingTask = await queries.tasks.getTasksById(input.id);
      const ownsTask =
        existingTask[0]?.createdById === ctx.auth.userId ||
        existingTask[0]?.assigneeId === ctx.auth.userId;
      if (!perm) {
        if (!ownsTask) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You do not have permission to update the task in this team.",
          });
        }
      }

      const task = await updateTaskAction(input);

      let user = null;
      if (task.data[0].assigneeId) {
        user = (await queries.users.getUsersById(task.data[0].assigneeId)).at(
          0
        );
      }

      await publishKanbanEvent({
        type: "task_updated",
        clientId: ctx.clientId,
        payload: {
          teamId: input.teamId,
          projectId: input.projectId,
          boardId: input.boardId,
          task: { ...task.data[0], assignee: user as User | null },
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

      const existingTask = await queries.tasks.getTasksById(input.id);
      const ownsTask =
        existingTask[0]?.createdById === ctx.auth.userId ||
        existingTask[0]?.assigneeId === ctx.auth.userId;
      if (!perm) {
        if (!ownsTask) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You do not have permission to delete the task in this team.",
          });
        }
      }

      const task = await deleteTaskAction(input.id);

      const kanbanColumn = await queries.kanbanColumns.getKanbanColumnById(
        task.data[0].kanbanColumnId
      );

      await publishKanbanEvent({
        type: "task_deleted",
        clientId: ctx.clientId,
        payload: {
          teamId: input.teamId,
          projectId: input.projectId,
          id: task.data[0].id,
          boardId: kanbanColumn[0].boardId as string,
          kanbanColumnId: kanbanColumn[0].id as string,
        },
      });
      return task;
    }),
});
