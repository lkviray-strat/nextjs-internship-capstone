import type { ProjectStatusEnum } from ".";

export type ProjectFilters = {
  teamId: string;
  search: string;
  page: number;
  status?: ProjectStatusEnum[];
  start?: Date;
  end?: Date;
  order?: "asc" | "desc";
};
