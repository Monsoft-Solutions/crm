CREATE TABLE "contact_phone_number" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text NOT NULL,
	"phone_number" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_sms_message" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_phone_number_id" text NOT NULL,
	"body" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact_phone_number" ADD CONSTRAINT "contact_phone_number_contact_id_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_sms_message" ADD CONSTRAINT "contact_sms_message_contact_phone_number_id_contact_phone_number_id_fk" FOREIGN KEY ("contact_phone_number_id") REFERENCES "public"."contact_phone_number"("id") ON DELETE no action ON UPDATE no action;