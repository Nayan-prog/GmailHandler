import { Mail, RefreshCcw, SendHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ContactCard } from '../components/ContactCard'
import { EmailCard } from '../components/EmailCard'
import { EmailDetail } from '../components/EmailDetail'
import { EmptyState } from '../components/EmptyState'
import { FilterModal } from '../components/FilterModal'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import type { NavView } from '../components/Sidebar'
import { emails as backupEmails } from '../data/mockData'
import { useTheme } from '../hooks/useTheme'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { apiClient } from '../lib/api'
import type { ApiEmail, Contact, DateRangeFilter, Email, InboxFilterState } from '../types/email'

const DEFAULT_FILTERS: InboxFilterState = {
  sender: '',
  dateRange: 'all',
  attachmentsOnly: false,
  readStatus: 'all',
}

const AVATAR_CLASSES = [
  'bg-gradient-to-br from-cyan-500 to-blue-500',
  'bg-gradient-to-br from-fuchsia-500 to-pink-500',
  'bg-gradient-to-br from-emerald-500 to-teal-500',
  'bg-gradient-to-br from-amber-500 to-orange-500',
  'bg-gradient-to-br from-violet-500 to-indigo-500',
]

const PRIORITIES: Email['priority'][] = ['normal', 'important', 'urgent']
const CATEGORIES: Email['category'][] = ['inbox', 'important', 'promotions', 'social', 'spam']

const toInitials = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

const parseSender = (sender: string) => {
  const match = sender.match(/(.*)<([^>]+)>/)
  if (!match) {
    const fallbackName = sender.includes('@') ? sender.split('@')[0] : sender
    return {
      senderName: fallbackName.trim() || 'Unknown Sender',
      senderEmail: sender.includes('@') ? sender.trim() : 'unknown@example.com',
    }
  }

  return {
    senderName: match[1].replace(/\"/g, '').trim() || match[2].split('@')[0],
    senderEmail: match[2].trim(),
  }
}

const toRelativeTimeLabel = (date: Date) => {
  const now = Date.now()
  const diffMs = now - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) {
    return 'Just now'
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) {
    return 'Yesterday'
  }
  return `${diffDays}d ago`
}

const mapApiEmail = (email: ApiEmail, index: number): Email => {
  const sender = parseSender(email.sender)
  const timestamp = new Date(Date.now() - index * 1000 * 60 * 47)

  return {
    id: email.id,
    senderName: sender.senderName,
    senderEmail: sender.senderEmail,
    subject: email.subject || '(No subject)',
    preview: email.snippet || 'No preview available.',
    body: email.snippet || 'No content available for this email right now.',
    timeLabel: toRelativeTimeLabel(timestamp),
    timestamp,
    category: CATEGORIES[index % CATEGORIES.length],
    priority: PRIORITIES[index % PRIORITIES.length],
    unread: index % 3 !== 0,
    hasAttachments: index % 4 === 0,
    summary: `This email appears to be about: ${email.subject || 'an update'}. ${email.snippet || 'Open it for details.'}`,
    suggestedReplies: ['Thanks, I have noted this.', 'Can you share more detail?', 'Received. I will get back to you shortly.'],
  }
}

const isWithinRange = (timestamp: Date, range: DateRangeFilter) => {
  if (range === 'all') {
    return true
  }

  const now = Date.now()
  const diff = now - timestamp.getTime()
  const dayMs = 1000 * 60 * 60 * 24

  if (range === '24h') {
    return diff <= dayMs
  }
  if (range === '7d') {
    return diff <= dayMs * 7
  }
  return diff <= dayMs * 30
}

export const InboxPage = () => {
  const { theme, toggleTheme } = useTheme()

  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeView, setActiveView] = useState<NavView>('inbox')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<InboxFilterState>(DEFAULT_FILTERS)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const loadEmails = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await apiClient.get<{ emails?: ApiEmail[] } | ApiEmail[]>('/api/emails/', {
          signal: controller.signal,
        })

        const payload = Array.isArray(response.data) ? response.data : response.data.emails || []
        const mapped = payload.map(mapApiEmail)

        if (mapped.length > 0) {
          setEmails(mapped)
          return
        }

        setEmails(backupEmails)
        setError('No backend emails were returned, showing saved sample data.')
      } catch {
        setEmails(backupEmails)
        setError('Backend fetch failed. Showing saved sample data while the API reconnects.')
      } finally {
        setLoading(false)
      }
    }

    void loadEmails()
    return () => controller.abort()
  }, [attempt])

  const filteredEmails = useMemo(() => {
    const senderFilter = filters.sender.trim().toLowerCase()
    const queryValue = query.trim().toLowerCase()

    return emails.filter((email) => {
      if (activeView !== 'inbox' && email.category !== activeView) {
        return false
      }

      if (filters.readStatus === 'read' && email.unread) {
        return false
      }
      if (filters.readStatus === 'unread' && !email.unread) {
        return false
      }

      if (filters.attachmentsOnly && !email.hasAttachments) {
        return false
      }

      if (!isWithinRange(email.timestamp, filters.dateRange)) {
        return false
      }

      if (senderFilter) {
        const senderMatch = `${email.senderName} ${email.senderEmail}`.toLowerCase()
        if (!senderMatch.includes(senderFilter)) {
          return false
        }
      }

      if (!queryValue) {
        return true
      }

      const searchScope = `${email.senderName} ${email.senderEmail} ${email.subject} ${email.preview} ${email.body}`.toLowerCase()
      return searchScope.includes(queryValue)
    })
  }, [activeView, emails, filters, query])

  useEffect(() => {
    if (filteredEmails.length === 0) {
      setSelectedEmailId(null)
      return
    }

    const exists = filteredEmails.some((email) => email.id === selectedEmailId)
    if (!exists) {
      setSelectedEmailId(filteredEmails[0].id)
    }
  }, [filteredEmails, selectedEmailId])

  const selectedEmail = filteredEmails.find((email) => email.id === selectedEmailId) ?? null

  const contacts: Contact[] = useMemo(() => {
    const seen = new Set<string>()
    const list: Contact[] = []

    for (const email of filteredEmails) {
      if (seen.has(email.senderEmail)) {
        continue
      }
      seen.add(email.senderEmail)

      list.push({
        id: email.senderEmail,
        name: email.senderName,
        email: email.senderEmail,
        initials: toInitials(email.senderName || email.senderEmail),
        avatarClass: AVATAR_CLASSES[list.length % AVATAR_CLASSES.length],
      })

      if (list.length >= 8) {
        break
      }
    }

    return list
  }, [filteredEmails])

  const stats = useMemo(() => {
    const unread = emails.filter((email) => email.unread).length
    const urgent = emails.filter((email) => email.priority === 'urgent').length
    const attachments = emails.filter((email) => email.hasAttachments).length

    return [
      { id: 'unread', label: 'Unread', value: String(unread) },
      { id: 'urgent', label: 'Urgent', value: String(urgent) },
      { id: 'files', label: 'Attachments', value: String(attachments) },
    ]
  }, [emails])

  const markEmailRead = (emailId: string) => {
    setEmails((current) => current.map((email) => (email.id === emailId ? { ...email, unread: false } : email)))
  }

  const archiveEmail = (emailId: string) => {
    setEmails((current) => current.filter((email) => email.id !== emailId))
  }

  const deleteEmail = (emailId: string) => {
    setEmails((current) => current.filter((email) => email.id !== emailId))
  }

  return (
    <DashboardLayout
      activeView={activeView}
      onViewChange={setActiveView}
      sidebarOpen={sidebarOpen}
      onSidebarClose={() => setSidebarOpen(false)}
      onSidebarOpen={() => setSidebarOpen(true)}
      query={query}
      onQueryChange={setQuery}
      onOpenFilters={() => setIsFilterOpen(true)}
      theme={theme}
      onThemeToggle={toggleTheme}
    >
      <FilterModal
        isOpen={isFilterOpen}
        initialFilters={filters}
        onApply={setFilters}
        onReset={() => {
          setFilters(DEFAULT_FILTERS)
          setIsFilterOpen(false)
        }}
        onClose={() => setIsFilterOpen(false)}
      />

      {error && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          <p>{error}</p>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-amber-400/60 px-3 py-1.5 text-xs font-medium transition hover:bg-amber-100 dark:hover:bg-amber-500/20"
            onClick={() => setAttempt((value) => value + 1)}
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Retry API
          </button>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredEmails.length === 0 ? (
            <EmptyState
              onClear={() => {
                setQuery('')
                setFilters(DEFAULT_FILTERS)
                setActiveView('inbox')
              }}
            />
          ) : (
            filteredEmails.map((email) => (
              <EmailCard
                key={email.id}
                email={email}
                isActive={selectedEmailId === email.id}
                onOpen={() => {
                  setSelectedEmailId(email.id)
                  markEmailRead(email.id)
                }}
                onArchive={() => archiveEmail(email.id)}
                onDelete={() => deleteEmail(email.id)}
                onMarkRead={() => markEmailRead(email.id)}
              />
            ))
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
              <Mail className="h-3.5 w-3.5" />
              Top Contacts
            </p>
            <div className="mt-3 space-y-2">
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    isActive={selectedEmail?.senderEmail === contact.email}
                    onSelect={() => {
                      const firstMatch = filteredEmails.find((email) => email.senderEmail === contact.email)
                      if (firstMatch) {
                        setSelectedEmailId(firstMatch.id)
                      }
                    }}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No contacts available for this selection.</p>
              )}
            </div>
          </div>

          <EmailDetail
            email={selectedEmail}
            onUseReply={(reply) => {
              setReplyDraft(reply)
            }}
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Quick Reply</p>
            <textarea
              value={replyDraft}
              onChange={(event) => setReplyDraft(event.target.value)}
              placeholder="Write a short response..."
              className="mt-2 h-24 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
            />
            <button
              type="button"
              disabled={!replyDraft.trim()}
              onClick={() => setReplyDraft('')}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
            >
              <SendHorizontal className="h-4 w-4" />
              Send Reply
            </button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  )
}
