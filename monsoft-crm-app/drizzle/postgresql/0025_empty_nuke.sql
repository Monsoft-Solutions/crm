ALTER TABLE "contact_sms_message" DROP CONSTRAINT "contact_sms_message_contact_phone_number_id_contact_phone_number_id_fk";
--> statement-breakpoint
ALTER TABLE "contact_sms_message" ADD COLUMN "contact_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_sms_message" ADD COLUMN "phone_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_sms_message" ADD CONSTRAINT "contact_sms_message_contact_id_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_sms_message" DROP COLUMN "contact_phone_number_id";