// TODO: Task 3.1 - Design database schema for users, projects, lists, and tasks
// TODO: Task 3.3 - Set up Drizzle ORM with type-safe schema definitions

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core/table";

// Users
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
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
    leaderId: uuid("leader_id").references(() => users.id, {
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
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    status: varchar("status", { length: 50 }).notNull().default("todo"),
    priority: varchar("priority", { length: 20 }).notNull().default("medium"),
    dueDate: timestamp("due_date"),
    estimatedHours: integer("estimated_hours"),
    assigneeId: uuid("assignee_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdById: uuid("created_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("tasks_project_idx").on(table.projectId),
    index("tasks_status_idx").on(table.status),
    index("tasks_priority_idx").on(table.priority),
    index("tasks_assignee_idx").on(table.assigneeId),
    index("tasks_due_date_idx").on(table.dueDate),
    index("tasks_creator_idx").on(table.createdById),
    index("tasks_status_priority_idx").on(table.status, table.priority),
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
    authorId: uuid("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("comments_task_idx").on(table.taskId),
    index("comments_author_idx").on(table.authorId),
    index("comments_created_idx").on(table.createdAt),
  ]
);

// Projects
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    status: varchar("status", { length: 50 }).notNull().default("active"), // 'active', 'archived', 'completed'
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdById: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }), // User who created
  },
  (table) => [
    index("projects_status_idx").on(table.status),
    index("projects_date_range_idx").on(table.startDate, table.endDate),
    index("projects_creator_idx").on(table.createdById),
  ]
);

// Team Members (junction table for users and teams)
export const teamMembers = pgTable(
  "team_members",
  {
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    teamId: uuid("team_id").references(() => teams.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50 }).notNull().default("member"), // 'member', 'admin', 'owner'
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.teamId] }),
    index("team_members_user_idx").on(table.userId),
    index("team_members_team_idx").on(table.teamId),
    index("team_members_role_idx").on(table.role),
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
    role: varchar("role", { length: 50 }).notNull().default("contributor"), // 'owner', 'contributor', 'viewer'
    isCreator: boolean("is_creator").notNull().default(false), // Marks the creating team
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.teamId] }),
    index("project_teams_project_idx").on(table.projectId),
    index("project_teams_team_idx").on(table.teamId),
    index("project_teams_role_idx").on(table.role),
    index("project_teams_creator_idx").on(table.isCreator),
  ]
);

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  ledTeams: many(teams, { relationName: "team_leader" }),
  assignedTasks: many(tasks, { relationName: "task_assignee" }),
  createdTasks: many(tasks, { relationName: "task_creator" }),
  createdProjects: many(projects, { relationName: "project_creator" }),
  comments: many(comments, { relationName: "comment_author" }),
}));

export const teamsRelations = relations(teams, ({ many, one }) => ({
  members: many(teamMembers),
  projects: many(projectTeams),
  leader: one(users, {
    fields: [teams.leaderId],
    references: [users.id],
    relationName: "team_leader",
  }),
}));

export const tasksRelations = relations(tasks, ({ many, one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
    relationName: "task_assignee",
  }),
  createdBy: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
    relationName: "task_creator",
  }),
  comments: many(comments),
}));

export const projectsRelations = relations(projects, ({ many, one }) => ({
  teams: many(projectTeams),
  tasks: many(tasks),
  createdBy: one(users, {
    fields: [projects.createdById],
    references: [users.id],
    relationName: "project_creator",
  }),
}));

export const projectTeamsRelations = relations(projectTeams, ({ one }) => ({
  project: one(projects, {
    fields: [projectTeams.projectId],
    references: [projects.id],
  }),
  team: one(teams, {
    fields: [projectTeams.teamId],
    references: [teams.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
    relationName: "comment_author",
  }),
}));

// Placeholder exports to prevent import errors
