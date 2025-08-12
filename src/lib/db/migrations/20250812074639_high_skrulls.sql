ALTER TABLE "team_members" RENAME COLUMN "role" TO "role_id";--> statement-breakpoint
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_role_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "team_members_role_idx" ON "team_members" USING btree ("role_id");