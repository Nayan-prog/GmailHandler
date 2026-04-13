import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { DateRangeFilter, InboxFilterState, ReadFilter } from '../types/email'

interface FilterModalProps {
  isOpen: boolean
  initialFilters: InboxFilterState
  onApply: (filters: InboxFilterState) => void
  onReset: () => void
  onClose: () => void
}

export const FilterModal = ({ isOpen, initialFilters, onApply, onReset, onClose }: FilterModalProps) => {
  const [draftFilters, setDraftFilters] = useState<InboxFilterState>(initialFilters)

  useEffect(() => {
    setDraftFilters(initialFilters)
  }, [initialFilters])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/30 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-slate-900 dark:text-slate-100">Inbox Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sender</span>
            <input
              value={draftFilters.sender}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  sender: event.target.value,
                }))
              }
              placeholder="e.g. amazon.com"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Date range</span>
            <select
              value={draftFilters.dateRange}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  dateRange: event.target.value as DateRangeFilter,
                }))
              }
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="all">Any time</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Read status</span>
            <select
              value={draftFilters.readStatus}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  readStatus: event.target.value as ReadFilter,
                }))
              }
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="all">All</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
          </label>

          <label className="mt-6 inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            <input
              checked={draftFilters.attachmentsOnly}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  attachmentsOnly: event.target.checked,
                }))
              }
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
            />
            Has attachments only
          </label>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draftFilters)
              onClose()
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}
