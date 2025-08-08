ALTER TABLE "project_teams" RENAME COLUMN "is_creator" TO "is_owner";--> statement-breakpoint
DROP INDEX "project_teams_creator_idx";--> statement-breakpoint
CREATE INDEX "project_teams_owner_idx" ON "project_teams" USING btree ("is_owner");