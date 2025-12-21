"use client";

import { login } from "@/app/auth/actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function LoginForm() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    return (
        <Card className="w-full max-w-md p-8 space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-text-primary">Welcome Back</h1>
                <p className="text-text-tertiary">Sign in to your expense tracker</p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            {message && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg text-sm text-center">
                    {message}
                </div>
            )}

            <form action={login} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary pl-1" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary pl-1" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                </div>
                <Button type="submit" fullWidth className="h-12 text-lg">
                    Sign In
                </Button>
            </form>

            <div className="text-center text-sm text-text-tertiary">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary-600 font-semibold hover:underline">
                    Create account
                </Link>
            </div>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
