"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Tag, Palette, Check } from "lucide-react";
import { Button } from "../ui/Button";
import { addBudget } from "@/actions/budgets";

interface AddBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES = [
    { id: "food", name: "Food & Dining", color: "bg-orange-500" },
    { id: "transport", name: "Transportation", color: "bg-blue-500" },
    { id: "shopping", name: "Shopping", color: "bg-pink-500" },
    { id: "bills", name: "Bills & Utilities", color: "bg-purple-500" },
    { id: "entertainment", name: "Entertainment", color: "bg-emerald-500" },
    { id: "health", name: "Health & Wellness", color: "bg-red-500" },
    { id: "travel", name: "Travel", color: "bg-cyan-500" },
    { id: "other", name: "Other", color: "bg-slate-500" },
];

export function AddBudgetModal({ isOpen, onClose }: AddBudgetModalProps) {
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await addBudget({
            category: selectedCategory.id,
            amount: parseFloat(amount),
            color: selectedCategory.color,
            period: "monthly",
        });

        setIsSubmitting(false);

        if (result.success) {
            setAmount("");
            onClose();
        } else {
            alert("Failed to create budget");
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800">New Budget</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Amount Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 block">
                                Budget Limit
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    min="0.01"
                                    step="0.01"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 block">
                                Category
                            </label>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${selectedCategory.id === cat.id
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-slate-200 hover:border-slate-300 text-slate-600"
                                            }`}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                                        <span className="text-sm font-medium">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button fullWidth type="submit" size="lg" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Budget"}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
