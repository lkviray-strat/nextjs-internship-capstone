import { projectStatusEnum, taskPriorityEnum } from "../lib/db/enums";

export type TaskPriorityEnum = (typeof taskPriorityEnum.enumValues)[number];
export type ProjectStatusEnum = (typeof projectStatusEnum.enumValues)[number];
