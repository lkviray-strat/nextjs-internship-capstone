import type {
  CommentsInsertRequest,
  CommentsUpdateRequest,
  KanbanBoardsInsertRequest,
  KanbanBoardsUpdateRequest,
  KanbanColumnsInsertRequest,
  KanbanColumnsUpdateRequest,
  PermissionActionsEnum,
  PermissionResourcesEnum,
  ProjectsInsertRequest,
  ProjectStatusEnum,
  ProjectsUpdateRequest,
  ProjectTeamsInsertRequest,
  TaskPriorityEnum,
  TasksInsertRequest,
  TasksUpdateRequest,
  TeamMembersInsertRequest,
  TeamMembersUpdateRequest,
  TeamsInsertRequest,
  TeamsUpdateRequest,
  UserInsertRequest,
  UserUpdateRequest,
} from "@/src/types";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from ".";
import {
  comments,
  kanbanBoards,
  kanbanColumns,
  permissions,
  projects,
  projectTeams,
  rolePermissions,
  roles,
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
      return db
        .insert(users)
        .values(user)
        .onConflictDoUpdate({
          target: users.email,
          set: user,
        })
        .returning();
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
    getTeamsByIdWithProjects: (id: string) => {
      return db.query.teams.findFirst({
        where: (teams, { eq }) => eq(teams.id, id),
        with: {
          projects: {
            columns: {
              projectId: true,
            },
          },
        },
      });
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
    getRecentProjects: (limit: number) => {
      return db
        .select()
        .from(projects)
        .orderBy(desc(projects.createdAt))
        .limit(limit);
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
    getTeamMembersByRole: (roleId: string) => {
      return db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.roleId, roleId));
    },
    getTeamMembersByTeamIdAndRoleAsc: (teamId: string, roleId: string) => {
      return db
        .select()
        .from(teamMembers)
        .where(
          and(eq(teamMembers.teamId, teamId), eq(teamMembers.roleId, roleId))
        )
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
    getTeamMembersCountByTeamIdAndRoleId: (teamId: string, roleId: string) => {
      return db.$count(
        teamMembers,
        and(eq(teamMembers.teamId, teamId), eq(teamMembers.roleId, roleId))
      );
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
    getProjectTeamsByIsOwner: (isOwner: boolean) => {
      return db
        .select()
        .from(projectTeams)
        .where(eq(projectTeams.isOwner, isOwner));
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
    getProjectTeamsByIdsWithProjectWithCreatedByTeamId: (
      projectId: string,
      teamId: string
    ) => {
      return db.query.projectTeams.findFirst({
        where: (projectTeams, { eq, and }) =>
          and(
            eq(projectTeams.projectId, projectId),
            eq(projectTeams.teamId, teamId)
          ),
        with: {
          project: {
            columns: {
              createdByTeamId: true,
            },
          },
        },
      });
    },
    getProjectTeamsByProjectIdAsc: (projectId: string) => {
      return db
        .select()
        .from(projectTeams)
        .where(eq(projectTeams.projectId, projectId))
        .orderBy(asc(projectTeams.createdAt));
    },
  },
  roles: {
    getAllRoles: () => {
      return db.select().from(roles);
    },
    getAllRolesByPriorityAsc: () => {
      return db.select().from(roles).orderBy(asc(roles.priority));
    },
    getAllRolesByCanLead: (canLead: boolean) => {
      return db.select().from(roles).where(eq(roles.canLead, canLead));
    },
    getRoleById: (id: string) => {
      return db.select().from(roles).where(eq(roles.id, id));
    },
    getRoleByName: (name: string) => {
      return db.select().from(roles).where(eq(roles.name, name));
    },
    getRoleByPriority: (priority: number) => {
      return db.select().from(roles).where(eq(roles.priority, priority));
    },
  },
  permissions: {
    getAllPermissions: () => {
      return db.select().from(permissions);
    },
    getPermissionById: (id: string) => {
      return db.select().from(permissions).where(eq(permissions.id, id));
    },
    getPermissionsByAction: (action: PermissionActionsEnum) => {
      return db
        .select()
        .from(permissions)
        .where(eq(permissions.action, action));
    },
    getPermissionsByResource: (resource: PermissionResourcesEnum) => {
      return db
        .select()
        .from(permissions)
        .where(eq(permissions.resource, resource));
    },
    getPermissionsByActionAndResource: (
      action: PermissionActionsEnum,
      resource: PermissionResourcesEnum
    ) => {
      return db
        .select()
        .from(permissions)
        .where(
          and(
            eq(permissions.action, action),
            eq(permissions.resource, resource)
          )
        );
    },
  },
  rolePermissions: {
    getAllRolePermissions: () => {
      return db.select().from(rolePermissions);
    },
    getRolePermissionsByRoleId: (roleId: string) => {
      return db
        .select()
        .from(rolePermissions)
        .where(eq(rolePermissions.roleId, roleId));
    },
    getRolePermissionsByPermissionId: (permissionId: string) => {
      return db
        .select()
        .from(rolePermissions)
        .where(eq(rolePermissions.permissionId, permissionId));
    },
  },
};
