import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const roadmaps = pgTable("roadmaps", {
  id: text("id").primaryKey(),
  topic: text("topic").notNull(),
  content: jsonb("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const schema = {
  roadmaps,
};