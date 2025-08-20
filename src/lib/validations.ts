import z from "zod";
import {
  PROJECT_STATUS_CREATE_ENUM,
  PROJECT_STATUS_ENUM,
  TASK_PRIORITY_ENUM,
} from "./db/enums";

const errorMessages = {
  required: (field: string) => `${field} is required`,
  numMinimum: (min: number) => `Minimum value is ${min}`,
  numMaximum: (max: number) => `Maximum value is ${max}`,
  minLength: (min: number) => `Minimum length is ${min} characters`,
  maxLength: (max: number) => `Maximum length is ${max} characters`,
  invalidEmail: "Invalid email address",
  invalidUrl: "Invalid URL format",
};

// Base schema for common fields
export const clerkUsersSchema = z.object({
  id: z.string(),
  email: z
    .email()
    .min(1, errorMessages.required("Email"))
    .max(255, errorMessages.maxLength(255)),
  firstName: z
    .string()
    .min(1, errorMessages.required("First name"))
    .max(100, errorMessages.maxLength(100)),
  lastName: z
    .string()
    .min(1, errorMessages.required("Last name"))
    .max(100, errorMessages.maxLength(100)),
  profileImageUrl: z
    .url(errorMessages.invalidUrl)
    .max(512, errorMessages.maxLength(512))
    .optional()
    .refine(
      async (url) => {
        if (!url) return true;
        if (url.startsWith("https://img.clerk.com/")) return true;
        try {
          const res = await fetch(url, { method: "HEAD" });
          const contentType = res.headers.get("content-type");
          return !!contentType && contentType.startsWith("image/");
        } catch {
          return false;
        }
      },
      { message: "Profile image URL must point to an image." }
    ),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const teamsSchema = z.object({
  id: z.guid(),
  name: z
    .string()
    .min(1, errorMessages.required("Team name"))
    .max(100, errorMessages.maxLength(100)),
  description: z.string().max(500, errorMessages.maxLength(500)).optional(),
  leaderId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const taskSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(1, errorMessages.required("Title"))
    .max(255, errorMessages.maxLength(255)),
  description: z.string().max(4000, errorMessages.maxLength(4000)).optional(),
  projectId: z.guid(),
  priority: z.enum(TASK_PRIORITY_ENUM).optional(),
  dueDate: z.date().optional(),
  estimatedHours: z
    .number()
    .min(0, errorMessages.numMinimum(0))
    .max(1000, errorMessages.numMaximum(1000))
    .optional(),
  assigneeId: z.string(),
  createdById: z.string(),
  taskNumber: z.number().min(1, errorMessages.numMinimum(1)),
  order: z
    .number()
    .min(0, errorMessages.numMinimum(0))
    .max(1000, errorMessages.numMaximum(1000))
    .optional(),
  kanbanColumnId: z.guid(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const commentsSchema = z.object({
  id: z.guid(),
  content: z
    .string()
    .min(1, errorMessages.required("Comment"))
    .max(1500, errorMessages.maxLength(1500)),
  taskId: z.number(),
  authorId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const projectsSchema = z
  .object({
    id: z.guid(),
    name: z
      .string()
      .min(1, errorMessages.required("Project name"))
      .max(100, errorMessages.maxLength(100)),
    description: z.string().max(500, errorMessages.maxLength(500)).optional(),
    status: z.enum(PROJECT_STATUS_ENUM),
    startDate: z.date({
      error: (date) => {
        if (date.input === undefined) {
          return "Start date is required.";
        }
        return "Invalid date format.";
      },
    }),
    endDate: z.date({
      error: (date) => {
        if (date.input === undefined) {
          return "End date is required.";
        }
        return "Invalid date format.";
      },
    }),
    defaultBoardId: z.guid().nullable(),
    createdByTeamId: z.guid(),
    createdById: z.string(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate > data.endDate) {
      ctx.addIssue({
        path: ["startDate"],
        message: "Start date cannot be after end date",
        code: "custom",
      });
      ctx.addIssue({
        path: ["endDate"],
        message: "End date cannot be before start date",
        code: "custom",
      });
    }
  });

export const kanbanBoardsSchema = z.object({
  id: z.guid(),
  name: z
    .string()
    .min(1, errorMessages.required("Board name"))
    .max(100, errorMessages.maxLength(100)),
  projectId: z.guid(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const kanbanColumnsSchema = z.object({
  id: z.guid(),
  name: z
    .string()
    .min(1, errorMessages.required("Column name"))
    .max(100, errorMessages.maxLength(100)),
  boardId: z.guid(),
  order: z.number().min(0, errorMessages.numMinimum(0)),
  color: z.string().max(20, errorMessages.maxLength(20)),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const teamMembersSchema = z.object({
  userId: z.string(),
  teamId: z.guid(),
  roleId: z.guid(),
  createdAt: z.date().optional(),
});

export const projectTeamsSchema = z.object({
  projectId: z.guid(),
  teamId: z.guid(),
  isOwner: z.boolean().optional(),
  createdAt: z.date().optional(),
});

// Schemas for insert operations
export const createTeamRequestSchema = teamsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createTaskRequestSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createCommentRequestSchema = commentsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createProjectRequestSchema = projectsSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    status: z.enum(PROJECT_STATUS_CREATE_ENUM, {
      error: (status) => {
        if (status.input === undefined) {
          return "Project status is required.";
        }
        return "Invalid project status.";
      },
    }),
  });

export const createKanbanBoardsRequestSchema = kanbanBoardsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createKanbanColumnRequestSchema = kanbanColumnsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createTeamMemberRequestSchema = teamMembersSchema.omit({
  createdAt: true,
});

export const createProjectTeamRequestSchema = projectTeamsSchema.omit({
  createdAt: true,
});

// Schemas for update operations
export const updateTeamRequestSchema = teamsSchema
  .partial()
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    id: teamsSchema.shape.id,
  });

export const updateTaskRequestSchema = taskSchema
  .partial()
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    id: taskSchema.shape.id,
  });

export const updateCommentRequestSchema = commentsSchema
  .partial()
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    id: commentsSchema.shape.id,
  });

export const updateProjectRequestSchema = projectsSchema
  .partial()
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    id: projectsSchema.shape.id,
  });

export const updateKanbanBoardsRequestSchema = kanbanBoardsSchema
  .partial()
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    id: kanbanBoardsSchema.shape.id,
  });

export const updateKanbanColumnRequestSchema = kanbanColumnsSchema
  .partial()
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    id: kanbanColumnsSchema.shape.id,
  });

export const updateTeamMemberRequestSchema = teamMembersSchema
  .partial()
  .omit({
    createdAt: true,
  })
  .extend({
    userId: teamMembersSchema.shape.userId,
    teamId: teamMembersSchema.shape.teamId,
  });

export const updateProjectTeamRequestSchema = projectTeamsSchema
  .partial()
  .omit({
    createdAt: true,
  })
  .extend({
    projectId: projectTeamsSchema.shape.projectId,
    teamId: projectTeamsSchema.shape.teamId,
  });

//  Schemas for response operations
export const userResponseSchema = clerkUsersSchema.extend({
  teamMembers: z.array(teamMembersSchema).optional().nullable(),
  ledTeams: z.array(teamsSchema).optional().nullable(),
  assignedTasks: z.array(taskSchema).optional().nullable(),
  createdTasks: z.array(taskSchema).optional().nullable(),
  comments: z.array(commentsSchema).optional().nullable(),
});

export const teamResponseSchema = teamsSchema.extend({
  members: z.array(teamMembersSchema).optional().nullable(),
  projects: z.array(projectTeamsSchema).optional().nullable(),
  leader: clerkUsersSchema.optional().nullable(),
});

export const taskResponseSchema = taskSchema.extend({
  project: projectsSchema.optional().nullable(),
  assignee: clerkUsersSchema.optional().nullable(),
  createdBy: clerkUsersSchema.optional().nullable(),
  comments: z.array(commentsSchema).optional().nullable(),
  kanbanColumn: kanbanColumnsSchema.optional().nullable(),
});

export const commentsResponseSchema = commentsSchema.extend({
  task: taskSchema.optional().nullable(),
  author: clerkUsersSchema.optional().nullable(),
});

export const projectResponseSchema = projectsSchema.extend({
  teams: z.array(projectTeamsSchema).optional().nullable(),
  tasks: z.array(taskSchema).optional().nullable(),
  createdBy: clerkUsersSchema.optional().nullable(),
  kanbanBoardss: z.array(kanbanBoardsSchema).optional().nullable(),
  defaultBoard: kanbanBoardsSchema.optional().nullable(),
});

export const kanbanBoardsResponseSchema = kanbanBoardsSchema.extend({
  project: projectsSchema.optional().nullable(),
  columns: z.array(kanbanColumnsSchema).optional().nullable(),
});

export const kanbanColumnsResponseSchema = kanbanColumnsSchema.extend({
  board: kanbanBoardsResponseSchema.optional().nullable(),
  tasks: z.array(taskSchema).optional().nullable(),
});

export const teamMembersResponseSchema = teamMembersSchema.extend({
  user: clerkUsersSchema.optional().nullable(),
  team: teamsSchema.optional().nullable(),
});

export const projectTeamsResponseSchema = projectTeamsSchema.extend({
  project: projectsSchema.optional().nullable(),
  team: teamsSchema.optional().nullable(),
});

// Wizard schema
export const fullWizardSchema = createTeamRequestSchema.extend({
  teamMembers: z.array(createTeamMemberRequestSchema.omit({ teamId: true })),
});

// Filters validation
export const projectFiltersSchema = z.object({
  teamId: z.guid(),
  search: z.string().max(100, errorMessages.maxLength(100)),
  page: z.number().min(1).default(1),
  status: z.enum(PROJECT_STATUS_ENUM).optional(),
  start: z.date().optional(),
  end: z.date().optional(),
  order: z.enum(["asc", "desc"]).default("desc").optional(),
});
