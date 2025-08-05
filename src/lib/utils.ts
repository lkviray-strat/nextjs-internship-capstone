import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type WithRelations<T, R extends Record<string, unknown>> = T & R;

export function logWebhookEvent(
  status: "success" | "error",
  action: string,
  data?: unknown
) {
  const symbols = {
    success: "✅",
    error: "❌",
  };

  const message = `${symbols[status]} ${action}`;
  const logFn = status === "success" ? console.log : console.error;

  logFn(message, data ?? "", "\n");
}
