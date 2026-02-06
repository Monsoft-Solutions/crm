ALTER TABLE "brand" ADD COLUMN "default_assistant_id" text;--> statement-breakpoint
ALTER TABLE "contact" ADD COLUMN "assistant_id" text;--> statement-breakpoint
ALTER TABLE "brand" ADD CONSTRAINT "brand_default_assistant_id_assistant_id_fk" FOREIGN KEY ("default_assistant_id") REFERENCES "public"."assistant"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact" ADD CONSTRAINT "contact_assistant_id_assistant_id_fk" FOREIGN KEY ("assistant_id") REFERENCES "public"."assistant"("id") ON DELETE set null ON UPDATE no action;