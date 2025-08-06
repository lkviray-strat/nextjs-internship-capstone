import type {
  CommentsInsertRequest,
  CommentsUpdateRequest,
  KanbanBoardsInsertRequest,
  KanbanBoardsUpdateRequest,
  ProjectsInsertRequest,
  ProjectStatusEnum,
  ProjectsUpdateRequest,
  TaskPriorityEnum,
  TasksInsertRequest,
  TaskStatusEnum,
  TasksUpdateRequest,
  TeamsInsertRequest,
  TeamsUpdateRequest,
  UserInsertRequest,
  UserUpdateRequest,
} from "@/src/types";
import { and, eq } from "drizzle-orm";
import { db } from ".";
import type { TeamMemberRoleEnum } from "../../types/enums";
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
    createUser: (user: UserInsertRequest) => {
      return db.insert(users).values(user);
    },
    updateUser: (id: string, user: UserUpdateRequest) => {
      return db.update(users).set(user).where(eq(users.id, id));
    },
    deleteUser: (id: string) => {
      return db.delete(users).where(eq(users.id, id));
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
    createTeam: (team: TeamsInsertRequest) => {
      return db.insert(teams).values(team);
    },
    updateTeam: (id: string, team: TeamsUpdateRequest) => {
      return db.update(teams).set(team).where(eq(teams.id, id));
    },
    deleteTeam: (id: string) => {
      return db.delete(teams).where(eq(teams.id, id));
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
    createTask: (task: TasksInsertRequest) => {
      return db.insert(tasks).values(task);
    },
    updateTask: (id: number, task: TasksUpdateRequest) => {
      return db.update(tasks).set(task).where(eq(tasks.id, id));
    },
    deleteTask: (id: number) => {
      return db.delete(tasks).where(eq(tasks.id, id));
    },
  },
  comments: {
    getAllComments: () => {
      return db.select().from(comments);
    },
    getCommentsById: (id: string) => {
      return db.select().from(comments).where(eq(comments.id, id));
    },
    getCommentsByTaskId: (taskId: number) => {
      return db.select().from(comments).where(eq(comments.taskId, taskId));
    },
    getCommentsByAuthorId: (authorId: string) => {
      return db.select().from(comments).where(eq(comments.authorId, authorId));
    },
    createComment: (comment: CommentsInsertRequest) => {
      return db.insert(comments).values(comment);
    },
    updateComment: (id: string, comment: CommentsUpdateRequest) => {
      return db.update(comments).set(comment).where(eq(comments.id, id));
    },
    deleteComment: (id: string) => {
      return db.delete(comments).where(eq(comments.id, id));
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
    createProject: (project: ProjectsInsertRequest) => {
      return db.insert(projects).values(project);
    },
    updateProject: (id: string, project: ProjectsUpdateRequest) => {
      return db.update(projects).set(project).where(eq(projects.id, id));
    },
    deleteProject: (id: string) => {
      return db.delete(projects).where(eq(projects.id, id));
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
    createKanbanBoard: (board: KanbanBoardsInsertRequest) => {
      return db.insert(kanbanBoards).values(board);
    },
    updateKanbanBoard: (id: string, board: KanbanBoardsUpdateRequest) => {
      return db.update(kanbanBoards).set(board).where(eq(kanbanBoards.id, id));
    },
    deleteKanbanBoard: (id: string) => {
      return db.delete(kanbanBoards).where(eq(kanbanBoards.id, id));
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
