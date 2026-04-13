import type { Contact } from '../types/email'

interface ContactCardProps {
  contact: Contact
  isActive: boolean
  onSelect: () => void
}

export const ContactCard = ({ contact, isActive, onSelect }: ContactCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition',
        isActive
          ? 'border-teal-500 bg-teal-50 dark:border-teal-500 dark:bg-teal-500/10'
          : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900',
      ].join(' ')}
    >
      <div className={[
        'grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white',
        contact.avatarClass,
      ].join(' ')}>
        {contact.initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{contact.name}</p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{contact.email}</p>
      </div>
    </button>
  )
}
