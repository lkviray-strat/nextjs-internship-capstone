import { faker } from "@faker-js/faker";
import "dotenv/config";
import { sql } from "drizzle-orm";
import { reset, seed } from "drizzle-seed";
import { db } from ".";
import * as schema from "./schema";

const config = {
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
};

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomRole(): typeof schema.teamMembers.$inferInsert.role {
  const rand = Math.random();
  let cumulative = 0;

  for (const [role, probability] of Object.entries(config.roles)) {
    cumulative += probability;
    if (rand <= cumulative) {
      return role as typeof schema.teamMembers.$inferInsert.role;
    }
  }

  return "member";
}

async function main() {
  // Define main tables (non-junction tables)
  const mainTables = {
    users: schema.users,
    teams: schema.teams,
    projects: schema.projects,
    tasks: schema.tasks,
    comments: schema.comments,
    kanbanBoards: schema.kanbanBoards,
    kanbanColumns: schema.kanbanColumns,
  };

  const teamNames = [
    "Software Team",
    "Product Team",
    "Development Team",
    "QA Team",
    "Design Team",
    "DevOps Team",
    "Support Team",
    "Research Team",
    "Marketing Team",
    "Data Team",
  ];

  const projectNames = [
    "Apollo CRM",
    "Nebula Analytics",
    "Quantum Tasker",
    "PixelForge Studio",
    "SprintFlow",
    "CodeAtlas",
    "DevSync Portal",
    "BugTracker Pro",
    "ReleaseRadar",
    "AgileBoard",
    "StackVision",
    "CloudPilot",
    "TestLab",
    "FeaturePulse",
    "DeployMate",
  ];

  const taskTitles = [
    "Design login page UI",
    "Implement authentication flow",
    "Set up database schema",
    "Write API documentation",
    "Fix bug in user registration",
    "Optimize dashboard performance",
    "Create onboarding tutorial",
    "Integrate third-party analytics",
    "Refactor project structure",
    "Develop notification system",
    "Test payment gateway integration",
    "Update dependencies",
    "Configure CI/CD pipeline",
    "Review pull requests",
    "Deploy to staging environment",
    "Conduct usability testing",
    "Implement role-based access control",
    "Write unit tests for models",
    "Improve error handling",
    "Schedule team meeting",
  ];

  const kanbanBoardNames = [
    "Sprint Board",
    "Product Roadmap",
    "Bug Tracking",
    "Release Planning",
    "Design Workflow",
    "QA Pipeline",
    "Feature Development",
    "Support Tickets",
  ];

  const kanbanColumnNames = [
    "Backlog",
    "To Do",
    "In Progress",
    "Review",
    "Done",
  ];

  const kanbanColumnColors = [
    "#A3A3A3", // Backlog - gray
    "#2563EB", // To Do - blue
    "#F59E42", // In Progress - orange
    "#FACC15", // Review - yellow
    "#22C55E", // Done - green
  ];

  const projectStatusNames = schema.PROJECT_STATUS_ENUM.map((status) =>
    status.toLowerCase()
  );

  const taskPriorityNames = schema.TASK_PRIORITY_ENUM.map((priority) =>
    priority.toLowerCase()
  );

  const taskStatusNames = schema.TASK_STATUS_ENUM.map((status) =>
    status.toLowerCase()
  );

  await db.transaction(async (tx) => {
    // Step 1: Reset the database
    console.log("🧹 Resetting database...");
    await reset(tx, schema);
    console.log("✅ Database reset successfully");

    // Step 2: Seed main tables with configured counts
    console.log("🌱 Seeding main tables...");
    await seed(tx, mainTables).refine((f) => ({
      users: {
        count: config.counts.users,
        columns: {
          // clerk-style email pattern
          email: f.email(),
          firstName: f.firstName(),
          lastName: f.lastName(),
          profileImageUrl: f.string(),
        },
      },
      teams: {
        count: config.counts.teams,
        columns: {
          name: f.valuesFromArray({ values: teamNames }),
          description: f.loremIpsum(),
        },
      },
      projects: {
        count: config.counts.projects,
        columns: {
          name: f.valuesFromArray({ values: projectNames }),
          description: f.loremIpsum({ sentencesCount: 3 }),
          status: f.valuesFromArray({ values: projectStatusNames }),
          startDate: f.date({ minDate: "2025-01-01", maxDate: "2025-03-31" }),
          endDate: f.date({ minDate: "2025-04-01", maxDate: "2025-06-30" }),
        },
      },
      tasks: {
        count: config.counts.tasks,
        columns: {
          title: f.valuesFromArray({ values: taskTitles }),
          description: f.loremIpsum({ sentencesCount: 4 }),
          status: f.valuesFromArray({ values: taskStatusNames }),
          priority: f.valuesFromArray({ values: taskPriorityNames }),
          estimatedHours: f.int({ minValue: 1, maxValue: 40 }),
        },
      },
      comments: {
        count: config.counts.comments,
        columns: {
          content: f.loremIpsum({ sentencesCount: 3 }),
        },
      },
      kanbanBoards: {
        count: config.counts.kanbanBoards,
        columns: {
          name: f.valuesFromArray({ values: kanbanBoardNames }),
        },
      },
      kanbanColumns: {
        count: config.counts.kanbanColumns,
        columns: {
          name: f.valuesFromArray({ values: kanbanColumnNames }),
          color: f.valuesFromArray({ values: kanbanColumnColors }),
          order: f.int({
            minValue: 0,
            maxValue: config.counts.kanbanColumns,
            isUnique: true,
          }),
        },
      },
    }));
    console.log("✅ Main tables seeded successfully");

    // Step 3: Fetch generated IDs for relationships
    console.log("🔍 Fetching data for junction tables...");
    const users = await tx.select().from(schema.users);
    const teams = await tx.select().from(schema.teams);
    const projects = await tx.select().from(schema.projects);

    if (users.length === 0 || teams.length === 0 || projects.length === 0) {
      throw new Error("Insufficient data for junction tables");
    }

    // Step 4: Seed junction tables
    console.log("🌿 Seeding junction tables...");

    const teamMembersData = teams.flatMap((team) => {
      const memberCount = faker.number.int(
        config.relationships.teamMembersPerTeam
      );
      const members = getRandomElements(users, memberCount);

      return members.map((user, index) => ({
        userId: user.id,
        teamId: team.id,
        role: index === 0 ? "owner" : getRandomRole(),
        createdAt: faker.date.past(),
      }));
    });

    await tx.insert(schema.teamMembers).values(teamMembersData);
    console.log(`✅ Seeded ${teamMembersData.length} team members`);

    // Update team leaders based on the owners we just created
    for (const team of teams) {
      const owner = teamMembersData.find(
        (tm) => tm.teamId === team.id && tm.role === "owner"
      );
      if (owner) {
        await tx
          .update(schema.teams)
          .set({ leaderId: owner.userId })
          .where(sql`${schema.teams.id} = ${team.id}`);
      }
    }
    console.log("✅ Updated team leaders");

    // Seed project teams (teams to projects)
    const projectTeamsData = projects.flatMap((project) => {
      const assignedTeams = getRandomElements(
        teams,
        faker.number.int(config.relationships.teamsPerProject)
      );

      return assignedTeams.map((team, index) => ({
        projectId: project.id,
        teamId: team.id,
        isCreator: index === 0, // First team is the creator
        createdAt: faker.date.past(),
      }));
    });

    await tx.insert(schema.projectTeams).values(projectTeamsData);
    console.log(
      `✅ Seeded ${projectTeamsData.length} project-team relationships`
    );

    for (const project of projects) {
      const creatorTeam = projectTeamsData.find(
        (pt) => pt.projectId === project.id && pt.isCreator
      );
      if (creatorTeam) {
        const teamMembers = teamMembersData.filter(
          (tm) => tm.teamId === creatorTeam.teamId
        );
        const creatorUser = getRandomElement(teamMembers);

        if (creatorUser) {
          await tx
            .update(schema.projects)
            .set({ createdById: creatorUser.userId })
            .where(sql`${schema.projects.id} = ${project.id}`);
        }
      }
    }
    console.log("✅ Updated project creators");
  });

  console.log("🎉 Database seeding completed successfully");
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
