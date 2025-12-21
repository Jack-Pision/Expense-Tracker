"use client";

import { ReactNode, useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Receipt,
    PieChart,
    Target,
    Settings,
    Menu,
    X,
    Plus,
    Wallet,
} from "lucide-react";
import { Button } from "../ui/Button";
import { AddTransactionModal, TransactionFormData } from "../transactions/AddTransactionModal";

// Context for modal control
interface ModalContextType {
    openAddTransaction: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) throw new Error("useModal must be used within AppShell");
    return context;
}

interface AppShellProps {
    children: ReactNode;
}

const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/transactions", icon: Receipt, label: "Transactions" },
    { href: "/analytics", icon: PieChart, label: "Analytics" },
    { href: "/budgets", icon: Target, label: "Budgets" },
    { href: "/settings", icon: Settings, label: "Settings" },
];

export function AppShell({ children }: AppShellProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    const handleAddTransaction = (data: TransactionFormData) => {
        console.log("New transaction:", data);
    };

    const modalContext: ModalContextType = {
        openAddTransaction: () => setAddModalOpen(true),
    };

    return (
        <ModalContext.Provider value={modalContext}>
            <div className="min-h-screen bg-background">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-72 lg:bg-surface lg:border-r lg:border-border">
                    <div className="flex h-20 shrink-0 items-center gap-3 px-6 border-b border-border">
                        <div className="p-2 rounded-lg bg-primary-600">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-text-primary tracking-tight">
                            ExpenseFlow
                        </span>
                    </div>

                    <nav className="flex flex-1 flex-col px-4 py-8">
                        <ul className="flex flex-1 flex-col gap-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`
                                                flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors
                                                ${isActive
                                                    ? "bg-primary-50 text-primary-700"
                                                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                                                }
                                            `}
                                        >
                                            <item.icon className={`h-5 w-5 ${isActive ? "text-primary-600" : "text-text-tertiary"}`} />
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Quick Add Button */}
                        <div className="mt-auto pt-6">
                            <Button fullWidth onClick={() => setAddModalOpen(true)} size="lg">
                                <Plus className="h-5 w-5" />
                                Add Transaction
                            </Button>
                        </div>
                    </nav>
                </aside>

                {/* Mobile Header */}
                <header className="lg:hidden fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
                    <div className="flex h-16 items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary-600">
                                <Wallet className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-text-primary">
                                ExpenseFlow
                            </span>
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </header>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <motion.nav
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed inset-y-0 left-0 w-72 bg-surface h-full shadow-2xl p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="mb-8 flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-primary-600">
                                        <Wallet className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-lg font-bold">ExpenseFlow</span>
                                </div>
                                <ul className="flex flex-col gap-2">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <li key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`
                                                        flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors
                                                        ${isActive
                                                            ? "bg-primary-50 text-primary-700"
                                                            : "text-text-secondary hover:bg-surface-hover"
                                                        }
                                                    `}
                                                >
                                                    <item.icon className="h-5 w-5" />
                                                    {item.label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </motion.nav>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Bottom Tab Bar */}
                <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-surface border-t border-border pb-safe">
                    <ul className="flex items-center justify-around h-16 px-2">
                        {navItems.slice(0, 4).map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`
                                            flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors
                                            ${isActive
                                                ? "text-primary-600"
                                                : "text-text-tertiary hover:text-text-secondary"
                                            }
                                        `}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="text-[10px] font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                        {/* FAB for Add */}
                        <li className="-mt-12">
                            <button
                                onClick={() => setAddModalOpen(true)}
                                className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-colors"
                            >
                                <Plus className="h-6 w-6" />
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* Main Content */}
                <main className="lg:pl-72 pt-16 lg:pt-0 pb-20 lg:pb-0 min-h-screen bg-background">
                    <div className="container-wrapper py-8">{children}</div>
                </main>

                {/* Add Transaction Modal */}
                <AddTransactionModal
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    onSubmit={handleAddTransaction}
                />
            </div>
        </ModalContext.Provider>
    );
}

