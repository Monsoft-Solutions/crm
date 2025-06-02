CREATE TYPE "public"."contact_sms_message_status" AS ENUM('queued', 'sent', 'delivered');--> statement-breakpoint
ALTER TABLE "contact_sms_message" ADD COLUMN "status" "contact_sms_message_status" DEFAULT 'queued' NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_sms_message" DROP COLUMN "is_read";