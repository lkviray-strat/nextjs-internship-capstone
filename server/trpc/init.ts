import { db } from "@/src/lib/db";
import type { Context } from "@/src/types";
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(
  async (opts: CreateNextContextOptions) => {
    const headersList = new Headers(opts.req.headers as HeadersInit);
    const clientId = headersList.get("x-client-id");

    const clerkAuth = await auth();

    if (!clerkAuth || !clerkAuth.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not authenticated",
      });
    }

    return { db, auth: clerkAuth, clientId };
  }
);

export const createWSContext = async (opts: CreateWSSContextFnOptions) => {
  const clientId = opts.info.connectionParams?.clientId;

  return { db, auth: null, clientId };
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;

const enforceAuth = t.middleware(async ({ ctx, next }) => {
  const { auth } = ctx;
  if (!auth || !auth.userId) {
    console.log("Warning: User is not authenticated");
  }

  return next({
    ctx: {
      auth: {
        ...auth,
        userId: auth?.userId as string,
      },
      db: ctx.db,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuth);
