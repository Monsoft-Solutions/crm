CREATE TYPE "public"."whatsapp_sender_status" AS ENUM('creating', 'offline', 'online');--> statement-breakpoint
ALTER TABLE "brand_whatsapp_number" ADD COLUMN "twilio_sid" text;--> statement-breakpoint
ALTER TABLE "brand_whatsapp_number" ADD COLUMN "sender_status" "whatsapp_sender_status" DEFAULT 'offline' NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_whatsapp_number" ADD COLUMN "is_default" "is_default_phone_number";--> statement-breakpoint
ALTER TABLE "brand_whatsapp_number" DROP COLUMN "phone_id";--> statement-breakpoint
ALTER TABLE "brand_whatsapp_number" ADD CONSTRAINT "brand_whatsapp_number_brand_id_is_default_unique" UNIQUE("brand_id","is_default");