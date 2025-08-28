import type { Role } from "@/src/types";
import { faker } from "@faker-js/faker";
import "dotenv/config";
import { sql } from "drizzle-orm";
import { seed } from "drizzle-seed";
import { db } from "..";
import * as schema from "../schema";
import { config } from "./config";
import {
  kanbanBoardNames,
  kanbanColumnColors,
  kanbanColumnNames,
  projectNames,
  taskTitles,
  teamNames,
} from "./data";

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomRole(): typeof schema.teamMembers.$inferInsert.roleId {
  const rand = Math.random();
  let cumulative = 0;

  for (const [role, probability] of Object.entries(config.roles)) {
    cumulative += probability;
    if (rand <= cumulative) {
      return role as typeof schema.teamMembers.$inferInsert.roleId;
    }
  }

  return "member";
}

function getRoleId(roleName: string, roles: Role[]) {
  const role = roles.find((r) => r.name === roleName);
  if (!role) throw new Error(`Role not found: ${roleName}`);
  return role.id;
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

  const projectStatusNames = schema.PROJECT_STATUS_ENUM.map((status) =>
    status.toLowerCase()
  );

  const taskPriorityNames = schema.TASK_PRIORITY_ENUM.map((priority) =>
    priority.toLowerCase()
  );

  await db.transaction(async (tx) => {
    // Step 1: Reset the database
    console.log("\n🧹 Resetting Dummy Database...");
    await tx.delete(schema.users);
    await tx.delete(schema.teams);
    await tx.delete(schema.projects);
    await tx.delete(schema.tasks);
    await tx.delete(schema.comments);
    await tx.delete(schema.kanbanBoards);
    await tx.delete(schema.kanbanColumns);
    await tx.delete(schema.teamMembers);
    await tx.delete(schema.projectTeams);
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
          id: f.uuid(),
          name: f.valuesFromArray({ values: teamNames }),
          description: f.loremIpsum(),
        },
      },
      projects: {
        count: config.counts.projects,
        columns: {
          id: f.uuid(),
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
          id: f.int({
            isUnique: true,
            minValue: 10000,
            maxValue: config.counts.tasks + 10000,
          }),
          title: f.valuesFromArray({ values: taskTitles }),
          description: f.loremIpsum({ sentencesCount: 4 }),
          priority: f.valuesFromArray({ values: taskPriorityNames }),
          taskNumber: f.int({ isUnique: true, minValue: 1 }),
          order: f.int({ isUnique: true, minValue: 0 }),
          estimatedHours: f.int({ minValue: 1, maxValue: 40 }),
          startDate: f.date({ minDate: "2025-01-01", maxDate: "2025-03-31" }),
          endDate: f.date({ minDate: "2025-04-01", maxDate: "2025-06-30" }),
        },
      },
      comments: {
        count: config.counts.comments,
        columns: {
          id: f.uuid(),
          content: f.loremIpsum({ sentencesCount: 3 }),
        },
      },
      kanbanBoards: {
        count: config.counts.kanbanBoards,
        columns: {
          id: f.uuid(),
          name: f.valuesFromArray({ values: kanbanBoardNames }),
        },
      },
      kanbanColumns: {
        count: config.counts.kanbanColumns,
        columns: {
          id: f.uuid(),
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

    await tx.execute(
      sql`
      SELECT setval(pg_get_serial_sequence('tasks', 'id'), coalesce(max(id), 10000) + 1, false) FROM tasks
      `
    );

    // Step 3: Fetch generated IDs for relationships
    const users = await tx.select().from(schema.users);
    const teams = await tx.select().from(schema.teams);
    const projects = await tx.select().from(schema.projects);

    if (users.length === 0 || teams.length === 0 || projects.length === 0) {
      throw new Error("Insufficient data for junction tables");
    }

    // Step 4: Seed junction tables
    console.log("🌿 Seeding junction tables...");

    const roles = await tx.select().from(schema.roles);

    const teamMembersData = teams.flatMap((team) => {
      const memberCount = faker.number.int(
        config.relationships.teamMembersPerTeam
      );
      const members = getRandomElements(users, memberCount);

      return members.map((user, index) => {
        const roleName = index === 0 ? "owner" : getRandomRole();
        return {
          userId: user.id,
          teamId: team.id,
          roleId: getRoleId(roleName as string, roles), // <-- use roleId here instead of string role
          createdAt: faker.date.past(),
        };
      });
    });

    await tx.insert(schema.teamMembers).values(teamMembersData);

    // Update team leaders based on the owners we just created
    for (const team of teams) {
      const owner = teamMembersData.find(
        (tm) => tm.teamId === team.id && tm.roleId === getRoleId("owner", roles)
      );
      if (owner) {
        await tx
          .update(schema.teams)
          .set({ leaderId: owner.userId })
          .where(sql`${schema.teams.id} = ${team.id}`);
      }
    }

    // Seed project teams (teams to projects)
    const projectTeamsData = projects.flatMap((project) => {
      const assignedTeams = getRandomElements(
        teams,
        faker.number.int(config.relationships.teamsPerProject)
      );

      return assignedTeams.map((team, index) => ({
        projectId: project.id,
        teamId: team.id,
        isOwner: index === 0, // First team is the owner
        createdAt: faker.date.past(),
      }));
    });

    await tx.insert(schema.projectTeams).values(projectTeamsData);

    for (const project of projects) {
      const creatorTeam = projectTeamsData.find(
        (pt) => pt.projectId === project.id && pt.isOwner
      );
      if (creatorTeam) {
        const teamMembers = teamMembersData.filter(
          (tm) => tm.teamId === creatorTeam.teamId
        );
        const creatorUser = getRandomElement(teamMembers);

        if (creatorUser) {
          await tx
            .update(schema.projects)
            .set({
              createdById: creatorUser.userId,
              createdByTeamId: creatorTeam.teamId,
            })
            .where(sql`${schema.projects.id} = ${project.id}`);
        }
      }
    }
  });

  console.log("🎉 Database seeding completed successfully");
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  console.info("ℹ️ Process terminated due to error.");
  process.exit(1);
});
