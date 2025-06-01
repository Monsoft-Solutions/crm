ALTER TABLE "core_conf" ADD COLUMN "twilio_sid" text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE "core_conf" ADD COLUMN "twilio_token" text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE "core_conf" ADD COLUMN "twilio_from" text NOT NULL DEFAULT '';

ALTER TABLE "core_conf" ALTER COLUMN "twilio_sid" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "core_conf" ALTER COLUMN "twilio_token" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "core_conf" ALTER COLUMN "twilio_from" DROP DEFAULT;
