"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { Card } from "../ui/Card";
import { motion } from "framer-motion";

interface SpendingCategory {
    name: string;
    amount: number;
    budget: number;
    color: string;
}

interface SpendingBreakdownProps {
    categories: SpendingCategory[];
}

export function SpendingBreakdown({ categories }: SpendingBreakdownProps) {
    const { formatMoney } = useCurrency();
    const totalSpent = categories.reduce((sum, cat) => sum + cat.amount, 0);

    return (
        <Card>
            <h3 className="text-lg font-bold text-text-primary mb-6">
                Spending Analysis
            </h3>

            <div className="space-y-5">
                {categories.map((category, index) => {
                    const percentage = category.budget > 0
                        ? Math.min((category.amount / category.budget) * 100, 100)
                        : 0;
                    const isOverBudget = category.amount > category.budget;

                    return (
                        <div key={category.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-text-primary">{category.name}</span>
                                <span className={`text-sm font-medium ${isOverBudget ? "text-red-600" : "text-text-secondary"}`}>
                                    {formatMoney(category.amount)} <span className="text-text-tertiary">/ {formatMoney(category.budget)}</span>
                                </span>
                            </div>

                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{
                                        duration: 0.8,
                                        delay: index * 0.1,
                                        ease: "easeOut"
                                    }}
                                    className={`h-full rounded-full ${isOverBudget
                                        ? "bg-red-500"
                                        : "bg-primary-500"
                                        }`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-secondary">Monthly Total</span>
                    <span className="text-xl font-bold text-text-primary">
                        {formatMoney(totalSpent)}
                    </span>
                </div>
            </div>
        </Card>
    );
}
