import { db } from "@/src/lib/db";
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
  const clerkAuth = await auth();
  return { auth: clerkAuth, db };
});

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;

const enforceAuth = t.middleware(async ({ ctx, next }) => {
  const { auth } = ctx;
  if (!auth) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.auth,
      db: ctx.db,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuth);
