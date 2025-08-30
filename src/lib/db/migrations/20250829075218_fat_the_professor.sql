ALTER TABLE "comments" ALTER COLUMN "content" SET DATA TYPE jsonb USING content::jsonb;
ALTER TABLE "tasks" ALTER COLUMN "description" SET DATA TYPE jsonb USING description::jsonb;