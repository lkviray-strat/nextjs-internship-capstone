"use server";

import { queries } from "@/src/lib/db/queries";
import {
  createTeamRequestSchema,
  updateTeamRequestSchema,
} from "@/src/lib/validations";
import type {
  CreateTeamMemberRequestInput,
  CreateTeamRequestInput,
  UpdateProjectRequestInput,
  UpdateProjectTeamRequestInput,
  UpdateTeamRequestInput,
} from "@/src/types";
import z from "zod";
import { updateProjectAction } from "./project-actions";
import { updateProjectTeamAction } from "./project-team-actions";
import { createTeamMembersAction } from "./team-member-actions";

export async function createTeamAction(team: CreateTeamRequestInput) {
  try {
    const parsed = createTeamRequestSchema.parse(team);
    const result = await queries.teams.createTeam(parsed);
    const role = await queries.roles.getRoleByPriority(0);

    const ownerTeamMember: CreateTeamMemberRequestInput = {
      userId: result[0].leaderId as string,
      teamId: result[0].id,
      roleId: role[0].id,
    };

    await createTeamMembersAction(ownerTeamMember);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function updateTeamAction(team: UpdateTeamRequestInput) {
  try {
    const existingTeam = (await queries.teams.getTeamsById(team.id)).at(0);
    if (!existingTeam) {
      throw new Error("Team with the given ID does not exist");
    }

    const { id, ...parsedData } = updateTeamRequestSchema.parse(team);
    const result = await queries.teams.updateTeam(id, parsedData);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function deleteTeamAction(teamId: string) {
  try {
    const existingTeam = await queries.teams.getTeamsByIdWithProjects(teamId);
    if (!existingTeam) {
      throw new Error("Team with the given ID does not exist");
    }

    for (const project of existingTeam.projects) {
      await reassignOrArchiveProject(project.projectId as string);
    }

    const result = await queries.teams.deleteTeam(teamId);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function reassignOrArchiveProject(projectId: string) {
  const designation =
    await queries.projectTeams.getProjectTeamsByProjectIdAsc(projectId);

  if (designation.length === 1) {
    const updateProject: UpdateProjectRequestInput = {
      id: projectId,
      status: "archived",
    };
    await updateProjectAction(updateProject);
    return { success: true, data: null, action: "archived_project" };
  }

  const updatedProjectTeam: UpdateProjectTeamRequestInput = {
    projectId: projectId,
    teamId: designation[0].teamId as string,
    isOwner: true,
  };
  await updateProjectTeamAction(updatedProjectTeam);

  return { success: true, data: designation, action: "reassigned_project" };
}
