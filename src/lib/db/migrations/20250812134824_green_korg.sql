DROP INDEX "roles_name_idx";--> statement-breakpoint
DROP INDEX "roles_priority_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "roles_name_idx" ON "roles" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_priority_idx" ON "roles" USING btree ("priority");