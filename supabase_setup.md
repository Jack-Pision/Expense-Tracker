# supabase_setup.md

To get the application running with Supabase, please follow these steps:

### 1. Create a Supabase Project
If you haven't already, go to [supabase.com](https://supabase.com) and create a new project.

### 2. Configure Environment Variables
Create a file named `.env.local` in the root of your project and add the following keys. You can find these in your Supabase Dashboard under **Project Settings**:

```bash
# 1. API Settings -> Project URL
# FORMAT: https://[project-id].supabase.co
# (You have this correct in the 2nd field of your screenshot!)
NEXT_PUBLIC_SUPABASE_URL=https://xmsjzfskhkhckrftscy.supabase.co

# 2. API Settings -> anon public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 3. API Settings -> service_role key (CRITICAL for server-side database operations)
# This bypasses RLS - only use in server-side code!
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 4. Database Connection String (optional, for Drizzle migrations only)
# Since your project ID is: xmsjzfskhkhckrftscy
# COPY THIS EXACTLY (replace [YOUR-PASSWORD] with yours):
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xmsjzfskhkhckrftscy.supabase.co:5432/postgres
```

### 3. Setup the Database
Once you have added the `DATABASE_URL` to your `.env.local`, run the following command to push the schema to Supabase:

```bash
npx drizzle-kit push
```

### 4. Enable Authentication
In the Supabase Dashboard, go to **Authentication -> Providers** and ensure "Email" is enabled. You can also disable "Confirm Email" for faster testing during development.

### 5. Vercel Deployment (Production)
Yes, adding the environment variables in Vercel is the primary step! 

1.  **Vercel Dashboard**: Go to **Settings -> Environment Variables** and add all three keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL`).
2.  **Supabase Auth Redirects**: (CRITICAL) In the Supabase Dashboard, go to **Authentication -> URL Configuration**.
    *   **Site URL**: Set this to your Vercel URL (e.g., `https://your-app.vercel.app`).
    *   **Redirect URLs**: Add `https://your-app.vercel.app/**` to allow redirects back to your site after login.

### 6. Disable Email Verification (CRITICAL FIX)
To allow users to login immediately without clicking an email link:

1.  Go to your **Supabase Dashboard**.
2.  In the left sidebar, click **Authentication** (the people icon).
3.  Under **Configuration**, click **Providers**.
4.  Click on **Email** to expand the settings.
5.  **Toggle OFF** the switch that says **"Confirm email"**.
6.  Click **Save**.

Once this is disabled, new clean signups will be logged in instantly!

### 7. Initialize Database (FINAL FIX)
If you see "Could not find the table" or "Failed query", your database tables haven't been created yet.

**Run this FULL script in the Supabase SQL Editor:**

```sql
-- 1. Create Tables
CREATE TABLE IF NOT EXISTS "budgets" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "category" text NOT NULL,
        "amount" numeric(12, 2) NOT NULL,
        "period" text DEFAULT 'monthly',
        "color" text DEFAULT 'bg-blue-500',
        "created_at" timestamp DEFAULT now()
);

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

-- 2. Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
CREATE POLICY "Allow individual insert" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow individual select" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual update" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow individual delete" ON transactions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow individual insert" ON budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow individual select" ON budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual update" ON budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow individual delete" ON budgets FOR DELETE USING (auth.uid() = user_id);
```

> [!NOTE]
> After running this, if it still fails, click the **"Reload Schema"** button in **Table Editor** settings to refresh the cache!
