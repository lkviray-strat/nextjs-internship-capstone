import { subscribeKanbanEvents } from "@/server/redis/kanban-sub";
import { tracked } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const kanbanSubscriptionRouter = createTRPCRouter({
  subscribeKanban: protectedProcedure
    .input(
      z.object({
        projectId: z.guid(),
        teamId: z.guid(),
      })
    )
    .subscription(async function* ({ input, signal, ctx }) {
      const events = subscribeKanbanEvents({ signal });

      for await (const event of events) {
        if (event.payload.teamId !== input.teamId) continue;
        if (event.payload.projectId !== input.projectId) continue;
        yield tracked(ctx.clientId, event);
      }
    }),
});
