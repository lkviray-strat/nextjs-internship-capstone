import type { PermissionInsertRequest, RoleInsertRequest } from "@/src/types";
import "dotenv/config";
import { db } from ".";
import * as schema from "./schema";

export const authorizations = {
  owner: {
    priority: 0,
    canLead: true,
    permissions: [
      "create:project",
      "view:project",
      "update:project",
      "delete:project",
      "create:team",
      "view:team",
      "update:team",
      "delete:team",
    ],
  },
  admin: {
    priority: 1,
    canLead: true,
    permissions: ["view:project", "update:project", "view:team", "update:team"],
  },
  member: {
    priority: 2,
    canLead: true,
    permissions: ["view:project", "view:team"],
  },
  viewer: {
    priority: 3,
    canLead: false,
    permissions: [],
  },
} as const;

export const roles: RoleInsertRequest[] = Object.entries(authorizations).map(
  ([name, { priority, canLead }]) => ({
    name,
    priority,
    canLead,
  })
);

export const permissions: PermissionInsertRequest[] = Array.from(
  new Set(
    Object.values(authorizations)
      .flatMap((role) => role.permissions)
      .map((perm) => {
        const [action, resource] = perm.split(":");
        return JSON.stringify({ action, resource });
      })
  )
).map((str) => JSON.parse(str));

async function main() {
  await db.transaction(async (tx) => {
    console.log("🧹 Resetting Roles & Permissions Database...");
    await tx.delete(schema.roles);
    await tx.delete(schema.permissions);
    await tx.delete(schema.rolePermissions);
    console.log("✅ Roles & Permissions reset successfully");

    await tx.insert(schema.roles).values(roles);
    await tx.insert(schema.permissions).values(permissions);

    const existingRoles = await tx.select().from(schema.roles);
    const existingPermissions = await tx.select().from(schema.permissions);

    // Prepare rolePermissions mapping
    let rolePermissionsToInsert = Object.entries(authorizations).flatMap(
      ([roleName, { permissions }]) => {
        const roleId = existingRoles.find((r) => r.name === roleName)?.id;
        if (!roleId) return [];

        return permissions
          .map((perm) => {
            const [action, resource] = perm.split(":");
            const permId = existingPermissions.find(
              (p) => p.action === action && p.resource === resource
            )?.id;
            if (!permId) return null;
            return { roleId, permissionId: permId };
          })
          .filter((rp): rp is { roleId: string; permissionId: string } =>
            Boolean(rp)
          );
      }
    );

    // Deduplicate rolePermissions just in case
    rolePermissionsToInsert = Array.from(
      new Map(
        rolePermissionsToInsert
          .map((rp) => `${rp.roleId}-${rp.permissionId}`)
          .map((key, index) => [key, rolePermissionsToInsert[index]])
      ).values()
    );

    if (rolePermissionsToInsert.length) {
      await tx.insert(schema.rolePermissions).values(rolePermissionsToInsert);
    }
  });
  console.log("🎉 Roles & Permissions seeding completed successfully");
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  console.info("ℹ️ Process terminated due to error.");
  process.exit(1);
});
