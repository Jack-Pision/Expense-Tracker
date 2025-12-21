import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const transactions = sqliteTable("transactions", {
    id: text("id").primaryKey(), // We will generate UUIDs in the app or DB
    description: text("description").notNull(),
    amount: real("amount").notNull(), // using real for float values
    date: text("date").notNull(),
    category: text("category").notNull(),
    type: text("type").notNull(), // 'income' | 'expense'
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const budgets = sqliteTable("budgets", {
    id: text("id").primaryKey(),
    category: text("category").notNull(),
    amount: real("amount").notNull(), // The budget limit
    period: text("period").default("monthly"), // monthly, yearly
    color: text("color").default("bg-blue-500"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;
