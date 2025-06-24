ALTER TABLE "contact_email" DROP CONSTRAINT "contact_email_contact_email_address_id_contact_email_address_id_fk";
--> statement-breakpoint
ALTER TABLE "contact_email" ADD COLUMN "contact_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_email" ADD COLUMN "contact_email_address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_email" ADD CONSTRAINT "contact_email_contact_id_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_email" DROP COLUMN "contact_email_address_id";