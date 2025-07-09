CREATE TYPE "public"."product_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."is_main_product_image" AS ENUM('true');--> statement-breakpoint
CREATE TABLE "product_image" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"image_url" text NOT NULL,
	"is_main" "is_main_product_image",
	"created_at" bigint DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::bigint NOT NULL,
	CONSTRAINT "product_image_product_id_is_main_unique" UNIQUE("product_id","is_main")
);
--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "sku" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "status" "product_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "stock" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "created_at" bigint DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "updated_at" bigint DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "product_image" ADD CONSTRAINT "product_image_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_sku_unique" UNIQUE("sku");