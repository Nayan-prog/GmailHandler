import { Archive, MailCheck, Paperclip, Trash2 } from 'lucide-react'
import type { Email } from '../types/email'

interface EmailCardProps {
  email: Email
  isActive: boolean
  onOpen: () => void
  onArchive: () => void
  onDelete: () => void
  onMarkRead: () => void
}

const priorityClasses: Record<Email['priority'], string> = {
  normal: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  important: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
}

export const EmailCard = ({ email, isActive, onOpen, onArchive, onDelete, onMarkRead }: EmailCardProps) => {
  return (
    <article
      className={[
        'group rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900',
        isActive
          ? 'border-teal-400 shadow-lg shadow-teal-500/10 dark:border-teal-500'
          : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700',
      ].join(' ')}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{email.senderName}</p>
            {email.unread && <span className="h-2 w-2 rounded-full bg-teal-500" aria-label="Unread email" />}
          </div>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{email.subject}</p>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{email.timeLabel}</p>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{email.preview}</p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={["rounded-full px-2.5 py-1 text-xs font-medium", priorityClasses[email.priority]].join(' ')}>
            {email.priority === 'urgent' ? 'Urgent' : email.priority === 'important' ? 'Important' : 'Normal'}
          </span>
          {email.hasAttachments && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-300">
              <Paperclip className="h-3.5 w-3.5" />
              Attachment
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onArchive()
            }}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Archive email"
          >
            <Archive className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onDelete()
            }}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-rose-100 hover:text-rose-700 dark:text-slate-300 dark:hover:bg-rose-500/20 dark:hover:text-rose-300"
            aria-label="Delete email"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onMarkRead()
            }}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Mark email as read"
          >
            <MailCheck className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  )
}
