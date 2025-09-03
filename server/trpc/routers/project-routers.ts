import { queries } from "@/src/lib/db/queries";
import { hasPermission } from "@/src/lib/permissions";
import {
  createProjectRequestSchema,
  projectFiltersSchema,
  updateProjectRequestSchema,
} from "@/src/lib/validations";
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "@/src/use/actions/project-actions";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const projectRouter = createTRPCRouter({
  getActiveProjects: protectedProcedure
    .input(
      z.object({
        teamId: z.guid(),
      })
    )
    .query(async ({ input }) => {
      return await queries.projects.getProjectsByTeamIdNotArchived(
        input.teamId
      );
    }),
  getMyCurrentProject: protectedProcedure
    .input(
      z.object({
        projectId: z.guid(),
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

      const project = await queries.projects.getProjectsById(input.projectId);

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found.",
        });
      }

      return project;
    }),
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
  getProjectsByFilters: protectedProcedure
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

      return await queries.projects.getProjectsByFilters(input);
    }),
  createProject: protectedProcedure
    .input(createProjectRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const teamMember = await queries.teamMembers.getTeamMembersByIds(
        ctx.auth.userId,
        input.createdByTeamId
      );

      if (teamMember.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this team to create a project.",
        });
      }

      const perm = await hasPermission(ctx.auth.userId, input.createdByTeamId, {
        action: "create",
        resource: "project",
      });

      if (!perm) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to create a project in this team.",
        });
      }

      return await createProjectAction(input);
    }),
  updateProject: protectedProcedure
    .input(updateProjectRequestSchema.extend({ teamId: z.guid() }))
    .mutation(async ({ ctx, input }) => {
      const teamMember = await queries.teamMembers.getTeamMembersByIds(
        ctx.auth.userId,
        input.teamId
      );

      if (teamMember.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of any of the teams in the project.",
        });
      }

      const perm = await hasPermission(ctx.auth.userId, input.teamId, {
        action: "update",
        resource: "project",
      });

      if (!perm) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to update a project in this team.",
        });
      }

      revalidatePath(`${input.teamId}/projects/${input.id}`);
      revalidatePath(`${input.teamId}/projects`);
      return await updateProjectAction(input);
    }),
  deleteProject: protectedProcedure
    .input(z.object({ id: z.guid(), teamId: z.guid() }))
    .mutation(async ({ ctx, input }) => {
      const teamMember = await queries.teamMembers.getTeamMembersByIds(
        ctx.auth.userId,
        input.teamId
      );

      if (teamMember.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this team.",
        });
      }

      const team = await queries.teams.getTeamsById(input.teamId);
      const perm = await hasPermission(ctx.auth.userId, team[0].id, {
        action: "delete",
        resource: "project",
      });

      if (team[0].leaderId !== ctx.auth.userId && !perm) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to delete a project for this team.",
        });
      }

      revalidatePath(`${input.teamId}/projects/${input.id}`);
      revalidatePath(`${input.teamId}/projects`);
      return await deleteProjectAction(input.id);
    }),
});
