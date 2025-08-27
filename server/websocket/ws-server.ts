// ws-server.ts
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";
import { createWSContext } from "../trpc/init";
import { appRouter } from "../trpc/routers/_app";

declare global {
  var wss: WebSocketServer | undefined;
  var wssHandler: ReturnType<typeof applyWSSHandler> | undefined;
}

// Only create one WS server instance (HMR-safe)
if (!global.wss) {
  const wss = new WebSocketServer({ port: 3001 });

  // Terminate any leftover connections (zombies)
  wss.clients.forEach((ws) => ws.terminate());

  const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext: createWSContext,
    keepAlive: { enabled: true, pingMs: 30000, pongWaitMs: 5000 },
  });

  wss.on("connection", (ws) => {
    console.log(`➕➕ Connection (${wss.clients.size})`);

    ws.once("close", () => {
      console.log(`➖➖ Connection (${wss.clients.size})`);
    });
  });

  // Graceful shutdown
  const cleanUp = () => {
    console.log("🛑 Cleaning up WebSocket server...");
    handler.broadcastReconnectNotification();

    // Terminate all clients
    wss.clients.forEach((ws) => ws.terminate());

    wss.close(() => {
      console.log("✅ WebSocket server closed");
    });
  };

  process.on("SIGTERM", cleanUp);
  process.on("SIGINT", cleanUp); // Ctrl+C

  global.wss = wss;
  global.wssHandler = handler;

  console.log("✅ WebSocket Server listening on ws://localhost:3001");
} else {
  console.log("🟡 Using existing WebSocketServer instance (HMR-safe)");

  // Optional: cleanup any zombie connections on reload
  global.wss.clients.forEach((ws) => ws.terminate());
}
