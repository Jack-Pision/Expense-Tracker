"use client";

import { Card } from "../ui/Card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon: React.ReactNode;
    iconColor?: string;
}

export function StatCard({
    title,
    value,
    change,
    changeType = "neutral",
    icon,
    iconColor = "text-primary-600",
}: StatCardProps) {
    const changeColors = {
        positive: "text-emerald-600",
        negative: "text-red-600",
        neutral: "text-text-tertiary",
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-text-primary tracking-tight">{value}</p>
                    {change && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${changeColors[changeType]}`}>
                            {changeType === "positive" ? <ArrowUpRight className="h-3 w-3" /> : changeType === "negative" ? <ArrowDownRight className="h-3 w-3" /> : null}
                            {change}
                        </div>
                    )}
                </div>
                <div className={`p-2.5 rounded-lg bg-primary-50 ${iconColor}`}>
                    {icon}
                </div>
            </div>
        </Card>
    );
}
