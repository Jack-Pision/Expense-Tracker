import { Card } from "@/components/ui/Card";

export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
                    <div className="h-4 w-64 bg-slate-200 rounded-lg"></div>
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-24 bg-slate-200 rounded-lg"></div>
                    <div className="h-10 w-24 bg-slate-200 rounded-lg"></div>
                </div>
            </div>

            {/* Search Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-3">
                    <div className="h-12 bg-slate-200 rounded-lg"></div>
                </Card>
            </div>

            {/* Table Skeleton */}
            <Card>
                <div className="space-y-4">
                    {/* Table Header */}
                    <div className="flex justify-between border-b border-slate-100 pb-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-4 w-24 bg-slate-200 rounded"></div>
                        ))}
                    </div>
                    {/* Rows */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex justify-between py-4 border-b border-slate-50 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
                                <div className="h-4 w-48 bg-slate-200 rounded"></div>
                            </div>
                            <div className="h-4 w-24 bg-slate-200 rounded hidden md:block"></div>
                            <div className="h-4 w-24 bg-slate-200 rounded hidden md:block"></div>
                            <div className="h-4 w-20 bg-slate-200 rounded hidden md:block"></div>
                            <div className="h-4 w-24 bg-slate-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
