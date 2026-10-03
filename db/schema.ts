import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const profiles = sqliteTable("profiles", {
  userId: text("user_id").primaryKey(),
  email: text("email").notNull(),
  areaId: text("area_id").notNull(),
  enabled: integer("enabled").notNull().default(1),
  threshold: text("threshold").notNull().default("caution"),
  emailEnabled: integer("email_enabled").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});
export const alerts = sqliteTable(
  "alerts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    areaId: text("area_id").notNull(),
    hazard: text("hazard").notNull(),
    level: text("level").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    createdAt: text("created_at").notNull(),
    readAt: text("read_at"),
    emailState: text("email_state").notNull().default("not_configured"),
  },
  (t) => [index("idx_alerts_user_time").on(t.userId, t.createdAt)],
);
export const cache = sqliteTable("feed_cache", {
  key: text("cache_key").primaryKey(),
  payload: text("payload").notNull(),
  fetchedAt: text("fetched_at").notNull(),
});
export const monitorRuns = sqliteTable("monitor_runs", {
  id: text("id").primaryKey(),
  ranAt: text("ran_at").notNull(),
  profiles: integer("profiles").notNull(),
  alerts: integer("alerts").notNull(),
});
