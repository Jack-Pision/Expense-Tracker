import { getBudgetStats } from "@/actions/budgets";
import BudgetList from "@/components/budgets/BudgetList";

export const dynamic = "force-dynamic";

export default async function BudgetsPage() {
    const { data: budgetItems } = await getBudgetStats();

    return (
        <BudgetList initialBudgets={budgetItems || []} />
    );
}
