CREATE TYPE "public"."contact_message_channel" AS ENUM('sms', 'whatsapp', 'email', 'messenger', 'instagram');--> statement-breakpoint
CREATE TYPE "public"."contact_message_direction" AS ENUM('inbound', 'outbound');--> statement-breakpoint
CREATE TYPE "public"."contact_message_status" AS ENUM('accepted', 'queued', 'sending', 'sent', 'delivered', 'read', 'undelivered', 'failed');--> statement-breakpoint
CREATE TABLE "contact_message" (
	"id" text PRIMARY KEY NOT NULL,
	"external_id" text,
	"contact_id" text NOT NULL,
	"channel" "contact_message_channel" NOT NULL,
	"from_address" text NOT NULL,
	"to_address" text NOT NULL,
	"direction" "contact_message_direction" NOT NULL,
	"subject" text,
	"body" text NOT NULL,
	"status" "contact_message_status" DEFAULT 'queued' NOT NULL,
	"created_at" bigint DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::bigint NOT NULL
);
--> statement-breakpoint
DROP TABLE "contact_email" CASCADE;--> statement-breakpoint
DROP TABLE "contact_sms_message" CASCADE;--> statement-breakpoint
DROP TABLE "contact_whatsapp_message" CASCADE;--> statement-breakpoint
ALTER TABLE "contact_message" ADD CONSTRAINT "contact_message_contact_id_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."contact_email_direction";--> statement-breakpoint
DROP TYPE "public"."contact_email_status";--> statement-breakpoint
DROP TYPE "public"."contact_sms_message_direction";--> statement-breakpoint
DROP TYPE "public"."contact_sms_message_status";--> statement-breakpoint
DROP TYPE "public"."contact_whatsapp_message_direction";--> statement-breakpoint
DROP TYPE "public"."contact_whatsapp_message_status";