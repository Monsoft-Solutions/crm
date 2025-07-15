CREATE TABLE "question_by_contact" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_facts_id" text NOT NULL,
	"question" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "question_by_contact" ADD CONSTRAINT "question_by_contact_conversation_facts_id_conversation_facts_id_fk" FOREIGN KEY ("conversation_facts_id") REFERENCES "public"."conversation_facts"("id") ON DELETE cascade ON UPDATE no action;