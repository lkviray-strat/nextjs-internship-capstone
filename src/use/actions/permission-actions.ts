"use server";

import { hasPermission } from "@/src/lib/permissions";
import type { PermissionInsertRequest } from "@/src/types";

export async function checkPermission(
  userId: string,
  teamId: string,
  permission: PermissionInsertRequest
) {
  return await hasPermission(userId, teamId, permission);
}
