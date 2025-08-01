import {
  projectStatusEnum,
  taskPriorityEnum,
  taskStatusEnum,
  teamMemberRoleEnum,
} from "../lib/db/enums";

export type TaskStatusEnum = (typeof taskStatusEnum.enumValues)[number];
export type TaskPriorityEnum = (typeof taskPriorityEnum.enumValues)[number];
export type ProjectStatusEnum = (typeof projectStatusEnum.enumValues)[number];
export type TeamMemberRoleEnum = (typeof teamMemberRoleEnum.enumValues)[number];
