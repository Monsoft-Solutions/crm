ALTER TABLE "brand" DROP CONSTRAINT "brand_default_assistant_id_assistant_id_fk";
--> statement-breakpoint
ALTER TABLE "reply_suggestion" ADD COLUMN "selected_at" bigint DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::bigint;