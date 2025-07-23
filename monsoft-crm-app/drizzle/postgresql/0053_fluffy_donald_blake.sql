CREATE TYPE "public"."brand_company_size" AS ENUM('startup', 'small', 'medium', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."brand_industry" AS ENUM('technology', 'healthcare', 'finance', 'education', 'retail', 'manufacturing', 'construction', 'transportation', 'hospitality', 'media', 'consulting', 'real_estate', 'agriculture', 'energy', 'telecommunications', 'automotive', 'legal', 'non_profit', 'government', 'other');--> statement-breakpoint
ALTER TABLE "brand" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "brand" ADD COLUMN "industry" "brand_industry" NOT NULL;--> statement-breakpoint
ALTER TABLE "brand" ADD COLUMN "company_size" "brand_company_size" NOT NULL;--> statement-breakpoint
ALTER TABLE "brand" ADD COLUMN "founded_year" integer NOT NULL;