import { pgEnum } from "drizzle-orm/pg-core";

// Enum arrays
export const DEFAULT_KANBAN_BOARD_COLUMNS = [
  "backlog",
  "todo",
  "in_progress",
  "in_review",
  "done",
] as const;

export const KANBAN_COLUMN_TW_COLORS: Record<
  (typeof DEFAULT_KANBAN_BOARD_COLUMNS)[number],
  string
> = {
  backlog: "bg-gray-400",
  todo: "bg-blue-500",
  in_progress: "bg-orange-400",
  in_review: "bg-yellow-500",
  done: "bg-green-500",
};

export const TASK_PRIORITY_ENUM = ["low", "medium", "high", "urgent"] as const;

export const PROJECT_STATUS_ENUM = [
  "planning",
  "active",
  "archived",
  "completed",
  "on_hold",
] as const;

export const PROJECT_STATUS_CREATE_ENUM = ["planning", "active"] as const;

export const PERMISSION_ACTIONS = [
  "view",
  "create",
  "update",
  "delete",
] as const;

export const PERMISSION_RESOURCES = [
  "team",
  "project",
  "task",
  "kanban_column",
  "kanban_board",
  "team_member",
  "project_team",
  "comment",
] as const;

// pgEnums for drizzle schema
export const taskPriorityEnum = pgEnum("task_priority", TASK_PRIORITY_ENUM);
export const projectStatusEnum = pgEnum("project_status", PROJECT_STATUS_ENUM);
export const permissionActionsEnum = pgEnum(
  "permission_actions",
  PERMISSION_ACTIONS
);
export const permissionResourcesEnum = pgEnum(
  "permission_resources",
  PERMISSION_RESOURCES
);
