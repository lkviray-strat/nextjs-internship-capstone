import type { KanbanEvent } from "@/src/types";
import { redisPub } from "./redis";

export async function publishKanbanEvent(event: KanbanEvent) {
  await redisPub.publish("kanban", JSON.stringify(event));
}
