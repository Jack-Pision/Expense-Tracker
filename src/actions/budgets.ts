"use server";

import { db } from "@/db";
import { budgets, transactions, NewBudget } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";

async function getAuthUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getBudgets() {
    try {
        const user = await getAuthUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const allBudgets = await db.select().from(budgets).where(eq(budgets.userId, user.id));
        const formattedBudgets = allBudgets.map(b => ({ ...b, amount: Number(b.amount) }));

        return { success: true, data: formattedBudgets };
    } catch (error) {
        console.error("Failed to fetch budgets:", error);
        return { success: false, error: "Failed to fetch budgets" };
    }
}

export async function addBudget(data: Omit<NewBudget, "id" | "userId" | "createdAt" | "amount"> & { amount: number }) {
    try {
        const user = await getAuthUser();
        if (!user) return { success: false, error: "Unauthorized" };

        await db.insert(budgets).values({
            userId: user.id,
            ...data,
            amount: data.amount.toString(),
        } as any);

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
        const user = await getAuthUser();
        if (!user) return { success: false, error: "Unauthorized" };

        await db.delete(budgets).where(
            and(
                eq(budgets.id, id),
                eq(budgets.userId, user.id)
            )
        );

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
        const user = await getAuthUser();
        if (!user) return { success: false, error: "Unauthorized" };

        // Fetch specific fields separately to avoid ambiguous queries
        const budgetData = await db.select().from(budgets).where(eq(budgets.userId, user.id));
        const transactionData = await db
            .select({
                category: transactions.category,
                amount: transactions.amount,
                type: transactions.type
            })
            .from(transactions)
            .where(eq(transactions.userId, user.id));

        // Aggregate spending by category in memory
        const categoriesMap = new Map<string, number>();

        transactionData.filter(t => t.type === 'expense').forEach(t => {
            const current = categoriesMap.get(t.category) || 0;
            categoriesMap.set(t.category, current + Number(t.amount));
        });

        const budgetStats = budgetData.map(budget => {
            const spent = categoriesMap.get(budget.category) || 0;
            const amount = Number(budget.amount);
            return {
                ...budget,
                amount: amount,
                spent,
                total: amount,
                remaining: amount - spent,
                percentage: Math.min((spent / amount) * 100, 100)
            };
        });

        return { success: true, data: budgetStats };
    } catch (error) {
        console.error("Failed to fetch budget stats:", error);
        return { success: false, error: "Failed to fetch budget stats" };
    }
}
