ALTER TABLE "contact" DROP CONSTRAINT "contact_brand_id_brand_id_fk";
--> statement-breakpoint
ALTER TABLE "contact" ADD CONSTRAINT "contact_brand_id_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON DELETE cascade ON UPDATE no action;