CREATE TABLE `admin_audit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor_user_id` text NOT NULL,
	`action` text NOT NULL,
	`changed_keys` text NOT NULL,
	`before_settings` text NOT NULL,
	`after_settings` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `admin_write_limits` (
	`actor_user_id` text PRIMARY KEY NOT NULL,
	`window_started_at` integer NOT NULL,
	`request_count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`announcement_enabled` integer DEFAULT false NOT NULL,
	`announcement_text` text DEFAULT '' NOT NULL,
	`news_enabled` integer DEFAULT true NOT NULL,
	`quiz_hints_enabled` integer DEFAULT true NOT NULL,
	`daily_goal_xp` integer DEFAULT 100 NOT NULL,
	`lesson_reward_xp` integer DEFAULT 120 NOT NULL,
	`quiz_reward_xp` integer DEFAULT 50 NOT NULL,
	`default_theme` text DEFAULT 'system' NOT NULL,
	`default_density` integer DEFAULT 0 NOT NULL,
	`content_review_days` integer DEFAULT 30 NOT NULL,
	`featured_biome` text DEFAULT 'rainforest' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`updated_by` text DEFAULT 'system' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
