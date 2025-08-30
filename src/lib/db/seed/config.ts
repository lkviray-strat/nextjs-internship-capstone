// AUTHORIZATION CONFIGURATION ======================================

import type {
  PermissionActionsEnum,
  PermissionResourcesEnum,
} from "@/src/types";
import { PERMISSION_ACTIONS, PERMISSION_RESOURCES } from "../enums";

/* Combinations:
PROJECTS: view:project, create:project, update:project, delete:project
TEAMS: view:team, create:team, update:team, delete:team
TASK: view:task, create:task, update:task, delete:task
KANBAN COLUMN: view:kanban_column, create:kanban_column, update:kanban_column, delete:kanban_column
KANBAN BOARD: view:kanban_board, create:kanban_board, update:kanban_board, delete:kanban_board
TEAM MEMBER: view:team_member, create:team_member, update:team_member, delete:team_member
PROJECT TEAM: view:project_team, create:project_team, update:project_team, delete:project_team
COMMENT: view:comment, create:comment, update:comment, delete:comment 
*/

const generatePermissions = (
  selectedActions: PermissionActionsEnum[],
  selectedResources: PermissionResourcesEnum[]
): string[] =>
  selectedResources.flatMap((resource) =>
    selectedActions.map((action) => `${action}:${resource}`)
  );

const actions = [...PERMISSION_ACTIONS];
const resources = [...PERMISSION_RESOURCES];
// Predefined permission groups
const allPermissions = generatePermissions(actions, resources);

const viewPermissions = generatePermissions(["view"], resources);
const createPermissions = generatePermissions(["create"], resources);
const updatePermissions = generatePermissions(["update"], resources);
const deletePermissions = generatePermissions(["delete"], resources);

export const authorizations = {
  owner: {
    priority: 0,
    canLead: true,
    permissions: allPermissions,
  },
  admin: {
    priority: 1,
    canLead: true,
    permissions: [
      ...viewPermissions,
      ...createPermissions,
      ...updatePermissions,
      "delete:team_member",
      "delete:task",
      "delete:kanban_column",
      "delete:kanban_board",
      "delete:comment",
    ],
  },
  member: {
    priority: 2,
    canLead: true,
    permissions: [
      ...viewPermissions,
      "create:team",
      "create:task",
      "create:comment",
    ],
  },
  viewer: {
    priority: 3,
    canLead: false,
    permissions: [...viewPermissions, "create:team"],
  },
} as const;

// SEEDER CONFIGURATION ======================================

export const config = {
  // Number of records to generate for each table
  counts: {
    users: 20,
    teams: 10,
    projects: 15,
    tasks: 100,
    comments: 200,
    kanbanBoards: 8,
    kanbanColumns: 40, // ~5 per board
  },

  // Relationship configuration
  relationships: {
    teamMembersPerTeam: { min: 1, max: 5 },
    teamsPerProject: { min: 1, max: 3 },
    taskAssignmentChance: 0.7,
    taskDueDateChance: 0.5,
  },

  // Role distribution (must sum to 1)
  roles: {
    admin: 0.2,
    member: 0.5,
    viewer: 0.2,
  },
} as const;
