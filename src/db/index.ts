import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Configure for serverless (Vercel)
const queryClient = postgres(process.env.DATABASE_URL!, {
    prepare: false, // CRITICAL: Supabase transaction pooler requires this
    idle_timeout: 20,
    max_lifetime: 60 * 30, // 30 minutes max connection lifetime
});

export const db = drizzle(queryClient, { schema });
