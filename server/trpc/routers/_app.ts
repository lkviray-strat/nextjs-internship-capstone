import { createTRPCRouter } from "../init";
import { kanbanBoardRouter } from "./kanban-board-routers";
import { kanbanColumnRouter } from "./kanban-column-routers";
import { kanbanSubscriptionRouter } from "./kanban-subscription-routers.";
import { projectRouter } from "./project-routers";
import { projectTeamRouter } from "./project-team-routers";
import { roleRouter } from "./role-routers";
import { taskRouter } from "./task-routers";
import { teamMemberRouter } from "./team-member-routers";
import { teamRouter } from "./team-routers";
import { userRouter } from "./user-routers";

export const appRouter = createTRPCRouter({
  users: userRouter,
  teams: teamRouter,
  roles: roleRouter,
  projects: projectRouter,
  kanbanBoards: kanbanBoardRouter,
  kanbanColumns: kanbanColumnRouter,
  kanbanSubscriptions: kanbanSubscriptionRouter,
  tasks: taskRouter,
  teamMembers: teamMemberRouter,
  projectTeams: projectTeamRouter,
});
