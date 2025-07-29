// db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const POSTGRES_DATABASE_URL = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

export const db = () => {
  if (process.env.USE_NEON?.toLowerCase() === "true") {
    const sql = neon(process.env.NEON_DATABASE_URL!);
    return drizzleNeon({ client: sql });
  } else {
    const pool = new Pool({
      connectionString: POSTGRES_DATABASE_URL,
    });
    return drizzlePg({ client: pool });
  }
};

export const queries = {
  projects: {
    getAll: () => {
      console.log("TODO: Task 4.1 - Implement project CRUD operations");
      return [];
    },
    getById: (id: string) => {
      console.log(`TODO: Get project by ID: ${id}`);
      return null;
    },
    create: (data: any) => {
      console.log("TODO: Create project", data);
      return null;
    },
    update: (id: string, data: any) => {
      console.log(`TODO: Update project ${id}`, data);
      return null;
    },
    delete: (id: string) => {
      console.log(`TODO: Delete project ${id}`);
      return null;
    },
  },
  tasks: {
    getByProject: (projectId: string) => {
      console.log(`TODO: Task 4.4 - Get tasks for project ${projectId}`);
      return [];
    },
    create: (data: any) => {
      console.log("TODO: Create task", data);
      return null;
    },
    update: (id: string, data: any) => {
      console.log(`TODO: Update task ${id}`, data);
      return null;
    },
    delete: (id: string) => {
      console.log(`TODO: Delete task ${id}`);
      return null;
    },
  },
};
