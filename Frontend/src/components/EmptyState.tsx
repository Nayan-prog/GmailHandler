import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  onClear: () => void
}

export const EmptyState = ({ onClear }: EmptyStateProps) => {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Inbox className="h-6 w-6 text-slate-500 dark:text-slate-300" />
      </div>
      <h3 className="mt-3 font-['Space_Grotesk'] text-lg font-semibold text-slate-900 dark:text-slate-100">No emails match your filters</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Adjust your search query or reset filters to bring messages back into view.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
      >
        Clear filters
      </button>
    </div>
  )
}
