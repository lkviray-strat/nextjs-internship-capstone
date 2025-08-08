"use server";

import { queries } from "@/src/lib/db/queries";
import { createTeamMemberRequestSchema } from "@/src/lib/validations";
import type {
  CreateTeamMemberRequestInput,
  UpdateTeamMemberRequestInput,
} from "@/src/types";
import z from "zod";
import { deleteTeamAction } from "./team-actions";

export async function createTeamMembersAction(
  teamMember: CreateTeamMemberRequestInput
) {
  try {
    const parsed = createTeamMemberRequestSchema.parse(teamMember);
    const result = await queries.teamMembers.createTeamMembers(parsed);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function updateTeamMembersAction(
  teamMember: UpdateTeamMemberRequestInput
) {
  try {
    const existingTeamMember = (
      await queries.teamMembers.getTeamMembersByIds(
        teamMember.userId,
        teamMember.teamId
      )
    ).at(0);

    if (!existingTeamMember) {
      throw new Error("Team member with the given ID does not exist");
    }

    const { userId, teamId, ...parsedData } =
      createTeamMemberRequestSchema.parse(teamMember);
    const result = await queries.teamMembers.updateTeamMembers(
      userId,
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

export async function deleteTeamMembersAction(userId: string, teamId: string) {
  try {
    const existingTeamMember =
      await queries.teamMembers.getTeamMembersByIdsWithTeamWithLeaderId(
        userId,
        teamId
      );

    if (!existingTeamMember) {
      throw new Error("Team member with the given ID does not exist");
    }

    if (
      existingTeamMember.role === "owner" ||
      existingTeamMember.userId === existingTeamMember.team?.leaderId
    ) {
      throw new Error("Cannot leave as the team leader or owner of the team");
    }

    const existingMembers =
      await queries.teamMembers.getTeamMembersByTeamId(teamId);

    const result = await queries.teamMembers.deleteTeamMembers(userId, teamId);

    if (existingMembers.length === 1 && existingMembers[0].userId === userId) {
      await deleteTeamAction(teamId);
    }

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}
