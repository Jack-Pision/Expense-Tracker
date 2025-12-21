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

# 3. Database Connection String
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
