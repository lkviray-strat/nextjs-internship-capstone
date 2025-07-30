import { pgEnum } from "drizzle-orm/pg-core";

export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "in_review",
  "done",
  "backlog",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "planning",
  "active",
  "archived",
  "completed",
  "on_hold",
]);

export const teamMemberRoleEnum = pgEnum("team_member_role", [
  "viewer",
  "member",
  "admin",
  "owner",
]);
