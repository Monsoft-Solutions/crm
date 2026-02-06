CREATE TYPE "public"."response_mode" AS ENUM('auto_reply', 'suggest_reply');--> statement-breakpoint
ALTER TABLE "assistant" ADD COLUMN "response_mode" "response_mode" DEFAULT 'auto_reply' NOT NULL;