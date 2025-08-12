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

    const highestRolePriority = await queries.roles.getRoleByPriority(0);
    const highestRoleCount =
      await queries.teamMembers.getTeamMembersCountByTeamIdAndRoleId(
        existingTeamMember.teamId as string,
        highestRolePriority[0].id
      );
    if (
      teamMember.roleId === highestRolePriority[0].id &&
      highestRoleCount > 1
    ) {
      throw new Error("Each team can only have two highest ranking role");
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

    const rolePriority = await queries.roles.getRoleById(
      existingTeamMember.roleId ?? ""
    );
    if (
      rolePriority[0].priority < 1 ||
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
