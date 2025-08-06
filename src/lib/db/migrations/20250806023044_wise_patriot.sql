ALTER TABLE "tasks" ALTER COLUMN "id" SET START WITH 10000;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "task_number" integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "tasks_unique_task_number_idx" ON "tasks" USING btree ("task_number","project_id");