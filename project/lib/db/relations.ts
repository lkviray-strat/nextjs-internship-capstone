import { relations } from "drizzle-orm";
import {
  comments,
  projects,
  projectTeams,
  tasks,
  teamMembers,
  teams,
  users,
} from "./schema";

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
