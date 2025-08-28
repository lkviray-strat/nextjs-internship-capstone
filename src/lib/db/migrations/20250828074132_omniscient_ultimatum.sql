ALTER TABLE "tasks" RENAME COLUMN "due_date" TO "end_date";--> statement-breakpoint
DROP INDEX "tasks_due_date_idx";--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "start_date" timestamp;--> statement-breakpoint
CREATE INDEX "tasks_start_date_idx" ON "tasks" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "tasks_end_date_idx" ON "tasks" USING btree ("end_date");