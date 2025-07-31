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
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

// Model Types
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
