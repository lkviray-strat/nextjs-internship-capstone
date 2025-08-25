import type { PermissionInsertRequest, RoleInsertRequest } from "@/src/types";
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "..";
import * as schema from "../schema";
import { authorizations } from "./config";

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
    console.log("🌱 Seeding Authorization tables...");

    await tx.delete(schema.rolePermissions);

    await tx
      .insert(schema.roles)
      .values(roles)
      .onConflictDoUpdate({
        target: [schema.roles.name],
        set: {
          description: sql`excluded.description`,
          priority: sql`excluded.priority`,
          canLead: sql`excluded.can_lead`,
        },
      });
    await tx
      .insert(schema.permissions)
      .values(permissions)
      .onConflictDoUpdate({
        target: [schema.permissions.action, schema.permissions.resource],
        set: {
          action: sql`excluded.action`,
          resource: sql`excluded.resource`,
        },
      });

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
