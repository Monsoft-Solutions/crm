ALTER TABLE "core_conf" ADD COLUMN "langfuse_base_url" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "core_conf" ADD COLUMN "langfuse_public_key" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "core_conf" ADD COLUMN "langfuse_secret_key" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "core_conf" ADD COLUMN "anthropic_api_key" varchar(255) NOT NULL;