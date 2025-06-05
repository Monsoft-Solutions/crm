ALTER TABLE "contact_email_address" DROP CONSTRAINT "contact_email_address_contact_id_contact_id_fk";
--> statement-breakpoint
ALTER TABLE "contact_phone_number" DROP CONSTRAINT "contact_phone_number_contact_id_contact_id_fk";
--> statement-breakpoint
ALTER TABLE "contact_email_address" ADD CONSTRAINT "contact_email_address_contact_id_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_phone_number" ADD CONSTRAINT "contact_phone_number_contact_id_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;