ALTER TABLE "tasks" DROP CONSTRAINT "tasks_kanban_column_id_kanban_columns_id_fk";
--> statement-breakpoint
ALTER TABLE "kanban_columns" ALTER COLUMN "board_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "kanban_column_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_kanban_column_id_kanban_columns_id_fk" FOREIGN KEY ("kanban_column_id") REFERENCES "public"."kanban_columns"("id") ON DELETE cascade ON UPDATE no action;