import { pgTable, text, numeric, timestamp, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const transactions = pgTable("transactions", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id").notNull(), // Links to Supabase Auth User
    description: text("description").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    date: text("date").notNull(),
    category: text("category").notNull(),
    type: text("type").notNull(), // 'income' | 'expense'
    createdAt: timestamp("created_at").defaultNow(),
});

export const budgets = pgTable("budgets", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id").notNull(),
    category: text("category").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    period: text("period").default("monthly"), // monthly, yearly
    color: text("color").default("bg-blue-500"),
    createdAt: timestamp("created_at").defaultNow(),
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;
