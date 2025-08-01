DROP INDEX "comments_created_idx";--> statement-breakpoint
CREATE INDEX "projects_name_idx" ON "projects" USING btree ("name");