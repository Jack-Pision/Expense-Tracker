"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

interface BudgetData {
    category: string;
    amount: number;
    period?: string;
    color?: string;
}

export async function getBudgets() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        // Return mock data when Supabase is not configured
        return { success: true, data: [] };
    }

    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const admin = createAdminClient();
        const { data, error } = await admin
            .from("budgets")
            .select("*")
            .eq("user_id", user.id);

        if (error) throw error;

        const formattedBudgets = (data || []).map(b => ({
            id: b.id,
            userId: b.user_id,
            category: b.category,
            amount: Number(b.amount),
            period: b.period,
            color: b.color,
            createdAt: b.created_at,
        }));

        return { success: true, data: formattedBudgets };
    } catch (error) {
        console.error("Failed to fetch budgets:", error);
        return { success: false, error: "Failed to fetch budgets" };
    }
}

export async function addBudget(data: BudgetData) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const admin = createAdminClient();
        const { error } = await admin
            .from("budgets")
            .insert({
                user_id: user.id,
                category: data.category,
                amount: data.amount,
                period: data.period || "monthly",
                color: data.color || "bg-blue-500",
            });

        if (error) {
            console.error("Supabase insert error:", error);
            return { success: false, error: error.message };
        }

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
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const admin = createAdminClient();
        const { error } = await admin
            .from("budgets")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw error;

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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        // Return mock data when Supabase is not configured
        return { success: true, data: [] };
    }

    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const admin = createAdminClient();

        const { data: budgetData, error: budgetError } = await admin
            .from("budgets")
            .select("*")
            .eq("user_id", user.id);

        if (budgetError) throw budgetError;

        const { data: transactionData, error: txError } = await admin
            .from("transactions")
            .select("category, amount, type")
            .eq("user_id", user.id);

        if (txError) throw txError;

        const categoriesMap = new Map<string, number>();
        (transactionData || []).filter(t => t.type === 'expense').forEach(t => {
            const current = categoriesMap.get(t.category) || 0;
            categoriesMap.set(t.category, current + Math.abs(Number(t.amount)));
        });

        const budgetStats = (budgetData || []).map(budget => {
            const spent = categoriesMap.get(budget.category) || 0;
            const amount = Number(budget.amount);
            return {
                id: budget.id,
                userId: budget.user_id,
                category: budget.category,
                amount: amount,
                period: budget.period,
                color: budget.color,
                createdAt: budget.created_at,
                spent,
                total: amount,
                remaining: amount - spent,
                percentage: amount > 0 ? Math.min((spent / amount) * 100, 100) : 0
            };
        });

        return { success: true, data: budgetStats };
    } catch (error) {
        console.error("Failed to fetch budget stats:", error);
        return { success: false, error: "Failed to fetch budget stats" };
    }
}


