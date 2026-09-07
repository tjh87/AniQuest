import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userProgress = sqliteTable("user_progress", {
  userId: text("user_id").primaryKey(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull(),
  xp: integer("xp").notNull().default(0),
  streakDays: integer("streak_days").notNull().default(0),
  completedLessons: text("completed_lessons").notNull().default("[]"),
  answeredQuizzes: text("answered_quizzes").notNull().default("[]"),
  learningRecords: text("learning_records").notNull().default("[]"),
  quizBest: integer("quiz_best").notNull().default(0),
  lastView: text("last_view").notNull().default("home"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  announcementEnabled: integer("announcement_enabled", { mode: "boolean" }).notNull().default(false),
  announcementText: text("announcement_text").notNull().default(""),
  newsEnabled: integer("news_enabled", { mode: "boolean" }).notNull().default(true),
  quizHintsEnabled: integer("quiz_hints_enabled", { mode: "boolean" }).notNull().default(true),
  dailyGoalXp: integer("daily_goal_xp").notNull().default(100),
  lessonRewardXp: integer("lesson_reward_xp").notNull().default(120),
  quizRewardXp: integer("quiz_reward_xp").notNull().default(50),
  defaultTheme: text("default_theme").notNull().default("system"),
  defaultDensity: integer("default_density").notNull().default(0),
  contentReviewDays: integer("content_review_days").notNull().default(30),
  featuredBiome: text("featured_biome").notNull().default("rainforest"),
  dailyFacts: text("daily_facts").notNull().default("[]"),
  newsFeeds: text("news_feeds").notNull().default("[]"),
  version: integer("version").notNull().default(1),
  updatedBy: text("updated_by").notNull().default("system"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const siteAnalytics = sqliteTable("site_analytics", {
  view: text("view").primaryKey(),
  visits: integer("visits").notNull().default(0),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const adminAudit = sqliteTable("admin_audit", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actorUserId: text("actor_user_id").notNull(),
  action: text("action").notNull(),
  changedKeys: text("changed_keys").notNull(),
  beforeSettings: text("before_settings").notNull(),
  afterSettings: text("after_settings").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const adminWriteLimits = sqliteTable("admin_write_limits", {
  actorUserId: text("actor_user_id").primaryKey(),
  windowStartedAt: integer("window_started_at").notNull(),
  requestCount: integer("request_count").notNull().default(0),
});

export const sourceLinkHealth = sqliteTable("source_link_health", {
  url: text("url").primaryKey(),
  label: text("label").notNull(),
  categories: text("categories").notNull().default("[]"),
  status: text("status").notNull().default("unchecked"),
  httpStatus: integer("http_status"),
  detail: text("detail").notNull().default(""),
  failureStreak: integer("failure_streak").notNull().default(0),
  latencyMs: integer("latency_ms"),
  checkedAt: integer("checked_at"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const sourceCheckState = sqliteTable("source_check_state", {
  id: integer("id").primaryKey().default(1),
  running: integer("running", { mode: "boolean" }).notNull().default(false),
  leaseUntil: integer("lease_until").notNull().default(0),
  lastStartedAt: integer("last_started_at"),
  lastCompletedAt: integer("last_completed_at"),
  total: integer("total").notNull().default(0),
  healthy: integer("healthy").notNull().default(0),
  warning: integer("warning").notNull().default(0),
  broken: integer("broken").notNull().default(0),
  unchecked: integer("unchecked").notNull().default(0),
  lastError: text("last_error").notNull().default(""),
});

export const appDataMigrations = sqliteTable("app_data_migrations", {
  id: text("id").primaryKey(),
  appliedAt: text("applied_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
