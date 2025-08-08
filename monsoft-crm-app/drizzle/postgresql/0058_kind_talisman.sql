CREATE TYPE "public"."assistant_type" AS ENUM('sales', 'customer_success', 'support', 'marketing');--> statement-breakpoint
ALTER TABLE "assistant" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "assistant" ADD COLUMN "type" "assistant_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "assistant" ADD COLUMN "expertise" text NOT NULL;