CREATE TABLE "contact_message_summary" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text NOT NULL,
	"summary" text NOT NULL,
	"from" bigint DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::bigint NOT NULL,
	"to" bigint DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact_message_summary" ADD CONSTRAINT "contact_message_summary_contact_id_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;