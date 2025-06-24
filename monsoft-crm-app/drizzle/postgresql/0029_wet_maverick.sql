CREATE TABLE "brand_phone_number" (
	"id" text PRIMARY KEY NOT NULL,
	"brand_id" text NOT NULL,
	"phone_number" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brand_phone_number" ADD CONSTRAINT "brand_phone_number_brand_id_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand" DROP COLUMN "phone_number";