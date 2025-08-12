"use server";

import { queries } from "@/src/lib/db/queries";
import { clerkUsersSchema } from "@/src/lib/validations";
import type {
  ClerkUsersInput,
  UpdateTeamMemberRequestInput,
  UpdateTeamRequestInput,
} from "@/src/types";
import type { UserJSON } from "@clerk/nextjs/server";
import z, { ZodError } from "zod";
import { deleteTeamAction, updateTeamAction } from "./team-actions";
import { updateTeamMembersAction } from "./team-member-actions";

export async function createUserAction(clerkUser: UserJSON) {
  try {
    const userRequest: ClerkUsersInput = {
      id: clerkUser.id,
      email: clerkUser.email_addresses[0]?.email_address,
      firstName: clerkUser.first_name || "",
      lastName: clerkUser.last_name || "",
      profileImageUrl: clerkUser.image_url,
    };

    const parsed = await clerkUsersSchema.parseAsync(userRequest);
    const result = await queries.users.createUser(parsed);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: z.flattenError(error).fieldErrors };
    }
    return { success: false, error };
  }
}

export async function updateUserAction(clerkUser: UserJSON) {
  try {
    const userRequest: ClerkUsersInput = {
      id: clerkUser.id,
      email: clerkUser.email_addresses[0]?.email_address,
      firstName: clerkUser.first_name || "",
      lastName: clerkUser.last_name || "",
      profileImageUrl: clerkUser.image_url,
    };

    const parsed = await clerkUsersSchema.parseAsync(userRequest);
    const result = await queries.users.updateUser(clerkUser.id, parsed);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: z.flattenError(error).fieldErrors };
    }
    console.error("Error updating user:", error);
    return { success: false, error };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const user = await queries.users.getUsersByIdWithTeams(userId);

    if (!user) {
      console.log("⚠️  User with the given ID does not exist");
      return { success: true };
    }

    for (const team of user.ledTeams) {
      await reassignOrDeleteTeam(team.id);
    }

    const data = await queries.users.deleteUser(userId);

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function reassignOrDeleteTeam(teamId: string) {
  const roles = await queries.roles.getAllRolesByCanLead(true);

  for (const role of roles) {
    const designation =
      await queries.teamMembers.getTeamMembersByTeamIdAndRoleAsc(
        teamId,
        role.id
      );

    if (designation.length === 0) {
      await deleteTeamAction(teamId);
      return { success: true, data: null, action: "deleted_team" };
    }

    const updatedTeam: UpdateTeamRequestInput = {
      id: teamId,
      leaderId: designation[0].userId as string,
    };
    await updateTeamAction(updatedTeam);

    const firstPriorityRole = await queries.roles.getRoleByPriority(0);

    const updatedTeamMember: UpdateTeamMemberRequestInput = {
      userId: designation[0].userId as string,
      teamId: teamId,
      roleId: firstPriorityRole[0].id,
    };
    await updateTeamMembersAction(updatedTeamMember);

    return { success: true, data: designation, action: `promoted_${role}` };
  }
}
