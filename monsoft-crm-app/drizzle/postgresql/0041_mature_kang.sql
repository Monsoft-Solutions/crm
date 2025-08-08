CREATE TYPE "public"."assistant_model" AS ENUM('claude-3-7-sonnet-latest', 'claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest', 'claude-3-opus-latest', 'claude-3-haiku-20240307', 'gpt-4o-2024-05-13', 'gpt-4o-mini-2024-07-18');--> statement-breakpoint
CREATE TYPE "public"."assistant_tone" AS ENUM('friendly', 'professional');--> statement-breakpoint
CREATE TABLE "assistant" (
	"id" text PRIMARY KEY NOT NULL,
	"brand_id" text NOT NULL,
	"name" text NOT NULL,
	"model" "assistant_model" NOT NULL,
	"tone" "assistant_tone" NOT NULL,
	"prompt" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assistant" ADD CONSTRAINT "assistant_brand_id_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON DELETE cascade ON UPDATE no action;