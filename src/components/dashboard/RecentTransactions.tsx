"use client";

import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import {
    ShoppingBag,
    Utensils,
    Car,
    Home,
    Zap,
    Film,
    Heart,
    Plane,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

export type TransactionCategory =
    | "shopping"
    | "food"
    | "transport"
    | "bills"
    | "entertainment"
    | "health"
    | "travel"
    | "other";

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: "income" | "expense";
    category: TransactionCategory;
    date: string;
    time: string;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    shopping: ShoppingBag,
    food: Utensils,
    transport: Car,
    bills: Home,
    entertainment: Film,
    health: Heart,
    travel: Plane,
    other: MoreHorizontal,
};

const categoryColors: Record<string, string> = {
    shopping: "bg-pink-50 text-pink-600 border-pink-100",
    food: "bg-orange-50 text-orange-600 border-orange-100",
    transport: "bg-blue-50 text-blue-600 border-blue-100",
    bills: "bg-purple-50 text-purple-600 border-purple-100",
    entertainment: "bg-emerald-50 text-emerald-600 border-emerald-100",
    health: "bg-red-50 text-red-600 border-red-100",
    travel: "bg-cyan-50 text-cyan-600 border-cyan-100",
    other: "bg-slate-50 text-text-secondary border-slate-100",
};


interface RecentTransactionsProps {
    transactions: any[]; // Relaxing type for now to avoid conflicts
    title?: string;
}

import { useCurrency } from "@/context/CurrencyContext";

// ... existing imports

export function RecentTransactions({
    transactions,
    title = "Recent Transactions",
}: RecentTransactionsProps) {
    const { formatMoney } = useCurrency();

    return (
        <Card className="col-span-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-text-primary tracking-tight">{title}</h3>
                <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                    View All Activity
                </Button>
            </div>

            <div className="space-y-1">
                {transactions.length === 0 ? (
                    <div className="text-center py-12 text-text-tertiary">
                        No transactions found.
                    </div>
                ) : (
                    transactions.map((tx, index) => {
                        const Icon = categoryIcons[tx.category];
                        const isIncome = tx.type === "income";

                        return (
                            <motion.div
                                key={tx.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer group"
                            >
                                {/* Category Icon */}
                                <div className={`p-2.5 rounded-xl border ${categoryColors[tx.category]}`}>
                                    <Icon className="h-5 w-5" />
                                </div>

                                {/* Description & Time */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-text-primary truncate group-hover:text-primary-600 transition-colors">
                                        {tx.description}
                                    </p>
                                    <p className="text-xs font-medium text-text-tertiary mt-0.5">
                                        {tx.date} {tx.time ? `• ${tx.time}` : ""}
                                    </p>
                                </div>

                                {/* Amount */}
                                <div
                                    className={`flex flex-col items-end gap-0.5 font-bold ${isIncome ? "text-emerald-600" : "text-text-primary"
                                        }`}
                                >
                                    <div className="flex items-center gap-1">
                                        {isIncome ? (
                                            <ArrowUpRight className="h-4 w-4" />
                                        ) : (
                                            <ArrowDownRight className="h-4 w-4 text-text-tertiary" />
                                        )}
                                        <span className="text-base">
                                            {isIncome ? "+" : ""}{formatMoney(Math.abs(tx.amount))}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-text-tertiary uppercase tracking-widest">
                                        {isIncome ? "Received" : "Spent"}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </Card>
    );
}
