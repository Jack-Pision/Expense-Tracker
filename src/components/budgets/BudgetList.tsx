"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, AlertCircle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { deleteBudget } from "@/actions/budgets";
import { AddBudgetModal } from "./AddBudgetModal";

interface BudgetListProps {
    initialBudgets: any[];
}

import { useCurrency } from "@/context/CurrencyContext";

// ... existing imports

export default function BudgetList({ initialBudgets }: BudgetListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { formatMoney } = useCurrency();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">Budgets</h1>
                    <p className="text-text-secondary mt-1">Keep track of your spending limits</p>
                </div>
                <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsModalOpen(true)}>
                    Create Budget
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {initialBudgets.map((item) => {
                    const percentage = Math.min((item.spent / item.total) * 100, 100);
                    const isOver = item.spent > item.total;

                    return (
                        <Card key={item.id} className="relative overflow-hidden group">
                            {isOver && (
                                <div className="absolute top-0 right-0 p-2 bg-red-50 rounded-bl-xl border-b border-l border-red-100 z-10">
                                    <div className="flex items-center gap-1 text-xs font-bold text-red-600 uppercase tracking-widest px-2">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>Over Limit</span>
                                    </div>
                                </div>
                            )}

                            {/* Delete Action - Visible on Hover */}
                            <button
                                onClick={async () => {
                                    if (confirm('Delete this budget?')) await deleteBudget(item.id);
                                }}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>

                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-text-primary capitalize">{item.category}</h3>
                                        <p className="text-sm font-medium text-text-tertiary">
                                            {percentage.toFixed(0)}% used
                                        </p>
                                    </div>
                                    <div className="text-right mt-6 sm:mt-0 pr-8">
                                        <p className="text-xl font-bold text-text-primary">
                                            {formatMoney(item.spent)} <span className="text-base text-text-tertiary font-normal">/ {formatMoney(item.total)}</span>
                                        </p>
                                        <p className={`text-xs font-bold ${isOver ? "text-red-600" : "text-emerald-600"}`}>
                                            {isOver ? `${formatMoney(item.spent - item.total)} over` : `${formatMoney(item.total - item.spent)} remaining`}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full rounded-full ${isOver ? "bg-red-500" : item.color}`}
                                    />
                                </div>
                            </div>
                        </Card>
                    );
                })}

                {/* Create New Placeholder */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary-500 hover:bg-primary-50 transition-all group min-h-[160px]"
                >
                    <div className="p-3 rounded-full bg-slate-100 group-hover:bg-primary-100 transition-colors mb-3">
                        <Plus className="h-6 w-6 text-slate-400 group-hover:text-primary-600" />
                    </div>
                    <span className="font-bold text-text-secondary group-hover:text-primary-700">Add New Category</span>
                </button>
            </div>

            <AddBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
