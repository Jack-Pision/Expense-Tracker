export default function Loading() {
    return (
        <div className="space-y-10 max-w-[1400px] mx-auto animate-pulse">
            {/* Page Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
                    <div className="h-4 w-64 bg-slate-200 rounded-lg"></div>
                </div>
                <div className="flex gap-2">
                    <div className="h-9 w-32 bg-slate-200 rounded-lg"></div>
                    <div className="h-9 w-24 bg-slate-200 rounded-lg"></div>
                </div>
            </div>

            {/* Main Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Balance Card Skeleton */}
                <div className="lg:col-span-2 h-[200px] bg-slate-200 rounded-xl"></div>

                {/* Stat Cards Skeleton */}
                <div className="h-[200px] bg-slate-200 rounded-xl"></div>
                <div className="h-[200px] bg-slate-200 rounded-xl"></div>

                {/* Spending Skeleton */}
                <div className="lg:col-span-2 h-[400px] bg-slate-200 rounded-xl"></div>

                {/* More Stats Skeleton */}
                <div className="h-[200px] bg-slate-200 rounded-xl"></div>
                <div className="h-[200px] bg-slate-200 rounded-xl"></div>

                {/* Recent Transactions Skeleton */}
                <div className="col-span-full h-[300px] bg-slate-200 rounded-xl"></div>
            </div>
        </div>
    );
}
