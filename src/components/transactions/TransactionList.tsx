"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AddTransactionModal, TransactionFormData } from "./AddTransactionModal";
import { deleteTransaction } from "@/actions/transactions";
import {
    MoreHorizontal,
    Utensils,
    ShoppingBag,
    Car,
    Home,
    Film,
    Heart,
    Plane,
    ArrowUpRight,
    Edit2,
    Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
    id: string;
    amount: number;
    type: string;
    category: string;
    description: string;
    date: string;
    // ... other fields
}

interface TransactionListProps {
    transactions: Transaction[];
}

const categoryIcons: any = {
    food: Utensils,
    shopping: ShoppingBag,
    transport: Car,
    bills: Home,
    entertainment: Film,
    health: Heart,
    travel: Plane,
    work: ArrowUpRight,
    other: MoreHorizontal,
};

const categoryColors: any = {
    food: "bg-orange-50 text-orange-600",
    shopping: "bg-pink-50 text-pink-600",
    transport: "bg-blue-50 text-blue-600",
    bills: "bg-purple-50 text-purple-600",
    entertainment: "bg-emerald-50 text-emerald-600",
    health: "bg-red-50 text-red-600",
    travel: "bg-cyan-50 text-cyan-600",
    work: "bg-emerald-50 text-emerald-600",
    other: "bg-slate-50 text-slate-600",
};

export function TransactionList({ transactions }: TransactionListProps) {
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this transaction?")) {
            await deleteTransaction(id);
            setOpenMenuId(null);
        }
    };

    const handleEdit = (tx: Transaction) => {
        setEditingTransaction(tx);
        setOpenMenuId(null);
    };

    // Cast specific string type to union for modal
    const getInitialDataForModal = (tx: Transaction) => ({
        ...tx,
        type: tx.type as "income" | "expense",
    });

    return (
        <>
            <Card>
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border text-xs uppercase tracking-wider text-text-secondary font-semibold">
                                <th className="p-4">Transaction</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Amount</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {transactions.map((tx) => {
                                const Icon = categoryIcons[tx.category] || MoreHorizontal;
                                const isIncome = tx.amount > 0;

                                return (
                                    <tr key={tx.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${categoryColors[tx.category] || "bg-slate-100 text-slate-600"}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <span className="font-medium text-text-primary">{tx.description}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-text-secondary capitalize">{tx.category}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-text-secondary">{tx.date}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800`}>
                                                Completed
                                            </span>
                                        </td>
                                        <td className={`p-4 text-right font-bold ${isIncome ? "text-emerald-600" : "text-text-primary"}`}>
                                            {isIncome ? "+" : ""}{tx.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                        </td>
                                        <td className="p-4 relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === tx.id ? null : tx.id)}
                                                className="p-2 text-text-tertiary hover:text-text-primary rounded-full hover:bg-slate-200 transition-colors"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            <AnimatePresence>
                                                {openMenuId === tx.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                        className="absolute right-0 top-12 w-32 bg-white rounded-lg shadow-xl border border-border z-50 overflow-hidden"
                                                    >
                                                        <button
                                                            onClick={() => handleEdit(tx)}
                                                            className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-slate-50 flex items-center gap-2"
                                                        >
                                                            <Edit2 className="h-4 w-4" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(tx.id)}
                                                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                        >
                                                            <Trash2 className="h-4 w-4" /> Delete
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Click outside listener could go here, but for simplicity relying on toggle */}
                                            {openMenuId === tx.id && (
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setOpenMenuId(null)}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-text-secondary">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <AddTransactionModal
                isOpen={!!editingTransaction}
                onClose={() => setEditingTransaction(null)}
                initialData={editingTransaction ? getInitialDataForModal(editingTransaction) : null}
            />
        </>
    );
}
