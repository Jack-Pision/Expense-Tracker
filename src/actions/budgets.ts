"use server";

import { db } from "@/db";
import { budgets, transactions, NewBudget } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc, sql } from "drizzle-orm";

export async function getBudgets() {
    try {
        const allBudgets = await db.select().from(budgets);
        return { success: true, data: allBudgets };
    } catch (error) {
        console.error("Failed to fetch budgets:", error);
        return { success: false, error: "Failed to fetch budgets" };
    }
}

export async function addBudget(data: Omit<NewBudget, "id" | "createdAt">) {
    try {
        await db.insert(budgets).values({
            id: crypto.randomUUID(),
            ...data,
        });
        revalidatePath("/budgets");
        revalidatePath("/");
        revalidatePath("/analytics");
        return { success: true };
    } catch (error) {
        console.error("Failed to add budget:", error);
        return { success: false, error: "Failed to add budget" };
    }
}

export async function deleteBudget(id: string) {
    try {
        await db.delete(budgets).where(eq(budgets.id, id));
        revalidatePath("/budgets");
        revalidatePath("/");
        revalidatePath("/analytics");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete budget:", error);
        return { success: false, error: "Failed to delete budget" };
    }
}

export async function getBudgetStats() {
    try {
        // Fetch specific fields separately to avoid ambiguous queries
        const budgetData = await db.select().from(budgets);
        const transactionData = await db
            .select({
                category: transactions.category,
                amount: transactions.amount,
                type: transactions.type
            })
            .from(transactions);

        // Aggregate spending by category in memory (sqlite local text comparison is fine here)
        const categoriesMap = new Map<string, number>();

        transactionData.filter(t => t.type === 'expense').forEach(t => {
            const current = categoriesMap.get(t.category) || 0;
            categoriesMap.set(t.category, current + t.amount);
        });

        const budgetStats = budgetData.map(budget => {
            const spent = categoriesMap.get(budget.category) || 0;
            return {
                ...budget,
                spent,
                total: budget.amount,
                remaining: budget.amount - spent,
                percentage: Math.min((spent / budget.amount) * 100, 100)
            };
        });

        return { success: true, data: budgetStats };
    } catch (error) {
        console.error("Failed to fetch budget stats:", error);
        return { success: false, error: "Failed to fetch budget stats" };
    }
}
