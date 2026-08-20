import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const announcements = sqliteTable("announcements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  eventDate: text("event_date"),
  location: text("location"),
  status: text("status").notNull().default("published"),
  createdAt: text("created_at").notNull(),
});

export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  caption: text("caption"),
  createdAt: text("created_at").notNull(),
});

export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  age: text("age"),
  voice: text("voice"),
  experience: text("experience"),
  message: text("message"),
  createdAt: text("created_at").notNull(),
});
