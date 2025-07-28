CREATE TYPE "public"."certainty_level" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
ALTER TABLE "reply_suggestion" ADD COLUMN "certainty_level" "certainty_level" NOT NULL;