import type { ReactNode } from 'react'
import type { NavView } from '../components/Sidebar'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'

interface DashboardLayoutProps {
  children: ReactNode
  activeView: NavView
  onViewChange: (view: NavView) => void
  sidebarOpen: boolean
  onSidebarClose: () => void
  onSidebarOpen: () => void
  query: string
  onQueryChange: (query: string) => void
  onOpenFilters: () => void
  theme: 'light' | 'dark'
  onThemeToggle: () => void
}

export const DashboardLayout = ({
  children,
  activeView,
  onViewChange,
  sidebarOpen,
  onSidebarClose,
  onSidebarOpen,
  query,
  onQueryChange,
  onOpenFilters,
  theme,
  onThemeToggle,
}: DashboardLayoutProps) => {
  return (
    <div className="relative flex min-h-screen bg-slate-100/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar
        activeView={activeView}
        onViewChange={onViewChange}
        isOpen={sidebarOpen}
        onClose={onSidebarClose}
      />

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-sm md:hidden"
          onClick={onSidebarClose}
          aria-label="Close sidebar overlay"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col md:ml-0">
        <Header
          query={query}
          onQueryChange={onQueryChange}
          onOpenFilters={onOpenFilters}
          theme={theme}
          onThemeToggle={onThemeToggle}
          onOpenSidebar={onSidebarOpen}
        />

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
