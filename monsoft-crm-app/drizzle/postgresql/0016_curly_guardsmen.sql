ALTER TABLE "core_conf" DROP CONSTRAINT "core_conf_name_unique";--> statement-breakpoint
ALTER TABLE "core_conf" DROP CONSTRAINT "core_conf_usage_unique";--> statement-breakpoint
ALTER TABLE "custom_conf" DROP CONSTRAINT "custom_conf_name_unique";--> statement-breakpoint
ALTER TABLE "custom_conf" DROP CONSTRAINT "custom_conf_usage_unique";--> statement-breakpoint
ALTER TABLE "core_conf" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "core_conf" DROP COLUMN "usage";--> statement-breakpoint
ALTER TABLE "custom_conf" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "custom_conf" DROP COLUMN "usage";--> statement-breakpoint
DROP TYPE "public"."core_conf_usage";--> statement-breakpoint
DROP TYPE "public"."custom_conf_usage";