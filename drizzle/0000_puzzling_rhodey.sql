CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "option_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"option_id" uuid NOT NULL,
	"label" text NOT NULL,
	"input_type" text NOT NULL,
	"min" integer,
	"max" integer,
	"step" integer,
	"unit" text,
	"show_price" boolean DEFAULT false,
	"required" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "options" (
	"id" integer NOT NULL,
	"option_id" integer NOT NULL,
	"group" text NOT NULL,
	"name" text NOT NULL,
	"hidden" text NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"uuid" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"alt" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"product_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"cloudflare_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_shipping_data" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"product_id" uuid NOT NULL,
	"weight_lb" real NOT NULL,
	"weight_oz" real NOT NULL,
	"quantity_per_package" integer NOT NULL,
	"is_available" integer NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"length" real NOT NULL,
	"width" real NOT NULL,
	"height" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"handle" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"uuid" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subcategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"category_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "option_metadata" ADD CONSTRAINT "option_metadata_option_id_options_uuid_fk" FOREIGN KEY ("option_id") REFERENCES "public"."options"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;