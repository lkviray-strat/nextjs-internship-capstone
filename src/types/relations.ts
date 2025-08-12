import type { WithRelations } from "@/src/lib/utils";
import type {
  Comments,
  KanbanBoards,
  KanbanColumns,
  Projects,
  ProjectTeams,
  Tasks,
  TeamMembers,
  Teams,
  User,
} from ".";

// With Relations Types
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
