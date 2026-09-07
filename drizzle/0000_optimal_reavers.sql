CREATE TABLE `user_progress` (
	`user_id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`email` text NOT NULL,
	`xp` integer DEFAULT 0 NOT NULL,
	`streak_days` integer DEFAULT 0 NOT NULL,
	`completed_lessons` text DEFAULT '[]' NOT NULL,
	`answered_quizzes` text DEFAULT '[]' NOT NULL,
	`quiz_best` integer DEFAULT 0 NOT NULL,
	`last_view` text DEFAULT 'home' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
