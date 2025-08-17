import type { PermissionInsertRequest } from "../types";
import { queries } from "./db/queries";

export async function userHasPermission(
  userId: string,
  teamId: string,
  { action, resource }: PermissionInsertRequest
) {
  const member = (
    await queries.teamMembers.getTeamMembersByIds(userId, teamId)
  ).at(0);

  if (!member?.roleId) return false;

  const perm =
    await queries.rolePermissions.getRolePermissionsByRoleIdWithPermissions(
      member.roleId
    );

  if (!perm || perm.length === 0 || perm.every((p) => !p.permission))
    return false;

  const hasPermission = perm.some(
    (p) => p.permission?.action === action && p.permission.resource === resource
  );

  return hasPermission;
}
