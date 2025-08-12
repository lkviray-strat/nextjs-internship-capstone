import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  projectStatusEnum,
  roleActionsEnum,
  roleResourcesEnum,
  taskPriorityEnum,
} from "./enums";

export const users = pgTable(
  "users",
  {
    id: varchar("id").primaryKey(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    profileImageUrl: varchar("profile_image_url", { length: 512 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_name_idx").on(table.firstName, table.lastName),
  ]
);

// Teams
export const teams = pgTable(
  "teams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    leaderId: varchar("leader_id").references(() => users.id, {
      onDelete: "set null",
    }), // Team leader
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("teams_name_idx").on(table.name),
    index("teams_leader_idx").on(table.leaderId),
  ]
);

// Tasks
export const tasks = pgTable(
  "tasks",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 10000 }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    priority: taskPriorityEnum("priority").notNull().default("low"),
    dueDate: timestamp("due_date"),
    estimatedHours: integer("estimated_hours"),
    assigneeId: varchar("assignee_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdById: varchar("created_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    taskNumber: integer("task_number").notNull(),
    order: integer("order").notNull().default(0),
    kanbanColumnId: uuid("kanban_column_id").references(
      () => kanbanColumns.id,
      {
        onDelete: "set null",
      }
    ),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("tasks_unique_task_number_idx").on(
      table.taskNumber,
      table.projectId
    ),
    index("tasks_project_idx").on(table.projectId),
    index("tasks_title_idx").on(table.title),
    index("tasks_priority_idx").on(table.priority),
    index("tasks_assignee_idx").on(table.assigneeId),
    index("tasks_due_date_idx").on(table.dueDate),
    index("tasks_creator_idx").on(table.createdById),
    index("tasks_kanban_column_idx").on(table.kanbanColumnId),
    index("tasks_order_idx").on(table.order),
  ]
);

// Comments
export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text("content").notNull(),
    taskId: integer("task_id").references(() => tasks.id, {
      onDelete: "cascade",
    }),
    authorId: varchar("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("comments_task_idx").on(table.taskId),
    index("comments_author_idx").on(table.authorId),
  ]
);

// Projects
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    status: projectStatusEnum("status").notNull().default("planning"),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    defaultBoardId: uuid("default_board_id"),
    createdByTeamId: uuid("created_by_team_id").references(() => teams.id, {
      onDelete: "set null",
    }),
    createdById: varchar("created_by").references(() => users.id, {
      onDelete: "set null",
    }), // User who created
  },
  (table) => [
    index("projects_name_idx").on(table.name),
    index("projects_status_idx").on(table.status),
    index("projects_date_range_idx").on(table.startDate, table.endDate),
    index("projects_creator_idx").on(table.createdById),
    index("projects_default_board_idx").on(table.defaultBoardId),
  ]
);

// Kanban Boards
export const kanbanBoards = pgTable(
  "kanban_boards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("kanban_boards_project_idx").on(table.projectId)]
);

// Kanban Columns
export const kanbanColumns = pgTable(
  "kanban_columns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    boardId: uuid("board_id").references(() => kanbanBoards.id, {
      onDelete: "cascade",
    }),
    order: integer("order").notNull(),
    color: varchar("color", { length: 20 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("kanban_columns_board_idx").on(table.boardId),
    index("kanban_columns_order_idx").on(table.order),
  ]
);

// ==================================================================

// Team Members (junction table for users and teams)
export const teamMembers = pgTable(
  "team_members",
  {
    userId: varchar("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    teamId: uuid("team_id").references(() => teams.id, { onDelete: "cascade" }),
    roleId: uuid("role_id").references(() => roles.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.teamId] }),
    index("team_members_user_idx").on(table.userId),
    index("team_members_team_idx").on(table.teamId),
    index("team_members_role_idx").on(table.roleId),
  ]
);

// Project Teams (junction table for projects and teams)
export const projectTeams = pgTable(
  "project_teams",
  {
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    teamId: uuid("team_id").references(() => teams.id, { onDelete: "cascade" }),
    isOwner: boolean("is_owner").notNull().default(false), // Marks the creating team
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.teamId] }),
    index("project_teams_project_idx").on(table.projectId),
    index("project_teams_team_idx").on(table.teamId),
    index("project_teams_owner_idx").on(table.isOwner),
    uniqueIndex("project_teams_unique_owner_idx")
      .on(table.projectId)
      .where(sql`is_owner = true`),
  ]
);

// ==================================================================

// Roles table
export const roles = pgTable(
  "roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    description: text("description"),
    priority: integer("priority").notNull(),
    canLead: boolean("can_lead").notNull().default(false),
  },
  (table) => [
    index("roles_name_idx").on(table.name),
    index("roles_priority_idx").on(table.priority),
  ]
);

// Permissions table
export const permissions = pgTable(
  "permissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    action: roleActionsEnum("action").notNull(),
    resource: roleResourcesEnum("resource").notNull(),
  },
  (table) => [
    uniqueIndex("permissions_action_resource_idx").on(
      table.action,
      table.resource
    ),
    index("permissions_action_idx").on(table.action),
    index("permissions_resource_idx").on(table.resource),
  ]
);

// Role Permissions (junction table for roles and permissions)
export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id").references(() => roles.id, {
      onDelete: "cascade",
    }),
    permissionId: uuid("permission_id").references(() => permissions.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    primaryKey({ columns: [table.roleId, table.permissionId] }),
    index("role_permissions_role_idx").on(table.roleId),
    index("role_permissions_permission_idx").on(table.permissionId),
  ]
);
