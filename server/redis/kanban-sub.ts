import type { KanbanEvent } from "@/src/types";
import { redisSub } from "./redis";

export function subscribeKanbanEvents(opts?: { signal?: AbortSignal }) {
  const iterator = (async function* () {
    const queue: KanbanEvent[] = [];

    const handler = (_channel: string, message: string) => {
      try {
        const event: KanbanEvent = JSON.parse(message);
        queue.push(event);
      } catch (err) {
        console.error("[Redis] Failed to parse message", err, message);
      }
    };

    await redisSub.subscribe("kanban");
    redisSub.on("message", handler);

    try {
      while (!opts?.signal?.aborted) {
        if (queue.length > 0) {
          yield queue.shift()!;
        } else {
          await new Promise((res) => setTimeout(res, 100));
        }
      }
    } finally {
      redisSub.off("message", handler);
    }
  })();

  return iterator as AsyncIterable<KanbanEvent>;
}
