import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { StatCard } from "@/components/dashboard/StatCard";
import { SpendingBreakdown } from "@/components/dashboard/SpendingBreakdown";
import { Button } from "@/components";
import { CreditCard, TrendingUp, Calendar, Repeat, Filter, Download } from "lucide-react";
import { getTransactions, getBalanceStats } from "@/actions/transactions";
import { getBudgets } from "@/actions/budgets";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [{ data: transactions }, { data: stats }, { data: budgets }] = await Promise.all([
    getTransactions(),
    getBalanceStats(),
    getBudgets()
  ]);

  const recentTransactions = transactions?.slice(0, 5) || [];
  const totalIncome = stats?.totalIncome || 0;
  const totalExpenses = stats?.totalExpenses || 0;
  const balance = stats?.totalBalance || 0;

  // Calculate category breakdown from transactions
  const categoriesMap = new Map();
  // Simple color rotation
  const colors = [
    "bg-orange-500", "bg-pink-500", "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-red-500", "bg-cyan-500"
  ];

  transactions?.filter(t => t.type === 'expense').forEach((t) => {
    const current = categoriesMap.get(t.category) || 0;
    categoriesMap.set(t.category, current + t.amount);
  });

  const categories = Array.from(categoriesMap.entries()).map(([name, amount], index) => {
    const budgetItem = budgets?.find(b => b.category === name);
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      amount: amount,
      budget: budgetItem ? budgetItem.amount : 0,
      color: budgetItem?.color || colors[index % colors.length]
    };
  });

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Dashboard
          </h1>
          <p className="text-text-secondary">
            Overview of your financial activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" leftIcon={<Calendar className="h-4 w-4" />}>
            This Month
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Balance Card - Spans 2 columns on large screens, full on mobile/tablet */}
        <BalanceCard
          balance={balance}
          income={totalIncome}
          expenses={totalExpenses}
        />

        {/* Stats Grid */}
        <StatCard
          title="Transactions"
          value={transactions?.length.toString() || "0"}
          change="+12 this week"
          changeType="neutral"
          icon={<CreditCard className="h-5 w-5" />}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Savings Rate"
          value={totalIncome > 0 ? `${((balance / totalIncome) * 100).toFixed(1)}%` : "0%"}
          change="+5.2% vs last month"
          changeType="positive"
          icon={<TrendingUp className="h-5 w-5" />}
          iconColor="text-emerald-600"
        />

        {/* Spending Breakdown */}
        <div className="col-span-full md:col-span-2 lg:col-span-2">
          <SpendingBreakdown categories={categories} />
        </div>

        {/* More Stats */}
        <StatCard
          title="This Month"
          value={totalExpenses}
          isMoney
          change={`${budgets && budgets.length > 0 ? "vs Budget" : "Total Spent"}`}
          changeType="neutral"
          icon={<Calendar className="h-5 w-5" />}
          iconColor="text-purple-600"
        />

        {/* Recent Transactions - Full width */}
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
}
