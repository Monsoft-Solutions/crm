CREATE TABLE "conversation_facts" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topic_discussed" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_facts_id" text NOT NULL,
	"topic" text NOT NULL
);
