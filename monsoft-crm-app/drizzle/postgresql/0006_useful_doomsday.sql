CREATE TYPE "public"."contact_sms_message_direction" AS ENUM('inbound', 'outbound');--> statement-breakpoint
ALTER TABLE "contact" ADD COLUMN "created_at" bigint DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_sms_message" ADD COLUMN "direction" "contact_sms_message_direction" NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_sms_message" ADD COLUMN "created_at" bigint DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::bigint NOT NULL;