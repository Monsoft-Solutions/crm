CREATE INDEX "contact_message_contact_created_idx" ON "contact_message" USING btree ("contact_id","created_at");--> statement-breakpoint
CREATE INDEX "contact_message_external_id_idx" ON "contact_message" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "contact_message_contact_direction_status_idx" ON "contact_message" USING btree ("contact_id","direction","status");