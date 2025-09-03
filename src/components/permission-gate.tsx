"use client";

import { useEffect, useState } from "react";
import type {
  PermissionActionsEnum,
  PermissionInsertRequest,
  PermissionResourcesEnum,
} from "../types";
import { checkPermission } from "../use/actions/permission-actions";

type PermissionGateProps = {
  userId: string;
  teamId: string;
  permissions: string[];
  ownerIds?: string[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
  children: React.ReactNode;
};

export function PermissionGate({
  userId,
  teamId,
  permissions,
  ownerIds,
  fallback = null,
  requireAll = true,
  children,
}: PermissionGateProps) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    if (ownerIds?.includes(userId)) {
      setAllowed(true);
      return;
    }

    const permissionObjects: PermissionInsertRequest[] = permissions.map(
      (perm) => {
        const [action, resource] = perm.split(":");
        return {
          action: action as PermissionActionsEnum,
          resource: resource as PermissionResourcesEnum,
        };
      }
    );

    Promise.all(
      permissionObjects.map((perm) => checkPermission(userId, teamId, perm))
    ).then((results) => {
      if (!mounted) return;

      const hasPermission = requireAll
        ? results.every(Boolean)
        : results.some(Boolean);

      setAllowed(hasPermission);
    });

    return () => {
      mounted = false;
    };
  }, [userId, teamId, permissions, requireAll, ownerIds]);

  if (allowed === null) return null;

  return <>{allowed ? children : fallback}</>;
}
