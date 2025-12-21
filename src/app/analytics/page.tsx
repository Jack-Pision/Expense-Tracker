import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    ChevronDown,
    PieChart,
    BarChart2,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Download
} from "lucide-react";
import { getBalanceStats } from "@/actions/transactions";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
    const { data: stats } = await getBalanceStats();

    const balance = stats?.totalBalance || 0;
    const totalIncome = stats?.totalIncome || 0;
    const totalExpenses = stats?.totalExpenses || 0;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">Analytics</h1>
                    <p className="text-text-secondary mt-1">Deep dive into your financial habits</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" rightIcon={<ChevronDown className="h-4 w-4" />} className="bg-white">
                        Last 30 Days
                    </Button>
                    <Button leftIcon={<Download className="h-4 w-4" />}>
                        Download Report
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Net Worth</p>
                            <p className="text-2xl font-bold text-text-primary">
                                {balance.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <ArrowUpRight className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Total Income</p>
                            <p className="text-2xl font-bold text-text-primary">
                                {totalIncome.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                            <ArrowDownRight className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Total Expenses</p>
                            <p className="text-2xl font-bold text-text-primary">
                                {totalExpenses.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                    <div className="p-4 bg-slate-50 rounded-full mb-4">
                        <BarChart2 className="h-8 w-8 text-primary-500" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">Spending Activity</h3>
                    <p className="text-text-secondary max-w-sm mt-2">
                        Chart visualization will be implemented here using Recharts or similar library.
                    </p>
                </Card>

                <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                    <div className="p-4 bg-slate-50 rounded-full mb-4">
                        <PieChart className="h-8 w-8 text-primary-500" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">Expense Categories</h3>
                    <p className="text-text-secondary max-w-sm mt-2">
                        Donut chart visualization showing category breakdown will go here.
                    </p>
                </Card>
            </div>
        </div>
    );
}
