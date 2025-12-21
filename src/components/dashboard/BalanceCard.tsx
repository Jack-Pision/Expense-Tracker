"use client";

import { Card } from "../ui/Card";
import { AnimatedCounter } from "../ui/AnimatedCounter";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface BalanceCardProps {
    balance: number;
    income: number;
    expenses: number;
    currency?: string;
}

export function BalanceCard({
    balance,
    income,
    expenses,
    currency = "$",
}: BalanceCardProps) {
    const percentChange = income > 0 ? ((income - expenses) / income) * 100 : 0;
    const isPositive = percentChange >= 0;

    return (
        <Card className="col-span-full lg:col-span-2 shadow-md">
            <div className="flex flex-col items-center text-center space-y-6 py-4">
                <div className="flex items-center gap-2 text-text-secondary">
                    <Wallet className="h-5 w-5 text-primary-600" />
                    <span className="text-sm font-bold uppercase tracking-wider">Total Balance</span>
                </div>

                <div className="text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary">
                    <AnimatedCounter value={balance} prefix={currency} />
                </div>

                <div
                    className={`flex items-center gap-1 text-sm font-bold px-4 py-1.5 rounded-full border ${isPositive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                        }`}
                >
                    {isPositive ? (
                        <TrendingUp className="h-4 w-4" />
                    ) : (
                        <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{isPositive ? "+" : ""}{percentChange.toFixed(1)}% vs last month</span>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
                {/* Income */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                        <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-text-tertiary font-bold uppercase tracking-wider">Income</p>
                        <p className="text-lg font-bold text-text-primary">
                            <AnimatedCounter value={income} prefix={currency} />
                        </p>
                    </div>
                </div>

                {/* Expenses */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="p-2 rounded-lg bg-red-100 text-red-600">
                        <ArrowDownRight className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-text-tertiary font-bold uppercase tracking-wider">Expenses</p>
                        <p className="text-lg font-bold text-text-primary">
                            <AnimatedCounter value={expenses} prefix={currency} />
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
