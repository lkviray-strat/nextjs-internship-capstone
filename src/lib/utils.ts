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

export function enumToWord(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function sentenceCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function snakeToTitleCase(str: string): string {
  if (!str) return "";

  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
