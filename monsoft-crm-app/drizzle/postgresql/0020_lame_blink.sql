ALTER TABLE "custom_conf" DROP CONSTRAINT "custom_conf_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "custom_conf" ADD CONSTRAINT "custom_conf_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;