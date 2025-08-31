"use client";

import type { AppRouter } from "@/src/types";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createTRPCClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import { useSSROnlySecret } from "ssr-only-secrets";
import superjson from "superjson";
import { getClientId } from "../websocket/ws-client-id";
import { makeQueryClient } from "./query-client";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

function getWsUrl() {
  if (typeof window !== "undefined") {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${window.location.hostname}:3001`;
  }

  if (process.env.VERCEL_URL) {
    return `wss://${process.env.VERCEL_URL}/api/ws`;
  }

  return "ws://localhost:3001"; // dev fallback
}

let browserQueryClient: QueryClient;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  return (browserQueryClient ??= makeQueryClient());
}

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
  })();
  return `${base}/api/trpc`;
}

const clientId = getClientId();

const wsClient = createWSClient({
  url: getWsUrl(),
  connectionParams: {
    clientId,
  },
});

export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
    ssrOnlySecret: string;
  }>
) {
  const value = useSSROnlySecret(
    props.ssrOnlySecret,
    "SECRET_CLIENT_COOKIE_VAR"
  );

  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        // loggerLink({
        //   enabled: (opts) =>
        //     opts.direction === "down" || process.env.NODE_ENV === "development",
        // }),
        splitLink({
          condition: (op) => op.type === "subscription",
          true: wsLink<AppRouter>({
            client: wsClient,
            transformer: superjson,
          }),
          false: httpBatchLink({
            transformer: superjson,
            url: getUrl(),
            headers() {
              const headers = new Headers();
              headers.set("x-trpc-source", "nextjs-react");
              headers.set("x-client-id", clientId);
              if (value) {
                headers.set("cookie", value);
              }
              return headers;
            },
          }),
        }),
      ],
    })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider
        trpcClient={trpcClient}
        queryClient={queryClient}
      >
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
