import {
  comments,
  projects,
  projectTeams,
  tasks,
  teamMembers,
  teams,
  users,
} from "@/lib/db/schema";
import { WithRelations } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;
export type Teams = InferSelectModel<typeof teams>;
export type Tasks = InferSelectModel<typeof tasks>;
export type Comments = InferSelectModel<typeof comments>;
export type Projects = InferSelectModel<typeof projects>;
export type TeamMembers = InferSelectModel<typeof teamMembers>;
export type ProjectTeams = InferSelectModel<typeof projectTeams>;

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
