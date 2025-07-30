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
} from "@/src/lib/db/schema";
import { WithRelations } from "@/src/lib/utils";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;
export type Teams = InferSelectModel<typeof teams>;
export type Tasks = InferSelectModel<typeof tasks>;
export type Comments = InferSelectModel<typeof comments>;
export type Projects = InferSelectModel<typeof projects>;
export type KanbanBoards = InferSelectModel<typeof kanbanBoards>;
export type KanbanColumns = InferSelectModel<typeof kanbanColumns>;
export type TeamMembers = InferSelectModel<typeof teamMembers>;
export type ProjectTeams = InferSelectModel<typeof projectTeams>;

export type UserRequest = InferInsertModel<typeof users>;
export type TeamsRequest = InferInsertModel<typeof teams>;
export type TasksRequest = InferInsertModel<typeof tasks>;
export type CommentsRequest = InferInsertModel<typeof comments>;
export type ProjectsRequest = InferInsertModel<typeof projects>;
export type KanbanBoardsRequest = InferInsertModel<typeof kanbanBoards>;
export type KanbanColumnsRequest = InferInsertModel<typeof kanbanColumns>;
export type TeamMembersRequest = InferInsertModel<typeof teamMembers>;
export type ProjectTeamsRequest = InferInsertModel<typeof projectTeams>;

export type UserWithRelations = WithRelations<
  User,
  {
    teamMembers: TeamMembers[];
    ledTeams: Teams[];
    assignedTasks: Tasks[];
    createdTasks: Tasks[];
    createdProjects: Projects[];
    comments: Comments[];
  }
>;

export type TeamsWithRelations = WithRelations<
  Teams,
  {
    members: TeamMembers[];
    projects: ProjectTeams[];
    leader: User;
  }
>;

export type TasksWithRelations = WithRelations<
  Tasks,
  {
    project: Projects;
    assignee: User;
    createdBy: User;
    comments: Comments[];
  }
>;

export type ProjectsWithRelations = WithRelations<
  Projects,
  {
    teams: ProjectTeams[];
    tasks: Tasks[];
    createdBy: User;
  }
>;

export type KanbanBoardWithRelations = WithRelations<
  KanbanBoards,
  {
    project: Projects;
    columns: KanbanColumns[];
  }
>;

export type KanbanColumnsWithRelations = WithRelations<
  KanbanColumns,
  {
    board: KanbanBoards;
    tasks: Tasks[];
  }
>;

export type ProjectTeamsWithRelations = WithRelations<
  ProjectTeams,
  {
    project: Projects;
    team: Teams;
  }
>;

export type CommentsWithRelations = WithRelations<
  Comments,
  {
    task: Tasks;
    author: User;
  }
>;
