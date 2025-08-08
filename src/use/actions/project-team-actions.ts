"use server";

import { queries } from "@/src/lib/db/queries";
import {
  createProjectTeamRequestSchema,
  updateProjectTeamRequestSchema,
} from "@/src/lib/validations";
import type {
  CreateProjectTeamRequestInput,
  UpdateProjectTeamRequestInput,
} from "@/src/types";
import z from "zod";

export async function createProjectTeamAction(
  projectTeam: CreateProjectTeamRequestInput
) {
  try {
    const parsed = createProjectTeamRequestSchema.parse(projectTeam);
    const result = await queries.projectTeams.createProjectTeams(parsed);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function updateProjectTeamAction(
  projectTeam: UpdateProjectTeamRequestInput
) {
  try {
    const existingProjectTeam = (
      await queries.projectTeams.getProjectTeamsByIds(
        projectTeam.projectId,
        projectTeam.teamId
      )
    ).at(0);

    if (!existingProjectTeam) {
      throw new Error("Project team with the given ID does not exist");
    }

    const { projectId, teamId, ...parsedData } =
      updateProjectTeamRequestSchema.parse(projectTeam);
    const result = queries.projectTeams.updateProjectTeams(
      projectId,
      teamId,
      parsedData
    );

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function deleteProjectTeamAction(
  projectId: string,
  teamId: string
) {
  try {
    const existingProjectTeam =
      await queries.projectTeams.getProjectTeamsByIdsWithProjectWithCreatedById(
        projectId,
        teamId
      );

    if (!existingProjectTeam) {
      throw new Error("Project team with the given ID does not exist");
    }

    const existingTeam = (await queries.teams.getTeamsById(teamId)).at(0);

    if (!existingTeam) {
      throw new Error("Team with the given ID does not exist");
    }

    if (existingProjectTeam.isOwner) {
      throw new Error("Transfer ownership before leaving the project team");
    }

    const result = await queries.projectTeams.deleteProjectTeams(
      projectId,
      teamId
    );

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}
