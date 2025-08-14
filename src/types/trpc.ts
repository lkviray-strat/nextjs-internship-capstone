import type { createTRPCContext } from "@/trpc/init";
import type { appRouter } from "@/trpc/routers/_app";

export type AppRouter = typeof appRouter;
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
