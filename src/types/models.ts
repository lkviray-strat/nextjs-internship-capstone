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

export type UserInsertRequest = InferInsertModel<typeof users>;
export type TeamsInsertRequest = InferInsertModel<typeof teams>;
export type TasksInsertRequest = InferInsertModel<typeof tasks>;
export type CommentsInsertRequest = InferInsertModel<typeof comments>;
export type ProjectsInsertRequest = InferInsertModel<typeof projects>;
export type KanbanBoardsInsertRequest = InferInsertModel<typeof kanbanBoards>;
export type KanbanColumnsInsertRequest = InferInsertModel<typeof kanbanColumns>;
export type TeamMembersInsertRequest = InferInsertModel<typeof teamMembers>;
export type ProjectTeamsInsertRequest = InferInsertModel<typeof projectTeams>;

export type UserUpdateRequest = Partial<InferInsertModel<typeof users>>;
export type TeamsUpdateRequest = Partial<InferInsertModel<typeof teams>>;
export type TasksUpdateRequest = Partial<InferInsertModel<typeof tasks>>;
export type CommentsUpdateRequest = Partial<InferInsertModel<typeof comments>>;
export type ProjectsUpdateRequest = Partial<InferInsertModel<typeof projects>>;
export type KanbanBoardsUpdateRequest = Partial<
  InferInsertModel<typeof kanbanBoards>
>;
export type KanbanColumnsUpdateRequest = Partial<
  InferInsertModel<typeof kanbanColumns>
>;
export type TeamMembersUpdateRequest = Partial<
  InferInsertModel<typeof teamMembers>
>;
export type ProjectTeamsUpdateRequest = Partial<
  InferInsertModel<typeof projectTeams>
>;
