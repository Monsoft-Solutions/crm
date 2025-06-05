ALTER TABLE "contact_sms_message" DROP CONSTRAINT "contact_sms_message_contact_phone_number_id_contact_phone_number_id_fk";
--> statement-breakpoint
ALTER TABLE "contact_sms_message" ADD CONSTRAINT "contact_sms_message_contact_phone_number_id_contact_phone_number_id_fk" FOREIGN KEY ("contact_phone_number_id") REFERENCES "public"."contact_phone_number"("id") ON DELETE cascade ON UPDATE no action;