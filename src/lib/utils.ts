import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";
import type { ProjectFilters, ProjectStatusEnum } from "../types";

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

export function capitalizeWords(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getTimeLeft(endDate: string | Date) {
  const raw = formatDistanceToNow(new Date(endDate));
  return capitalizeWords(raw) + " Left";
}

export function getTimeLastUpdated(endDate: string | Date) {
  const raw = formatDistanceToNow(new Date(endDate));
  return "Last updated " + raw + " ago";
}

export function searchParamsToProjectFilters(
  searchParams: URLSearchParams
): Omit<ProjectFilters, "teamId"> {
  const search = searchParams.get("search") || "";
  const page = searchParams.get("page");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const order = searchParams.get("order");
  const status = searchParams.get("status");

  return {
    search,
    page: Number(page) || 1,
    start: start ? new Date(Number(start) * 1000) : undefined,
    end: end ? new Date(Number(end) * 1000) : undefined,
    order: order ? (order as "asc" | "desc") : undefined,
    status: status ? (status as ProjectStatusEnum) : undefined,
  };
}

export function projectFiltersToSearchParams(
  projectFilters: Omit<ProjectFilters, "teamId">
): URLSearchParams {
  const params = new URLSearchParams();

  if (projectFilters.search) params.set("search", projectFilters.search);
  if (projectFilters.page > 1) params.set("page", String(projectFilters.page));
  if (projectFilters.order) params.set("order", projectFilters.order);
  if (projectFilters.status) params.set("status", projectFilters.status);
  if (projectFilters.start)
    params.set(
      "start",
      String(Math.floor(projectFilters.start.getTime() / 1000))
    );
  if (projectFilters.end)
    params.set("end", String(Math.floor(projectFilters.end.getTime() / 1000)));

  return params;
}
