import type { KanbanEvent } from "@/src/types";
import EventEmitter, { on } from "events";

type EventMap<T> = Record<keyof T, unknown[]>;

class IterableEventEmitter<T extends EventMap<T>> extends EventEmitter {
  toIterable<TEventName extends keyof T & string>(
    eventName: TEventName,
    opts?: NonNullable<Parameters<typeof on>[2]>
  ): AsyncIterable<T[TEventName]> {
    return on(this, eventName as string, opts) as AsyncIterable<T[TEventName]>;
  }
}

interface MyEvents {
  kanban: [KanbanEvent];
}

export const kanbanEvents = new IterableEventEmitter<MyEvents>();
