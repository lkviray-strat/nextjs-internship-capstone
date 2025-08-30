import type { KANBAN_EVENT_TYPES } from "../lib/db/enums";
import type { WithRelations } from "../lib/utils";
import type {
  KanbanColumnsInsertRequest,
  KanbanColumnsUpdateRequest,
  TasksInsertRequest,
  TasksUpdateRequest,
  User,
} from "./models";

export type KanbanEventType = (typeof KANBAN_EVENT_TYPES)[number];

export type KanbanEvent =
  | {
      type: "task_created";
      payload: {
        task: WithRelations<
          TasksInsertRequest & { id: number },
          { assignee: User | null }
        >;
        boardId: string;
        projectId: string;
        teamId: string;
      };
    }
  | {
      type: "task_updated";
      payload: {
        task: WithRelations<
          TasksUpdateRequest & { id: number },
          { assignee: User | null }
        >;
        boardId: string;
        projectId: string;
        teamId: string;
      };
    }
  | {
      type: "task_deleted";
      payload: {
        id: number;
        boardId: string;
        projectId: string;
        teamId: string;
        kanbanColumnId: string;
      };
    }
  | {
      type: "kanban_column_created";
      payload: {
        kanbanColumn: KanbanColumnsInsertRequest;
        projectId: string;
        teamId: string;
      };
    }
  | {
      type: "kanban_column_updated";
      payload: {
        kanbanColumn: KanbanColumnsUpdateRequest;
        projectId: string;
        teamId: string;
      };
    }
  | {
      type: "kanban_column_deleted";
      payload: {
        id: string;
        projectId: string;
        teamId: string;
        boardId: string;
      };
    };
