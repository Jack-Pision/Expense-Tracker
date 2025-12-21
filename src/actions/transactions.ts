"use server";

import { db } from "@/db";
import { transactions, type NewTransaction } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { desc, eq, sql } from "drizzle-orm";

export async function getTransactions() {
    try {
        const data = await db.select().from(transactions).orderBy(desc(transactions.date));
        return { success: true, data };
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        return { success: false, error: "Failed to fetch transactions" };
    }
}

export async function addTransaction(data: Omit<NewTransaction, "id" | "createdAt">) {
    try {
        await db.insert(transactions).values({
            id: crypto.randomUUID(),
            ...data,
        });
        revalidatePath("/transactions");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to add transaction:", error);
        return { success: false, error: "Failed to add transaction" };
    }
}

export async function deleteTransaction(id: string) {
    try {
        await db.delete(transactions).where(eq(transactions.id, id));
        revalidatePath("/transactions");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete transaction:", error);
        return { success: false, error: "Failed to delete transaction" };
    }
}

export async function editTransaction(id: string, data: Partial<Omit<NewTransaction, "id" | "createdAt">>) {
    try {
        await db.update(transactions)
            .set(data)
            .where(eq(transactions.id, id));
        revalidatePath("/transactions");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to edit transaction:", error);
        return { success: false, error: "Failed to edit transaction" };
    }
}

export async function getBalanceStats() {
    try {
        const allTx = await db.select().from(transactions);

        const income = allTx
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = allTx
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

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
