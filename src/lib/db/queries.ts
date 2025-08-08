import type {
  CommentsInsertRequest,
  CommentsUpdateRequest,
  KanbanBoardsInsertRequest,
  KanbanBoardsUpdateRequest,
  KanbanColumnsInsertRequest,
  KanbanColumnsUpdateRequest,
  ProjectsInsertRequest,
  ProjectStatusEnum,
  ProjectsUpdateRequest,
  ProjectTeamsInsertRequest,
  TaskPriorityEnum,
  TasksInsertRequest,
  TaskStatusEnum,
  TasksUpdateRequest,
  TeamMembersInsertRequest,
  TeamMembersUpdateRequest,
  TeamsInsertRequest,
  TeamsUpdateRequest,
  UserInsertRequest,
  UserUpdateRequest,
} from "@/src/types";
import { and, asc, eq } from "drizzle-orm";
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
      return db.insert(users).values(user).returning();
    },
    updateUser: (id: string, user: UserUpdateRequest) => {
      return db.update(users).set(user).where(eq(users.id, id)).returning();
    },
    deleteUser: (id: string) => {
      return db.delete(users).where(eq(users.id, id)).returning();
    },
    getUsersByIdWithTeams: (id: string) => {
      return db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, id),
        with: {
          ledTeams: {
            columns: {
              id: true,
            },
          },
        },
      });
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
      return db.insert(teams).values(team).returning();
    },
    updateTeam: (id: string, team: TeamsUpdateRequest) => {
      return db.update(teams).set(team).where(eq(teams.id, id)).returning();
    },
    deleteTeam: (id: string) => {
      return db.delete(teams).where(eq(teams.id, id)).returning();
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
      return db.insert(tasks).values(task).returning();
    },
    updateTask: (id: number, task: TasksUpdateRequest) => {
      return db.update(tasks).set(task).where(eq(tasks.id, id)).returning();
    },
    deleteTask: (id: number) => {
      return db.delete(tasks).where(eq(tasks.id, id)).returning();
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
      return db.insert(comments).values(comment).returning();
    },
    updateComment: (id: string, comment: CommentsUpdateRequest) => {
      return db
        .update(comments)
        .set(comment)
        .where(eq(comments.id, id))
        .returning();
    },
    deleteComment: (id: string) => {
      return db.delete(comments).where(eq(comments.id, id)).returning();
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
      return db.insert(projects).values(project).returning();
    },
    updateProject: (id: string, project: ProjectsUpdateRequest) => {
      return db
        .update(projects)
        .set(project)
        .where(eq(projects.id, id))
        .returning();
    },
    deleteProject: (id: string) => {
      return db.delete(projects).where(eq(projects.id, id)).returning();
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
      return db.insert(kanbanBoards).values(board).returning();
    },
    updateKanbanBoard: (id: string, board: KanbanBoardsUpdateRequest) => {
      return db
        .update(kanbanBoards)
        .set(board)
        .where(eq(kanbanBoards.id, id))
        .returning();
    },
    deleteKanbanBoard: (id: string) => {
      return db.delete(kanbanBoards).where(eq(kanbanBoards.id, id)).returning();
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
    createKanbanColumn: (column: KanbanColumnsInsertRequest) => {
      return db.insert(kanbanColumns).values(column).returning();
    },
    updateKanbanColumn: (id: string, column: KanbanColumnsUpdateRequest) => {
      return db
        .update(kanbanColumns)
        .set(column)
        .where(eq(kanbanColumns.id, id))
        .returning();
    },
    deleteKanbanColumn: (id: string) => {
      return db
        .delete(kanbanColumns)
        .where(eq(kanbanColumns.id, id))
        .returning();
    },
  },
  teamMembers: {
    getAllTeamMembers: () => {
      return db.select().from(teamMembers);
    },
    getTeamMembersByIds: (userId: string, teamId: string) => {
      return db
        .select()
        .from(teamMembers)
        .where(
          and(eq(teamMembers.userId, userId), eq(teamMembers.teamId, teamId))
        );
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
    getTeamMembersByTeamIdAndRoleAsc: (
      teamId: string,
      role: TeamMemberRoleEnum
    ) => {
      return db
        .select()
        .from(teamMembers)
        .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.role, role)))
        .orderBy(asc(teamMembers.createdAt));
    },
    createTeamMembers: (member: TeamMembersInsertRequest) => {
      return db.insert(teamMembers).values(member).returning();
    },
    updateTeamMembers: (
      userId: string,
      teamId: string,
      teamMember: TeamMembersUpdateRequest
    ) => {
      return db
        .update(teamMembers)
        .set(teamMember)
        .where(
          and(eq(teamMembers.userId, userId), eq(teamMembers.teamId, teamId))
        )
        .returning();
    },
    deleteTeamMembers: (userId: string, teamId: string) => {
      return db
        .delete(teamMembers)
        .where(
          and(eq(teamMembers.userId, userId), eq(teamMembers.teamId, teamId))
        )
        .returning();
    },
    getTeamMembersByIdsWithTeamWithLeaderId: (
      userId: string,
      teamId: string
    ) => {
      return db.query.teamMembers.findFirst({
        where: (teamMembers, { eq, and }) =>
          and(eq(teamMembers.userId, userId), eq(teamMembers.teamId, teamId)),
        with: {
          team: {
            columns: {
              leaderId: true,
            },
          },
        },
      });
    },
  },
  projectTeams: {
    getAllProjectTeams: () => {
      return db.select().from(projectTeams);
    },
    getProjectTeamsByIds: (projectId: string, teamId: string) => {
      return db
        .select()
        .from(projectTeams)
        .where(
          and(
            eq(projectTeams.projectId, projectId),
            eq(projectTeams.teamId, teamId)
          )
        );
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
    createProjectTeams: (projectTeam: ProjectTeamsInsertRequest) => {
      return db.insert(projectTeams).values(projectTeam).returning();
    },
    updateProjectTeams: (
      projectId: string,
      teamId: string,
      projectTeam: ProjectTeamsInsertRequest
    ) => {
      return db
        .update(projectTeams)
        .set(projectTeam)
        .where(
          and(
            eq(projectTeams.projectId, projectId),
            eq(projectTeams.teamId, teamId)
          )
        )
        .returning();
    },
    deleteProjectTeams: (projectId: string, teamId: string) => {
      return db
        .delete(projectTeams)
        .where(
          and(
            eq(projectTeams.projectId, projectId),
            eq(projectTeams.teamId, teamId)
          )
        )
        .returning();
    },
  },
};
