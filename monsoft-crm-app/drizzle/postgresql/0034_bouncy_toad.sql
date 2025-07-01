CREATE TABLE "brand_whatsapp_number" (
	"id" text PRIMARY KEY NOT NULL,
	"brand_id" text NOT NULL,
	"phone_id" text NOT NULL,
	"phone_number" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brand_whatsapp_number" ADD CONSTRAINT "brand_whatsapp_number_brand_id_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON DELETE cascade ON UPDATE no action;