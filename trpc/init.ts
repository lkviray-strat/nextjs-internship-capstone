import "server-only";

import { db } from "@/src/lib/db";
import type { Context } from "@/src/types";
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
  const clerkAuth = await auth();
  return { auth: clerkAuth, db };
});

const t = initTRPC.context<Context>().create({});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;

const enforceAuth = t.middleware(async ({ ctx, next }) => {
  const { auth } = ctx;
  if (!auth || !auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  return next({
    ctx: {
      auth: {
        ...auth,
        userId: auth.userId as string,
      },
      db: ctx.db,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuth);
