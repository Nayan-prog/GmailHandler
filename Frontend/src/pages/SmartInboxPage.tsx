import { Sparkles } from 'lucide-react'
import { ContactCard } from '../components/ContactCard'
import { EmailCard } from '../components/EmailCard'
import { EmptyState } from '../components/EmptyState'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import type { Contact, Email } from '../types/email'

interface SmartInboxPageProps {
  emails: Email[]
  selectedEmail: Email | null
  onOpenEmail: (emailId: string) => void
  onArchiveEmail: (emailId: string) => void
  onDeleteEmail: (emailId: string) => void
  onMarkRead: (emailId: string) => void
  contacts: Contact[]
  selectedContactId: string | null
  onSelectContact: (contactId: string | null) => void
  loading: boolean
  onClearFilters: () => void
}

export const SmartInboxPage = ({
  emails,
  selectedEmail,
  onOpenEmail,
  onArchiveEmail,
  onDeleteEmail,
  onMarkRead,
  contacts,
  selectedContactId,
  onSelectContact,
  loading,
  onClearFilters,
}: SmartInboxPageProps) => {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-4">
        {selectedEmail && (
          <article className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 p-4 shadow-sm dark:border-teal-500/30 dark:from-teal-500/10 dark:to-cyan-500/10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
              <Sparkles className="h-4 w-4" />
              Smart Summary
            </div>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{selectedEmail.summary}</p>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Auto Reply Suggestions
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedEmail.suggestedReplies.slice(0, 3).map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          </article>
        )}

        <div className="flex items-center justify-between">
          <h2 className="font-['Space_Grotesk'] text-2xl font-semibold text-slate-900 dark:text-slate-100">Smart Inbox</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{emails.length} results</p>
        </div>

        <div className="max-h-[calc(100vh-13rem)] space-y-3 overflow-y-auto pr-1">
          {loading && <LoadingSkeleton />}
          {!loading && emails.length === 0 && <EmptyState onClear={onClearFilters} />}
          {!loading &&
            emails.map((email) => (
              <EmailCard
                key={email.id}
                email={email}
                isActive={selectedEmail?.id === email.id}
                onOpen={() => onOpenEmail(email.id)}
                onArchive={() => onArchiveEmail(email.id)}
                onDelete={() => onDeleteEmail(email.id)}
                onMarkRead={() => onMarkRead(email.id)}
              />
            ))}
        </div>
      </div>

      <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-slate-900 dark:text-slate-100">Frequent Contacts</h3>
          <button
            type="button"
            onClick={() => onSelectContact(null)}
            className="text-xs font-medium text-teal-600 transition hover:text-teal-500 dark:text-teal-300"
          >
            Clear
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {contacts.slice(0, 8).map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isActive={selectedContactId === contact.id}
              onSelect={() => onSelectContact(contact.id)}
            />
          ))}
        </div>
      </aside>
    </section>
  )
}
