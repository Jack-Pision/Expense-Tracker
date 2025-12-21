"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Calendar, FileText, Camera, Check } from "lucide-react";
import { Button } from "../ui/Button";
import { addTransaction, editTransaction } from "@/actions/transactions";

import {
    ShoppingBag,
    Utensils,
    Car,
    Home,
    Film,
    Heart,
    Plane,
    MoreHorizontal,
} from "lucide-react";

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: TransactionFormData) => void;
    initialData?: {
        id: string;
        amount: number;
        type: "income" | "expense";
        category: string;
        description: string;
        date: string;
        notes?: string;
    } | null;
}

export interface TransactionFormData {
    amount: number;
    type: "income" | "expense";
    category: string;
    description: string;
    date: string;
    notes?: string;
}

const categories = [
    { id: "food", name: "Food", icon: Utensils, color: "bg-orange-50 text-orange-600 border-orange-100" },
    { id: "shopping", name: "Shopping", icon: ShoppingBag, color: "bg-pink-50 text-pink-600 border-pink-100" },
    { id: "transport", name: "Transport", icon: Car, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { id: "bills", name: "Bills", icon: Home, color: "bg-purple-50 text-purple-600 border-purple-100" },
    { id: "entertainment", name: "Entertainment", icon: Film, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { id: "health", name: "Health", icon: Heart, color: "bg-red-50 text-red-600 border-red-100" },
    { id: "travel", name: "Travel", icon: Plane, color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
    { id: "other", name: "Other", icon: MoreHorizontal, color: "bg-slate-50 text-text-secondary border-slate-100" },
];

// ... imports will be handled in a separate chunk or manually fixed if needed. For now replacing the component logic.

export function AddTransactionModal({ isOpen, onClose, onSubmit, initialData }: AddTransactionModalProps) {
    const [step, setStep] = useState(1);

    // Initial state based on initialData or defaults
    const [formData, setFormData] = useState<TransactionFormData>(() => ({
        amount: initialData?.amount || 0,
        type: initialData?.type || "expense",
        category: initialData?.category || "",
        description: initialData?.description || "",
        date: initialData?.date || new Date().toISOString().split("T")[0],
    }));

    const [amountInput, setAmountInput] = useState(initialData?.amount?.toString() || "");

    // Sync state when initialData changes or modal re-opens with different data
    const [prevInitialDataId, setPrevInitialDataId] = useState(initialData?.id);
    if (initialData?.id !== prevInitialDataId) {
        setPrevInitialDataId(initialData?.id);
        const newData = initialData || {
            amount: 0,
            type: "expense",
            category: "",
            description: "",
            date: new Date().toISOString().split("T")[0],
            notes: undefined
        };
        // We use a safe cast or ensure newData matches the shape
        setFormData({
            amount: newData.amount,
            type: newData.type,
            category: newData.category,
            description: newData.description,
            date: newData.date,
            notes: newData.notes
        });
        setAmountInput(newData.amount ? newData.amount.toString() : "");
        setStep(1);
    }

    // Also reset if modal opens and initialData is null (adding new) but formData is stale
    // (This is a bit tricky with the sync pattern above, typically useEffect is safer but avoiding it for sync steps)
    // Let's assume the parent controls `initialData` correctly.

    const handleAmountChange = (value: string) => {
        // Allow only numbers and decimal point
        const cleaned = value.replace(/[^0-9.]/g, "");
        setAmountInput(cleaned);
        setFormData({ ...formData, amount: parseFloat(cleaned) || 0 });
    };

    const handleCategorySelect = (categoryId: string) => {
        setFormData({ ...formData, category: categoryId });
        setStep(3);
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            let result;
            if (initialData?.id) {
                // Edit existing transaction
                // Note: amount is positive in form, backend expects raw value? 
                // Wait, addTransaction logic below does logic:
                // amount: formData.type === "expense" ? -Math.abs(formData.amount) : Math.abs(formData.amount)
                // We should match that logic for edit too.
                const amountVal = formData.type === "expense" ? -Math.abs(formData.amount) : Math.abs(formData.amount);

                result = await editTransaction(initialData.id, {
                    ...formData,
                    amount: amountVal,
                });
            } else {
                // Create new transaction
                result = await addTransaction({
                    ...formData,
                    amount: formData.type === "expense" ? -Math.abs(formData.amount) : Math.abs(formData.amount),
                });
            }

            if (result.success) {
                if (onSubmit) {
                    onSubmit(formData);
                }
                resetAndClose();
            } else {
                console.error(result.error);
                // In a real app, show error toast
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetAndClose = () => {
        onClose();
        // Only reset default state if we were adding a new one, OR we expect the parent to clear initialData
        // We will reset to empty here to be safe.
        // Wait, if we are in edit mode, we shouldn't wipe clear immediately if the modal animates out.
        // But for this simple implementation:
        setTimeout(() => {
            setStep(1);
            setAmountInput("");
            setFormData({
                amount: 0,
                type: "expense",
                category: "",
                description: "",
                date: new Date().toISOString().split("T")[0],
            });
        }, 300); // Wait for exit animation
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-end md:items-center justify-center sm:p-4 bg-slate-900/50 backdrop-blur-sm"
                    onClick={resetAndClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full h-[95vh] md:h-auto md:max-w-lg bg-surface md:rounded-xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-text-primary">
                                {initialData ? "Edit Transaction" : (formData.type === "income" ? "Add Income" : "Add Expense")}
                            </h2>
                            <button
                                onClick={resetAndClose}
                                className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Step Indicator */}
                        <div className="flex items-center justify-center gap-2 p-4 border-b border-border bg-background/50">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${s === step
                                        ? "w-8 bg-primary-600"
                                        : s < step
                                            ? "w-2 bg-primary-300"
                                            : "w-2 bg-slate-200"
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Step Content */}
                        <div className="p-6 min-h-[300px] flex-1 overflow-y-auto">
                            <AnimatePresence mode="wait">
                                {/* Step 1: Amount & Type */}
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        {/* Type Toggle */}
                                        <div className="flex gap-2 p-1 bg-surface-hover rounded-lg border border-border">
                                            <button
                                                onClick={() => setFormData({ ...formData, type: "expense" })}
                                                className={`flex-1 py-2.5 rounded-md font-medium text-sm transition-all ${formData.type === "expense"
                                                    ? "bg-white text-red-600 shadow-sm"
                                                    : "text-text-secondary hover:text-text-primary"
                                                    }`}
                                            >
                                                Expense
                                            </button>
                                            <button
                                                onClick={() => setFormData({ ...formData, type: "income" })}
                                                className={`flex-1 py-2.5 rounded-md font-medium text-sm transition-all ${formData.type === "income"
                                                    ? "bg-white text-emerald-600 shadow-sm"
                                                    : "text-text-secondary hover:text-text-primary"
                                                    }`}
                                            >
                                                Income
                                            </button>
                                        </div>

                                        {/* Amount Input */}
                                        <div className="text-center space-y-2">
                                            <label className="text-sm text-text-secondary font-medium">Amount</label>
                                            <div className="flex items-center justify-center gap-2">
                                                <DollarSign className="h-10 w-10 text-text-tertiary" />
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={amountInput}
                                                    onChange={(e) => handleAmountChange(e.target.value)}
                                                    placeholder="0.00"
                                                    className="bg-transparent text-5xl font-bold text-text-primary text-center w-full max-w-[200px] outline-none placeholder:text-slate-300"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            fullWidth
                                            size="lg"
                                            onClick={() => setStep(2)}
                                            disabled={!formData.amount || formData.amount <= 0}
                                        >
                                            Continue
                                        </Button>
                                    </motion.div>
                                )}

                                {/* Step 2: Category */}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="text-lg font-semibold text-text-primary text-center">
                                            Select Category
                                        </h3>
                                        <div className="grid grid-cols-4 gap-3">
                                            {categories.map((cat) => {
                                                const Icon = cat.icon;
                                                return (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => handleCategorySelect(cat.id)}
                                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:scale-105 hover:shadow-md ${cat.color}`}
                                                    >
                                                        <Icon className="h-6 w-6" />
                                                        <span className="text-[10px] font-medium">{cat.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            fullWidth
                                            onClick={() => setStep(1)}
                                        >
                                            ← Back
                                        </Button>
                                    </motion.div>
                                )}

                                {/* Step 3: Details */}
                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        {/* Description */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Description
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, description: e.target.value })
                                                }
                                                placeholder="What was this for?"
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                            />
                                        </div>

                                        {/* Date */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, date: e.target.value })
                                                }
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                            />
                                        </div>

                                        {/* Photo Upload Placeholder */}
                                        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary-500 hover:bg-surface-hover transition-colors cursor-pointer group">
                                            <Camera className="h-8 w-8 mx-auto text-text-tertiary group-hover:text-primary-500 mb-2" />
                                            <p className="text-sm text-text-secondary">
                                                Add receipt photo (optional)
                                            </p>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <Button
                                                variant="secondary"
                                                onClick={() => setStep(2)}
                                                className="flex-1"
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                onClick={handleSubmit}
                                                className="flex-1"
                                                leftIcon={<Check className="h-4 w-4" />}
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
