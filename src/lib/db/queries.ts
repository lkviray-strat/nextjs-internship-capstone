import type {
  CommentsInsertRequest,
  CommentsUpdateRequest,
  KanbanBoardFilters,
  KanbanBoardsInsertRequest,
  KanbanBoardsUpdateRequest,
  KanbanColumnsInsertRequest,
  KanbanColumnsUpdateRequest,
  PermissionActionsEnum,
  PermissionResourcesEnum,
  ProjectFilters,
  ProjectsInsertRequest,
  ProjectStatusEnum,
  ProjectsUpdateRequest,
  ProjectTeamsInsertRequest,
  TaskPriorityEnum,
  TasksInsertRequest,
  TasksUpdateRequest,
  TeamMemberFilters,
  TeamMembersInsertRequest,
  TeamMembersUpdateRequest,
  TeamsInsertRequest,
  TeamsUpdateRequest,
  UserInsertRequest,
  UserUpdateRequest,
} from "@/src/types";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  notInArray,
  or,
  SQL,
} from "drizzle-orm";
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
    getUsersBySearch: (query: string, limit = 10) => {
      return db
        .select()
        .from(users)
        .where(
          or(
            ilike(users.firstName, `%${query}%`),
            ilike(users.lastName, `%${query}%`),
            ilike(users.email, `%${query}%`)
          )
        )
        .limit(limit);
    },
    getUserBySearchWithinTeamMembers: async (
      query: string,
      teamId: string,
      limit = 10
    ) => {
      const teamMembers =
        await queries.teamMembers.getTeamMembersByTeamId(teamId);
      const userIds = teamMembers
        .map((teamMember) => teamMember.userId)
        .filter((id): id is string => id != null);

      return db
        .select()
        .from(users)
        .where(
          and(
            inArray(users.id, userIds),
            or(
              ilike(users.firstName, `%${query}%`),
              ilike(users.lastName, `%${query}%`),
              ilike(users.email, `%${query}%`)
            )
          )
        )
        .limit(limit);
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
      return db
        .select()
        .from(teams)
        .where(eq(teams.leaderId, leaderId))
        .orderBy(asc(teams.createdAt));
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
    getTasksByKanbanColumnId: (kanbanColumnId: string) => {
      return db
        .select()
        .from(tasks)
        .where(eq(tasks.kanbanColumnId, kanbanColumnId));
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
    getTasksByKanbanColumnIdAsc: (kanbanColumnId: string) => {
      return db
        .select()
        .from(tasks)
        .where(eq(tasks.kanbanColumnId, kanbanColumnId))
        .orderBy(asc(tasks.order));
    },
    getTasksByProjectIdDescLimit: (projectId: string, limit = 1) => {
      return db
        .select()
        .from(tasks)
        .where(eq(tasks.projectId, projectId))
        .orderBy(desc(tasks.createdAt))
        .limit(limit);
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
    getCommentsByTaskIdWithAuthor: (taskId: number) => {
      return db.query.comments.findMany({
        where: eq(comments.taskId, taskId),
        with: {
          author: true,
        },
        orderBy: asc(comments.createdAt),
      });
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
    getProjectByCreatedByTeamId: (createdByTeamId: string) => {
      return db
        .select()
        .from(projects)
        .where(eq(projects.createdByTeamId, createdByTeamId));
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
    getProjectsByTeamIdLimitAsc: (limit: number, teamId: string) => {
      return db
        .select()
        .from(projects)
        .orderBy(desc(projects.createdAt))
        .where(eq(projects.createdByTeamId, teamId))
        .limit(limit);
    },
    getProjectsByIdWithTeamIds: (id: string) => {
      return db.query.projects.findMany({
        where: eq(projects.id, id),
        with: {
          teams: {
            columns: {
              teamId: true,
            },
          },
        },
      });
    },
    getProjectsByFilters: async (projectFilters: ProjectFilters) => {
      const { teamId, search, page, status, start, end, order } =
        projectFilters;
      const PROJECTS_PER_PAGE = 6;
      const filters = [];

      if (status && status.length > 0) {
        filters.push(inArray(projects.status, status));
      } else {
        filters.push(notInArray(projects.status, ["archived"]));
      }
      if (start) filters.push(gte(projects.startDate, start));
      if (end) filters.push(lte(projects.startDate, end));
      if (search) filters.push(ilike(projects.name, `%${search}%`));
      const orderBy =
        order === "asc" ? asc(projects.createdAt) : desc(projects.createdAt);

      const condition =
        filters.length > 0
          ? and(...filters, eq(projects.createdByTeamId, teamId))
          : eq(projects.createdByTeamId, teamId);

      const offset = (page - 1) * PROJECTS_PER_PAGE;

      const results = await db.query.projects.findMany({
        where: condition,
        limit: PROJECTS_PER_PAGE,
        offset,
        orderBy,
        with: {
          tasks: true,
          kanbanBoards: {
            with: {
              columns: {
                orderBy: desc(kanbanColumns.order),
                limit: 1,
                with: {
                  tasks: true,
                },
              },
            },
            columns: {
              id: true,
            },
          },
          teams: {
            with: {
              team: {
                with: {
                  members: {
                    with: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const withProgress = results.map((project) => {
        const total = project.tasks.length;
        const done = project.kanbanBoards[0]?.columns[0]?.tasks.length ?? 0;
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;
        return { ...project, progress };
      });

      const pagesCount = await db.$count(projects, condition);

      return {
        results: withProgress,
        pagination: {
          pagesCount,
          perPage: PROJECTS_PER_PAGE,
        },
      };
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
    getKanbanBoardByFilters: (filters: KanbanBoardFilters) => {
      return db.query.kanbanBoards.findFirst({
        where: and(
          eq(kanbanBoards.projectId, filters.projectId),
          eq(kanbanBoards.id, filters.board)
        ),
        with: {
          columns: {
            with: {
              tasks: {
                with: {
                  assignee: true,
                },
              },
            },
          },
        },
      });
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
    getKanbanColumnsByBoardIdDescLimit: (boardId: string, limit: number) => {
      return db
        .select()
        .from(kanbanColumns)
        .where(eq(kanbanColumns.boardId, boardId))
        .orderBy(desc(kanbanColumns.order))
        .limit(limit);
    },
    getKanbanColumnsByBoardIdAsc: (boardId: string) => {
      return db
        .select()
        .from(kanbanColumns)
        .where(eq(kanbanColumns.boardId, boardId))
        .orderBy(asc(kanbanColumns.order));
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
    getTeamMembersByIdsArray: (userId: string, teamIds: string[]) => {
      return db
        .select()
        .from(teamMembers)
        .where(
          and(
            eq(teamMembers.userId, userId),
            inArray(teamMembers.teamId, teamIds)
          )
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
    getTeamMembersByFilter: async (teamMemberFilters: TeamMemberFilters) => {
      const { teamId, search, page, name, dateAdded, lastActive, role } =
        teamMemberFilters;
      const MEMBERS_PER_PAGE = 8;

      const whereConditions: (SQL | undefined)[] = [
        eq(teamMembers.teamId, teamId),
      ];

      if (search) {
        whereConditions.push(
          or(
            ilike(users.firstName, `%${search}%`),
            ilike(users.lastName, `%${search}%`),
            ilike(users.email, `%${search}%`)
          )
        );
      }

      const defaultOrderBy = asc(roles.priority);

      let orderByClause: SQL | undefined;
      if (role) {
        orderByClause =
          role === "asc" ? asc(roles.priority) : desc(roles.priority);
      } else if (lastActive) {
        orderByClause =
          lastActive === "asc" ? asc(users.lastSeen) : desc(users.lastSeen);
      } else if (name) {
        orderByClause =
          name === "asc" ? asc(users.firstName) : desc(users.firstName);
      } else if (dateAdded) {
        orderByClause =
          dateAdded === "asc"
            ? asc(teamMembers.createdAt)
            : desc(teamMembers.createdAt);
      }

      const members = await db
        .select({
          member: teamMembers,
          user: users,
          role: roles,
        })
        .from(teamMembers)
        .innerJoin(users, eq(users.id, teamMembers.userId))
        .leftJoin(roles, eq(roles.id, teamMembers.roleId))
        .where(and(...(whereConditions.filter(Boolean) as SQL[])))
        .limit(MEMBERS_PER_PAGE)
        .offset((page - 1) * MEMBERS_PER_PAGE)
        .orderBy(orderByClause ?? defaultOrderBy);

      const pagesCount = await db.$count(
        teamMembers,
        and(...(whereConditions.filter(Boolean) as SQL[]))
      );

      return {
        members,
        pagination: {
          pagesCount,
          perPage: MEMBERS_PER_PAGE,
        },
      };
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
    getProjectTeamsByProjectIdWithTeamMembers: (projectId: string) => {
      return db.query.projectTeams.findMany({
        where: eq(projectTeams.projectId, projectId),
        with: {
          team: {
            with: {
              members: {
                with: {
                  user: true,
                },
              },
            },
          },
        },
      });
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
    getRoleByDescLimitOffset: (limit = 1, offset = 0) => {
      return db
        .select()
        .from(roles)
        .orderBy(desc(roles.priority))
        .limit(limit)
        .offset(offset);
    },
    getRoleByAscLimitOffset: (limit = 1, offset = 0) => {
      return db
        .select()
        .from(roles)
        .orderBy(asc(roles.priority))
        .limit(limit)
        .offset(offset);
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
    getRolePermissionsByRoleIdWithPermissions: (roleId: string) => {
      return db.query.rolePermissions.findMany({
        where: eq(rolePermissions.roleId, roleId),
        with: {
          permission: {
            columns: {
              action: true,
              resource: true,
            },
          },
        },
      });
    },
  },
};
