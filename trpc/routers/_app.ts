import { createTRPCRouter } from "../init";
import { projectRouter } from "./project-routers";
import { roleRouter } from "./role-routers";
import { teamMemberRouter } from "./team-member-routers";
import { teamRouter } from "./team-routers";
import { userRouter } from "./user-routers";

export const appRouter = createTRPCRouter({
  users: userRouter,
  teams: teamRouter,
  teamMembers: teamMemberRouter,
  roles: roleRouter,
  projects: projectRouter,
});
