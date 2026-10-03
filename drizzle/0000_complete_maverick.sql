CREATE TABLE `alerts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`area_id` text NOT NULL,
	`hazard` text NOT NULL,
	`level` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	`read_at` text,
	`email_state` text DEFAULT 'not_configured' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_alerts_user_time` ON `alerts` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `feed_cache` (
	`cache_key` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`fetched_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `monitor_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`ran_at` text NOT NULL,
	`profiles` integer NOT NULL,
	`alerts` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`area_id` text NOT NULL,
	`enabled` integer DEFAULT 1 NOT NULL,
	`threshold` text DEFAULT 'caution' NOT NULL,
	`email_enabled` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
