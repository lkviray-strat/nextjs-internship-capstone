import type { ProjectStatusEnum } from ".";

export type orderType = "asc" | "desc";

export type ProjectFilters = {
  teamId: string;
  search: string;
  page: number;
  status?: ProjectStatusEnum[];
  start?: Date;
  end?: Date;
  order?: orderType;
};

export type KanbanBoardFilters = {
  projectId: string;
  board: string;
};

export type TeamMemberFilters = {
  teamId: string;
  search: string;
  page: number;
  name?: orderType;
  dateAdded?: orderType;
  lastActive?: orderType;
  role?: orderType;
};
