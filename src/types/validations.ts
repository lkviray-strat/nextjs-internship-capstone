import z from "zod";
import * as validations from "../lib/validations";

export type ClerkUsersInput = z.infer<typeof validations.clerkUsersSchema>;
export type CreateTeamRequestInput = z.infer<
  typeof validations.createTeamRequestSchema
>;
export type CreateTaskRequestInput = z.infer<
  typeof validations.createTaskRequestSchema
>;
export type CreateCommentRequestInput = z.infer<
  typeof validations.createCommentRequestSchema
>;
export type CreateProjectRequestInput = z.infer<
  typeof validations.createProjectRequestSchema
>;
export type CreateKanbanBoardsRequestInput = z.infer<
  typeof validations.createKanbanBoardsRequestSchema
>;
export type CreateKanbanColumnRequestInput = z.infer<
  typeof validations.createKanbanColumnRequestSchema
>;
export type CreateTeamMemberRequestInput = z.infer<
  typeof validations.createTeamMemberRequestSchema
>;
export type CreateProjectTeamRequestInput = z.infer<
  typeof validations.createProjectTeamRequestSchema
>;

export type UpdateTeamRequestInput = z.infer<
  typeof validations.updateTeamRequestSchema
>;
export type UpdateTaskRequestInput = z.infer<
  typeof validations.updateTaskRequestSchema
>;
export type UpdateCommentRequestInput = z.infer<
  typeof validations.updateCommentRequestSchema
>;
export type UpdateProjectRequestInput = z.infer<
  typeof validations.updateProjectRequestSchema
>;
export type UpdateKanbanBoardsRequestInput = z.infer<
  typeof validations.updateKanbanBoardsRequestSchema
>;
export type UpdateKanbanColumnRequestInput = z.infer<
  typeof validations.updateKanbanColumnRequestSchema
>;
export type UpdateTeamMemberRequestInput = z.infer<
  typeof validations.updateTeamMemberRequestSchema
>;
export type UpdateProjectTeamRequestInput = z.infer<
  typeof validations.updateProjectTeamRequestSchema
>;

export type UserResponse = z.infer<typeof validations.userResponseSchema>;
export type TeamResponse = z.infer<typeof validations.teamResponseSchema>;
export type TaskResponse = z.infer<typeof validations.taskResponseSchema>;
export type CommentsResponse = z.infer<
  typeof validations.commentsResponseSchema
>;
export type ProjectResponse = z.infer<typeof validations.projectResponseSchema>;
export type KanbanBoardsResponse = z.infer<
  typeof validations.kanbanBoardsResponseSchema
>;
export type KanbanColumnsResponse = z.infer<
  typeof validations.kanbanColumnsResponseSchema
>;
export type TeamMemberResponse = z.infer<
  typeof validations.teamMembersResponseSchema
>;
