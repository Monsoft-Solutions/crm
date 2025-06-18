CREATE TYPE "public"."contact_email_direction" AS ENUM('inbound', 'outbound');--> statement-breakpoint
CREATE TYPE "public"."contact_email_status" AS ENUM('queued', 'sent', 'delivered', 'read');--> statement-breakpoint
ALTER TABLE "contact_email" ADD COLUMN "direction" "contact_email_direction" NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_email" ADD COLUMN "status" "contact_email_status" DEFAULT 'queued' NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_email" ADD COLUMN "created_at" bigint DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::bigint NOT NULL;