CREATE TYPE "public"."is_default_phone_number" AS ENUM('true');--> statement-breakpoint
ALTER TABLE "contact_phone_number" ADD COLUMN "is_default" "is_default_phone_number";--> statement-breakpoint
ALTER TABLE "contact_phone_number" ADD CONSTRAINT "contact_phone_number_is_default_unique" UNIQUE("is_default");