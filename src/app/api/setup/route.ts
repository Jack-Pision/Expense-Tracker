
import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const supabase = createAdminClient();

        console.log("Starting database setup...");

        // 1. Create Tables
        const createBudgets = `
            CREATE TABLE IF NOT EXISTS "budgets" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                "user_id" uuid NOT NULL,
                "category" text NOT NULL,
                "amount" numeric(12, 2) NOT NULL,
                "period" text DEFAULT 'monthly',
                "color" text DEFAULT 'bg-blue-500',
                "created_at" timestamp DEFAULT now()
            );
        `;

        const createTransactions = `
            CREATE TABLE IF NOT EXISTS "transactions" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                "user_id" uuid NOT NULL,
                "description" text NOT NULL,
                "amount" numeric(12, 2) NOT NULL,
                "date" text NOT NULL,
                "category" text NOT NULL,
                "type" text NOT NULL,
                "created_at" timestamp DEFAULT now()
            );
        `;

        // 2. Enable RLS
        const enableRLS = `
            ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
            ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
        `;

        // 3. Create Policies (ignore errors if they exist)
        const createPolicies = `
            DO $$ 
            BEGIN
                -- Init Policies
                BEGIN CREATE POLICY "Allow individual insert" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END;
                BEGIN CREATE POLICY "Allow individual select" ON transactions FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END;
                BEGIN CREATE POLICY "Allow individual update" ON transactions FOR UPDATE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END;
                BEGIN CREATE POLICY "Allow individual delete" ON transactions FOR DELETE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END;

                BEGIN CREATE POLICY "Allow individual insert" ON budgets FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END;
                BEGIN CREATE POLICY "Allow individual select" ON budgets FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END;
                BEGIN CREATE POLICY "Allow individual update" ON budgets FOR UPDATE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END;
                BEGIN CREATE POLICY "Allow individual delete" ON budgets FOR DELETE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END;
            END $$;
        `;

        // Execute raw SQL via RPC if available, or fallback to postgres-js via admin?
        // Supabase JS client doesn't explicitly support raw query execution without a function.
        // BUT, we can use the `rpc` method if we create a function first? No, chicken and egg.
        // Wait, the Admin client uses the Service Role key.
        // If we can't run raw SQL, we must rely on postgres-js.

        // Let's check environment for DATABASE_URL for postgres-js usage
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({ error: "DATABASE_URL is missing" }, { status: 500 });
        }

        const postgres = require('postgres');
        const sql = postgres(process.env.DATABASE_URL, { prepare: false });

        await sql.unsafe(createBudgets);
        await sql.unsafe(createTransactions);
        await sql.unsafe(enableRLS);
        await sql.unsafe(createPolicies);

        return NextResponse.json({
            success: true,
            message: "Database tables and policies created successfully!"
        });

    } catch (error: any) {
        console.error("Setup failed:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
