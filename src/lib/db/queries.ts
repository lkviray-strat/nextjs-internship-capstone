import {
  ProjectStatusEnum,
  TaskPriorityEnum,
  TaskStatusEnum,
} from "@/src/types/enums";
import { and, eq } from "drizzle-orm";
import { db } from ".";
import { TeamMemberRoleEnum } from "../../types/enums";
import {
  comments,
  kanbanBoards,
  kanbanColumns,
  projects,
  projectTeams,
  tasks,
  teamMembers,
  teams,
  users,
} from "./schema";

export const queries = {
  users: {
    getAllUsers: () => {
      return db.select().from(users);
    },
    getUsersById: (id: string) => {
      return db.select().from(users).where(eq(users.id, id));
    },
    getUsersByEmail: (email: string) => {
      return db.select().from(users).where(eq(users.email, email));
    },
    getUsersByName: (firstName: string, lastName: string) => {
      return db
        .select()
        .from(users)
        .where(
          and(eq(users.firstName, firstName), eq(users.lastName, lastName))
        );
    },
  },
  teams: {
    getAllTeams: () => {
      return db.select().from(teams);
    },
    getTeamsById: (id: string) => {
      return db.select().from(teams).where(eq(teams.id, id));
    },
    getTeamsByName: (name: string) => {
      return db.select().from(teams).where(eq(teams.name, name));
    },
    getTeamsByLeaderId: (leaderId: string) => {
      return db.select().from(teams).where(eq(teams.leaderId, leaderId));
    },
  },
  tasks: {
    getAlltasks: () => {
      return db.select().from(tasks);
    },
    getTasksById: (id: number) => {
      return db.select().from(tasks).where(eq(tasks.id, id));
    },
    getTasksByTitle: (title: string) => {
      return db.select().from(tasks).where(eq(tasks.title, title));
    },
    getTasksByStatus: (status: TaskStatusEnum) => {
      return db.select().from(tasks).where(eq(tasks.status, status));
    },
    getTasksByPriority: (priority: TaskPriorityEnum) => {
      return db.select().from(tasks).where(eq(tasks.priority, priority));
    },
    getTasksByCreatedById: (createdById: string) => {
      return db.select().from(tasks).where(eq(tasks.createdById, createdById));
    },
    getTasksByOrder: (order: number) => {
      return db.select().from(tasks).where(eq(tasks.order, order));
    },
  },
  comments: {
    getAllComments: () => {
      return db.select().from(comments);
    },
    getCommentsByTaskId: (taskId: number) => {
      return db.select().from(comments).where(eq(comments.taskId, taskId));
    },
    getCommentsByAuthorId: (authorId: string) => {
      return db.select().from(comments).where(eq(comments.authorId, authorId));
    },
  },
  projects: {
    getAllProjects: () => {
      return db.select().from(projects);
    },
    getProjectsById: (id: string) => {
      return db.select().from(projects).where(eq(projects.id, id));
    },
    getProjectsByName: (name: string) => {
      return db.select().from(projects).where(eq(projects.name, name));
    },
    getProjectsByStatus: (status: ProjectStatusEnum) => {
      return db.select().from(projects).where(eq(projects.status, status));
    },
    getProjectByCreatedById: (createdById: string) => {
      return db
        .select()
        .from(projects)
        .where(eq(projects.createdById, createdById));
    },
  },
  kanbanBoards: {
    getAllKanbanBoards: () => {
      return db.select().from(kanbanBoards);
    },
    getKanbanBoardById: (id: string) => {
      return db.select().from(kanbanBoards).where(eq(kanbanBoards.id, id));
    },
    getKanbanBoardByName: (name: string) => {
      return db.select().from(kanbanBoards).where(eq(kanbanBoards.name, name));
    },
    getKanbanBoardByProjectId: (projectId: string) => {
      return db
        .select()
        .from(kanbanBoards)
        .where(eq(kanbanBoards.projectId, projectId));
    },
  },
  kanbanColumns: {
    getAllKanbanColumns: () => {
      return db.select().from(kanbanColumns);
    },
    getKanbanColumnById: (id: string) => {
      return db.select().from(kanbanColumns).where(eq(kanbanColumns.id, id));
    },
    getKanbanColumnByName: (name: string) => {
      return db
        .select()
        .from(kanbanColumns)
        .where(eq(kanbanColumns.name, name));
    },
    getKanbanColumnsByBoardId: (boardId: string) => {
      return db
        .select()
        .from(kanbanColumns)
        .where(eq(kanbanColumns.boardId, boardId));
    },
    getKanbanColumnsByOrder: (order: number) => {
      return db
        .select()
        .from(kanbanColumns)
        .where(eq(kanbanColumns.order, order));
    },
  },
  teamMembers: {
    getAllTeamMembers: () => {
      return db.select().from(teamMembers);
    },
    getTeamMembersByTeamId: (teamId: string) => {
      return db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.teamId, teamId));
    },
    getTeamMembersByUserId: (userId: string) => {
      return db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.userId, userId));
    },
    getTeamMembersByRole: (role: TeamMemberRoleEnum) => {
      return db.select().from(teamMembers).where(eq(teamMembers.role, role));
    },
  },
  projectTeams: {
    getAllProjectTeams: () => {
      return db.select().from(projectTeams);
    },
    getProjectTeamsByProjectId: (projectId: string) => {
      return db
        .select()
        .from(projectTeams)
        .where(eq(projectTeams.projectId, projectId));
    },
    getProjectTeamsByTeamId: (teamId: string) => {
      return db
        .select()
        .from(projectTeams)
        .where(eq(projectTeams.teamId, teamId));
    },
    getProjectTeamsByIsCreator: (isCreator: boolean) => {
      return db
        .select()
        .from(projectTeams)
        .where(eq(projectTeams.isCreator, isCreator));
    },
  },
};
