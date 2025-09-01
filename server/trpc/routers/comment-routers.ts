import { queries } from "@/src/lib/db/queries";
import { hasPermission } from "@/src/lib/permissions";
import {
  createCommentRequestSchema,
  updateCommentRequestSchema,
} from "@/src/lib/validations";
import {
  createCommentAction,
  deleteCommentAction,
  updateCommentAction,
} from "@/src/use/actions/comment-actions";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const commentRouter = createTRPCRouter({
  getCommentsByTaskIdWithAuthor: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const comments =
        await queries.comments.getCommentsByTaskIdWithAuthor(input);
      return comments;
    }),
  createComment: protectedProcedure
    .input(
      createCommentRequestSchema.extend({
        projectId: z.guid(),
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
          message: "You are not a member of this team to create a comment",
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

      const tasks = await queries.tasks.getTasksById(input.taskId);

      if (tasks.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found.",
        });
      }

      const perm = await hasPermission(ctx.auth.userId, input.teamId, {
        action: "create",
        resource: "comment",
      });

      if (!perm) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to create the task in this team.",
        });
      }

      return await createCommentAction(input);
    }),
  updateComment: protectedProcedure
    .input(
      updateCommentRequestSchema.extend({
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

      const tasks = await queries.tasks.getTasksById(input.taskId);

      if (tasks.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found.",
        });
      }

      const perm = await hasPermission(ctx.auth.userId, input.teamId, {
        action: "update",
        resource: "comment",
      });

      const existingComment = await queries.comments.getCommentsById(input.id);
      const ownsComment = existingComment[0]?.authorId === ctx.auth.userId;
      if (!perm) {
        if (!ownsComment) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You do not have permission to update the comment in this team.",
          });
        }
      }

      return await updateCommentAction(input);
    }),
  deleteComment: protectedProcedure
    .input(z.object({ id: z.guid(), teamId: z.guid(), projectId: z.guid() }))
    .mutation(async ({ ctx, input }) => {
      const teamMember = await queries.teamMembers.getTeamMembersByIds(
        ctx.auth.userId,
        input.teamId
      );

      if (teamMember.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this team to delete a comment",
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
        resource: "comment",
      });

      const existingComment = await queries.comments.getCommentsById(input.id);
      const ownsComment = existingComment[0]?.authorId === ctx.auth.userId;
      if (!perm) {
        if (!ownsComment) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You do not have permission to delete the comment in this team.",
          });
        }
      }

      return await deleteCommentAction(input.id);
    }),
});
