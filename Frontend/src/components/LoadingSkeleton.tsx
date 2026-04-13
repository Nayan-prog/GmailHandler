export const LoadingSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-4 h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  )
}
