CREATE TYPE "public"."detail_level" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TABLE "assistant_behavior" (
	"id" text PRIMARY KEY NOT NULL,
	"communication_style" text NOT NULL,
	"response_tone" text NOT NULL,
	"detail_level" "detail_level" NOT NULL
);
