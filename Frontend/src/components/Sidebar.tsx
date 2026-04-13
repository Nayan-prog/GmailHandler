import {
  CircleAlert,
  Inbox,
  Megaphone,
  Send,
  ShieldAlert,
  Users,
} from 'lucide-react'
import type { ComponentType } from 'react'

export type NavView =
  | 'inbox'
  | 'important'
  | 'promotions'
  | 'social'
  | 'spam'

interface SidebarProps {
  activeView: NavView
  onViewChange: (view: NavView) => void
  isOpen: boolean
  onClose: () => void
}

const navItems: Array<{ id: NavView; label: string; icon: ComponentType<{ className?: string }> }> = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'important', label: 'Important', icon: CircleAlert },
  { id: 'promotions', label: 'Promotions', icon: Megaphone },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'spam', label: 'Spam', icon: ShieldAlert },
]

export const Sidebar = ({ activeView, onViewChange, isOpen, onClose }: SidebarProps) => {
  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200/80 bg-white/90 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950/85 md:static md:translate-x-0 md:shadow-none',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col">
        <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 p-4 text-white shadow-lg shadow-teal-500/30">
          <p className="text-xs uppercase tracking-[0.25em] text-teal-50">Workspace</p>
          <h1 className="mt-2 font-['Space_Grotesk'] text-2xl font-semibold">GmailHandler</h1>
        </div>

        <button
          type="button"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
        >
          <Send className="h-4 w-4" />
          Compose
        </button>

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onViewChange(item.id)
                  onClose()
                }}
                className={[
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-teal-500 dark:text-slate-950'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-sm font-semibold text-white">
              AR
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Ajay Rajput</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Product Owner</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
