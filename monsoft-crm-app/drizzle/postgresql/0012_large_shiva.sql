ALTER TABLE "contact_email" DROP CONSTRAINT "contact_email_contact_email_address_id_contact_email_address_id_fk";
--> statement-breakpoint
ALTER TABLE "contact_email" ADD CONSTRAINT "contact_email_contact_email_address_id_contact_email_address_id_fk" FOREIGN KEY ("contact_email_address_id") REFERENCES "public"."contact_email_address"("id") ON DELETE cascade ON UPDATE no action;