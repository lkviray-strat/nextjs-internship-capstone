ALTER TABLE "team_members" DROP CONSTRAINT "team_members_role_id_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "team_members" ALTER COLUMN "role_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;