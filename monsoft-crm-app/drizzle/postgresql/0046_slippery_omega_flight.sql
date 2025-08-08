ALTER TABLE "topic_discussed" DROP CONSTRAINT "topic_discussed_conversation_facts_id_conversation_facts_id_fk";
--> statement-breakpoint
ALTER TABLE "topic_discussed" ADD CONSTRAINT "topic_discussed_conversation_facts_id_conversation_facts_id_fk" FOREIGN KEY ("conversation_facts_id") REFERENCES "public"."conversation_facts"("id") ON DELETE cascade ON UPDATE no action;