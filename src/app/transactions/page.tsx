import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    Search,
    Filter,
    Download
} from "lucide-react";
import { getTransactions } from "@/actions/transactions";
import { TransactionList } from "@/components/transactions/TransactionList";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
    const { data: transactions } = await getTransactions();
    const filteredTransactions = transactions || [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">Transactions</h1>
                    <p className="text-text-secondary mt-1">Manage and view your financial activity</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
                        Export
                    </Button>
                    <Button leftIcon={<Filter className="h-4 w-4" />}>
                        Filter
                    </Button>
                </div>
            </div>

            {/* Search & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-4 py-3 text-text-primary outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                    </div>
                </Card>
            </div>

            {/* Transactions List */}
            <TransactionList transactions={filteredTransactions} />
        </div>
    );
}
