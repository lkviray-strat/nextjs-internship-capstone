import {
  permissionActionsEnum,
  permissionResourcesEnum,
  projectStatusEnum,
  taskPriorityEnum,
} from "../lib/db/enums";

export type TaskPriorityEnum = (typeof taskPriorityEnum.enumValues)[number];
export type ProjectStatusEnum = (typeof projectStatusEnum.enumValues)[number];
export type PermissionActionsEnum =
  (typeof permissionActionsEnum.enumValues)[number];
export type PermissionResourcesEnum =
  (typeof permissionResourcesEnum.enumValues)[number];
