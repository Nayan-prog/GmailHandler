import { Bell, Menu, Moon, Search, SlidersHorizontal, Sun } from 'lucide-react'

interface HeaderProps {
  query: string
  onQueryChange: (query: string) => void
  onOpenFilters: () => void
  theme: 'light' | 'dark'
  onThemeToggle: () => void
  onOpenSidebar: () => void
}

export const Header = ({
  query,
  onQueryChange,
  onOpenFilters,
  theme,
  onThemeToggle,
  onOpenSidebar,
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/75 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search emails like 'from Amazon last week'"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white/90 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filter</span>
        </button>

        <button
          type="button"
          onClick={onThemeToggle}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        <button
          type="button"
          className="relative grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
        </button>
      </div>
    </header>
  )
}
