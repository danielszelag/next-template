CREATE TABLE `cleaning_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`address_id` text,
	`stream_id` text,
	`live_input_id` text,
	`cleaner_name` text NOT NULL,
	`cleaner_avatar` text,
	`service_type` text DEFAULT 'standard' NOT NULL,
	`scheduled_time` integer,
	`start_time` integer,
	`end_time` integer,
	`duration` integer,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`recording_url` text,
	`thumbnail_url` text,
	`playback_id` text,
	`notes` text,
	`rating` integer,
	`customer_feedback` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `user_addresses` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`street` text NOT NULL,
	`postal_code` text NOT NULL,
	`city` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`email` text,
	`phone` text,
	`balance` integer DEFAULT 0,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_profiles_user_id_unique` ON `user_profiles` (`user_id`);