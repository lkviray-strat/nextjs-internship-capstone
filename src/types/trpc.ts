import type { appRouter } from "@/server/trpc/routers/_app";
import type { auth } from "@clerk/nextjs/server";
import type { inferRouterOutputs } from "@trpc/server";
import type { db } from "../lib/db";

export type AppRouter = typeof appRouter;
export type Context = {
  db: typeof db;
  auth: Awaited<ReturnType<typeof auth>> | null;
  clientId: string;
};
export type RouterOutput = inferRouterOutputs<AppRouter>;
