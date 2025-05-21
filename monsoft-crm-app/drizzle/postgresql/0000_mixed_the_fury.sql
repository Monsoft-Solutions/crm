CREATE TYPE "public"."name" AS ENUM('template_creator', 'template_reviewer', 'template_cleaner', 'template_service_admin');--> statement-breakpoint
CREATE TYPE "public"."core_conf_usage" AS ENUM('current', 'next');--> statement-breakpoint
CREATE TYPE "public"."custom_conf_usage" AS ENUM('current', 'next');--> statement-breakpoint
CREATE TYPE "public"."template_status" AS ENUM('draft', 'finished');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_organization_id" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"last_name" text,
	"language" text,
	"bookmarked" boolean,
	"has_done_tour" boolean,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" char(36) PRIMARY KEY NOT NULL,
	"name" "name" NOT NULL,
	"description" text,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" char(36) PRIMARY KEY NOT NULL,
	"user_id" char(36) NOT NULL,
	"role_id" char(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "core_conf" (
	"id" char(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"usage" "core_conf_usage",
	"random_template_deterministic" boolean NOT NULL,
	"resend_api_key" varchar(255) NOT NULL,
	CONSTRAINT "core_conf_name_unique" UNIQUE("name"),
	CONSTRAINT "core_conf_usage_unique" UNIQUE("usage")
);
--> statement-breakpoint
CREATE TABLE "custom_conf" (
	"id" char(36) PRIMARY KEY NOT NULL,
	"organization_id" char(36) NOT NULL,
	"name" varchar(255) NOT NULL,
	"usage" "custom_conf_usage",
	"random_template_service_active" boolean NOT NULL,
	CONSTRAINT "custom_conf_name_unique" UNIQUE("name"),
	CONSTRAINT "custom_conf_usage_unique" UNIQUE("usage")
);
--> statement-breakpoint
CREATE TABLE "template" (
	"id" char(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"creator" char(36) NOT NULL,
	"status" "template_status" DEFAULT 'draft' NOT NULL,
	CONSTRAINT "template_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_conf" ADD CONSTRAINT "custom_conf_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template" ADD CONSTRAINT "template_creator_user_id_fk" FOREIGN KEY ("creator") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;