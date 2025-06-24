CREATE TYPE "public"."contact_whatsapp_message_direction" AS ENUM('inbound', 'outbound');--> statement-breakpoint
CREATE TYPE "public"."contact_whatsapp_message_status" AS ENUM('queued', 'sent', 'delivered', 'read');--> statement-breakpoint
CREATE TABLE "contact_whatsapp_message" (
	"id" text PRIMARY KEY NOT NULL,
	"sid" text,
	"contact_id" text NOT NULL,
	"contact_whatsapp_number" text NOT NULL,
	"direction" "contact_whatsapp_message_direction" NOT NULL,
	"body" text NOT NULL,
	"status" "contact_whatsapp_message_status" DEFAULT 'queued' NOT NULL,
	"created_at" bigint DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact_whatsapp_message" ADD CONSTRAINT "contact_whatsapp_message_contact_id_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;