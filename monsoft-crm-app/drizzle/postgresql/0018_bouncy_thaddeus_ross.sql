ALTER TABLE "custom_conf" ALTER COLUMN "random_template_service_active" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_conf" ALTER COLUMN "twilio_sid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_conf" ALTER COLUMN "twilio_token" DROP NOT NULL;