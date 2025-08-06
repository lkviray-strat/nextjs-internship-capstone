"use server";

import { queries } from "@/src/lib/db/queries";
import {
  createTeamRequestSchema,
  updateTeamRequestSchema,
} from "@/src/lib/validations";
import type {
  CreateTeamRequestInput,
  UpdateTeamRequestInput,
} from "@/src/types";
import z from "zod";

export async function createTeamAction(team: CreateTeamRequestInput) {
  try {
    const parsed = createTeamRequestSchema.parse(team);
    const result = await queries.teams.createTeam(parsed);

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
    const result = await queries.teams.updateTeam(id as string, parsedData);

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
    const existingTeam = (await queries.teams.getTeamsById(teamId)).at(0);
    if (!existingTeam) {
      throw new Error("Team with the given ID does not exist");
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
