// AUTHORIZATION CONFIGURATION ======================================

export const authorizations = {
  owner: {
    priority: 0,
    canLead: true,
    permissions: [
      "create:project",
      "view:project",
      "update:project",
      "delete:project",
      "create:team",
      "view:team",
      "update:team",
      "delete:team",
    ],
  },
  admin: {
    priority: 1,
    canLead: true,
    permissions: ["view:project", "update:project", "view:team", "update:team"],
  },
  member: {
    priority: 2,
    canLead: true,
    permissions: ["view:project", "view:team"],
  },
  viewer: {
    priority: 3,
    canLead: false,
    permissions: [],
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
