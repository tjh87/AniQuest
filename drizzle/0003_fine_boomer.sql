CREATE TABLE `source_check_state` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`running` integer DEFAULT false NOT NULL,
	`lease_until` integer DEFAULT 0 NOT NULL,
	`last_started_at` integer,
	`last_completed_at` integer,
	`total` integer DEFAULT 0 NOT NULL,
	`healthy` integer DEFAULT 0 NOT NULL,
	`warning` integer DEFAULT 0 NOT NULL,
	`broken` integer DEFAULT 0 NOT NULL,
	`unchecked` integer DEFAULT 0 NOT NULL,
	`last_error` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `source_link_health` (
	`url` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`categories` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'unchecked' NOT NULL,
	`http_status` integer,
	`detail` text DEFAULT '' NOT NULL,
	`failure_streak` integer DEFAULT 0 NOT NULL,
	`latency_ms` integer,
	`checked_at` integer,
	`active` integer DEFAULT true NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
