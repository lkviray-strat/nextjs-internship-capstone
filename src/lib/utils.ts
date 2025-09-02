import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import {
  $getRoot,
  $isDecoratorNode,
  $isElementNode,
  $isTextNode,
  ElementNode,
  type EditorState,
  type SerializedEditorState,
  type SerializedElementNode,
  type SerializedTextNode,
} from "lexical";
import { twMerge } from "tailwind-merge";
import type {
  ProjectFilters,
  ProjectStatusEnum,
  ProjectTeamsWithTeamMembersResult,
} from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type WithRelations<T, R extends Record<string, unknown>> = T & R;
export type MakeSomeRequired<T, K extends keyof T> = {
  [P in K]-?: T[P];
} & {
  [P in Exclude<keyof T, K>]?: T[P];
};

export const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

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

export function getTimeLeft(endDate: string | Date, isAgo = false) {
  const raw = formatDistanceToNow(new Date(endDate));
  const now = new Date();

  if (endDate > now) return capitalizeWords(raw) + " Left";
  return capitalizeWords(raw) + (isAgo ? " Ago" : " Behind");
}

export function getTimeAgo(date: string | Date) {
  const raw = formatDistanceToNow(new Date(date));
  return raw + " ago";
}

export function getTimeLastUpdated(endDate: string | Date) {
  const raw = formatDistanceToNow(new Date(endDate));
  return "Last updated " + raw + " ago";
}

export function getTimeCreated(createdAt: string | Date) {
  const raw = formatDistanceToNow(new Date(createdAt));
  return "Created " + raw + " ago";
}

export function searchParamsToProjectFilters(
  searchParams: URLSearchParams
): Omit<ProjectFilters, "teamId"> {
  const search = searchParams.get("search") || "";
  const page = searchParams.get("page");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const order = searchParams.get("order");

  const status = searchParams.getAll("status") as ProjectStatusEnum[];

  return {
    search,
    page: Number(page) || 1,
    start: start ? new Date(Number(start) * 1000) : undefined,
    end: end ? new Date(Number(end) * 1000) : undefined,
    order: order ? (order as "asc" | "desc") : undefined,
    status: status.length > 0 ? status : undefined,
  };
}

export function projectFiltersToSearchParams(
  projectFilters: Omit<ProjectFilters, "teamId">
): URLSearchParams {
  const params = new URLSearchParams();

  if (projectFilters.search) params.set("search", projectFilters.search);
  if (projectFilters.page > 1) params.set("page", String(projectFilters.page));
  if (projectFilters.order) params.set("order", projectFilters.order);

  if (projectFilters.status && projectFilters.status.length > 0) {
    for (const s of projectFilters.status) {
      params.append("status", s);
    }
  }

  if (projectFilters.start)
    params.set(
      "start",
      String(Math.floor(projectFilters.start.getTime() / 1000))
    );
  if (projectFilters.end)
    params.set("end", String(Math.floor(projectFilters.end.getTime() / 1000)));

  return params;
}

export function getUserInitials(firstName?: string, lastName?: string): string {
  const firstInitial = firstName?.charAt(0).toUpperCase() || "";
  const lastInitial = lastName?.charAt(0).toUpperCase() || "";
  return `${firstInitial}${lastInitial}`;
}

export function extractNonNullableFrom<T>(
  array: (T | null | undefined)[]
): T[] {
  return array.filter((item): item is T => item !== null && item !== undefined);
}

export function hasTrueValue(obj: Record<string, unknown>): boolean {
  return Object.values(obj).some(
    (value) => typeof value === "boolean" && value === true
  );
}

export function extractEveryMember(
  projectTeams: ProjectTeamsWithTeamMembersResult
) {
  return (
    projectTeams
      .flatMap((projectTeam) => projectTeam.team)
      .flatMap((team) => team?.members)
      .flatMap((member) => member?.user) ?? []
  );
}

export function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Generate subtle colors (lower saturation, controlled lightness)
export function getColorFromHash(hash: number): string {
  const hue = hash % 360;
  // More subtle: lower saturation (20-40%), controlled lightness (30-50%)
  const saturation = 30 + (hash % 15); // 30-45%
  const lightness = 35 + (hash % 16); // 35-51%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function getContent(content: string): string {
  const cleanContent = content.includes("@") ? content.split("@")[0] : content;

  const parts = cleanContent.split(/[\s._-]+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function $isWhitespace(node: ElementNode): boolean {
  for (const child of node.getChildren()) {
    if (
      ($isElementNode(child) && !$isWhitespace(child)) ||
      ($isTextNode(child) && child.getTextContent().trim() !== "") ||
      $isDecoratorNode(child) // decorator nodes are arbitrary
    ) {
      return false;
    }
  }
  return true;
}

export function $isEmpty(editorState: EditorState | null) {
  if (editorState === null) return true;
  return editorState.read(() => {
    const root = $getRoot();
    const child = root.getFirstChild();

    if (
      child == null ||
      ($isElementNode(child) && child.isEmpty() && root.getChildrenSize() === 1)
    ) {
      return true;
    }

    return $isWhitespace(root);
  });
}

export function sanitizeSerializedEditorState(
  state: SerializedEditorState
): SerializedEditorState {
  if (!state || !("root" in state)) return state;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isEmptyNode = (node: any): boolean => {
    if (node.type === "text") {
      return node.text.trim() === "";
    }
    if (node.children && Array.isArray(node.children)) {
      return node.children.every(isEmptyNode);
    }
    return false;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitizeNode = (node: any): any => {
    if (node == null) return node;

    // Trim text content
    if (node.type === "text") {
      const textNode = node as SerializedTextNode;
      return {
        ...textNode,
        text: textNode.text.trim(),
      };
    }

    // Recurse into children
    if (node.children && Array.isArray(node.children)) {
      const children = node.children
        .map(sanitizeNode)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((child: any) => !isEmptyNode(child));

      return {
        ...node,
        children,
      } as SerializedElementNode;
    }

    return node;
  };

  return {
    ...state,
    root: sanitizeNode(state.root),
  };
}
