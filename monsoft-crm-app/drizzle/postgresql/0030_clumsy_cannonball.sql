CREATE TABLE "brand_domain" (
	"id" text PRIMARY KEY NOT NULL,
	"brand_id" text NOT NULL,
	"domain" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brand_email_address" (
	"id" text PRIMARY KEY NOT NULL,
	"brand_domain_id" text NOT NULL,
	"username" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brand_domain" ADD CONSTRAINT "brand_domain_brand_id_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_email_address" ADD CONSTRAINT "brand_email_address_brand_domain_id_brand_domain_id_fk" FOREIGN KEY ("brand_domain_id") REFERENCES "public"."brand_domain"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand" DROP COLUMN "domain";