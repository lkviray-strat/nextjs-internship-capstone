import type { createTRPCContext } from "@/server/trpc/init";
import type { appRouter } from "@/server/trpc/routers/_app";

export type AppRouter = typeof appRouter;
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
