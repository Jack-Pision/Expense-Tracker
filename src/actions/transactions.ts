"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// Transaction type for the app
interface TransactionData {
    description: string;
    amount: number;
    date: string;
    category: string;
    type: "income" | "expense";
}

export async function getTransactions() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false });

        if (error) throw error;

        // Map to expected format
        const formattedData = (data || []).map(tx => ({
            id: tx.id,
            userId: tx.user_id,
            description: tx.description,
            amount: Number(tx.amount),
            date: tx.date,
            category: tx.category,
            type: tx.type,
            createdAt: tx.created_at,
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        return { success: false, error: "Failed to fetch transactions" };
    }
}

export async function addTransaction(data: TransactionData) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const { error } = await supabase
            .from("transactions")
            .insert({
                user_id: user.id,
                description: data.description,
                amount: data.amount,
                date: data.date,
                category: data.category,
                type: data.type,
            });

        if (error) throw error;

        revalidatePath("/transactions");
        revalidatePath("/");
        revalidatePath("/analytics");
        return { success: true };
    } catch (error) {
        console.error("Failed to add transaction:", error);
        const errorMsg = error instanceof Error ? error.message : "Failed to add transaction";
        return { success: false, error: errorMsg };
    }
}

export async function deleteTransaction(id: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const { error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw error;

        revalidatePath("/transactions");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete transaction:", error);
        return { success: false, error: "Failed to delete transaction" };
    }
}

export async function editTransaction(id: string, data: Partial<TransactionData>) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const updateData: Record<string, any> = {};
        if (data.description !== undefined) updateData.description = data.description;
        if (data.amount !== undefined) updateData.amount = data.amount;
        if (data.date !== undefined) updateData.date = data.date;
        if (data.category !== undefined) updateData.category = data.category;
        if (data.type !== undefined) updateData.type = data.type;

        const { error } = await supabase
            .from("transactions")
            .update(updateData)
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw error;

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
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const { data, error } = await supabase
            .from("transactions")
            .select("amount, type")
            .eq("user_id", user.id);

        if (error) throw error;

        const allTx = data || [];
        const income = allTx
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expenses = allTx
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

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

