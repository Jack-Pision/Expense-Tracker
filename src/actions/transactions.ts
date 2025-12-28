"use server";

import { db } from "@/db";
import { transactions, type NewTransaction } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { desc, eq, and } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";

async function getAuthUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getTransactions() {
    try {
        const user = await getAuthUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const data = await db.select()
            .from(transactions)
            .where(eq(transactions.userId, user.id))
            .orderBy(desc(transactions.date));

        // Convert numeric strings back to numbers if needed
        const formattedData = data.map(tx => ({
            ...tx,
            amount: Number(tx.amount)
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        return { success: false, error: "Failed to fetch transactions" };
    }
}

export async function addTransaction(data: Omit<NewTransaction, "id" | "userId" | "createdAt" | "amount"> & { amount: number }) {
    try {
        const user = await getAuthUser();
        if (!user) return { success: false, error: "Unauthorized" };

        // Only include fields that exist in the schema
        const transactionData = {
            userId: user.id,
            description: data.description,
            amount: data.amount.toString(),
            date: data.date,
            category: data.category,
            type: data.type,
        };

        const result = await db.insert(transactions).values(transactionData);

        revalidatePath("/transactions");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to add transaction:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to add transaction" };
    }
}

export async function deleteTransaction(id: string) {
    try {
        const user = await getAuthUser();
        if (!user) return { success: false, error: "Unauthorized" };

        await db.delete(transactions).where(
            and(
                eq(transactions.id, id),
                eq(transactions.userId, user.id)
            )
        );

        revalidatePath("/transactions");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete transaction:", error);
        return { success: false, error: "Failed to delete transaction" };
    }
}

export async function editTransaction(id: string, data: Partial<Omit<NewTransaction, "id" | "userId" | "createdAt" | "amount">> & { amount?: number }) {
    try {
        const user = await getAuthUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const updateData: any = {};
        if (data.description !== undefined) updateData.description = data.description;
        if (data.amount !== undefined) updateData.amount = data.amount.toString();
        if (data.date !== undefined) updateData.date = data.date;
        if (data.category !== undefined) updateData.category = data.category;
        if (data.type !== undefined) updateData.type = data.type;

        await db.update(transactions)
            .set(updateData)
            .where(
                and(
                    eq(transactions.id, id),
                    eq(transactions.userId, user.id)
                )
            );

        revalidatePath("/transactions");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to edit transaction:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to edit transaction" };
    }
}

export async function getBalanceStats() {
    try {
        const user = await getAuthUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const allTx = await db.select().from(transactions).where(eq(transactions.userId, user.id));

        const income = allTx
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expenses = allTx
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amount), 0);

        return {
            success: true,
            data: {
                totalBalance: income - expenses,
                totalIncome: income,
                totalExpenses: expenses,
            },
        };
    } catch (error) {
        return { success: false, error: "Failed to fetch stats" };
    }
}
