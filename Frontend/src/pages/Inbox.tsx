import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ContactCard } from '../components/ContactCard'
import { emails as fallbackEmails } from '../data/mockData'
import { EmailCard } from '../components/EmailCard'
import { EmailDetail } from '../components/EmailDetail'
import { EmptyState } from '../components/EmptyState'
import { FilterModal } from '../components/FilterModal'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import type { NavView } from '../components/Sidebar'
import { useTheme } from '../hooks/useTheme'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { apiClient } from '../lib/api'
import type { ApiEmail, Contact, Email, EmailCategory, InboxFilterState } from '../types/email'

const FALLBACK_CONTACT_CLASSES = ['bg-teal-500/90', 'bg-orange-500/90', 'bg-indigo-500/90', 'bg-pink-500/90', 'bg-sky-500/90']

const DEFAULT_FILTERS: InboxFilterState = {
  sender: '',
  dateRange: 'all',
  attachmentsOnly: false,
  readStatus: 'all',
}

const parseSender = (senderRaw: string) => {
  const pattern = /^(.*?)(?:\s*<(.+?)>)?$/
  const match = senderRaw.match(pattern)
  const senderName = match?.[1]?.trim().replaceAll('"', '') || senderRaw
  const senderEmail = match?.[2]?.trim() || `${senderName.toLowerCase().replace(/\s+/g, '.')}@mail.local`
  return { senderName, senderEmail }
}

const detectCategory = (subject: string, sender: string): EmailCategory => {
  const text = `${subject} ${sender}`.toLowerCase()

  if (/security|alert|password|invoice|contract|urgent|blocked/.test(text)) {
    return 'important'
  }
  if (/promo|offer|sale|discount|amazon|deal|campaign/.test(text)) {
    return 'promotions'
  }
  if (/linkedin|instagram|facebook|x\.com|social/.test(text)) {
    return 'social'
  }
  if (/win|gift card|claim|lottery|crypto|suspicious/.test(text)) {
    return 'spam'
  }

  return 'inbox'
}

const detectPriority = (subject: string): Email['priority'] => {
  const value = subject.toLowerCase()
  if (/urgent|asap|immediately|blocked|eod/.test(value)) {
    return 'urgent'
  }
  if (/important|follow up|review|approval/.test(value)) {
    return 'important'
  }
  return 'normal'
}

const formatTimeLabel = (timestamp: Date) => {
  const now = new Date()
  const msInDay = 24 * 60 * 60 * 1000
  const dayDiff = Math.floor((now.getTime() - timestamp.getTime()) / msInDay)

  if (dayDiff <= 0) {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (dayDiff === 1) {
    return 'Yesterday'
  }
  if (dayDiff < 7) {
    return timestamp.toLocaleDateString([], { weekday: 'short' })
  }
  return timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const mapApiEmail = (item: ApiEmail, index: number): Email => {
  const { senderName, senderEmail } = parseSender(item.sender)
  const timestamp = new Date(Date.now() - index * 1000 * 60 * 43)

  return {
    id: item.id,
    senderName,
    senderEmail,
    subject: item.subject || 'No subject',
    preview: item.snippet || 'No preview available.',
    body:
      item.snippet ||
      'This message body is not available yet. Integrate a full-email endpoint to show complete content.',
    timeLabel: formatTimeLabel(timestamp),
    timestamp,
    category: detectCategory(item.subject, item.sender),
    priority: detectPriority(item.subject),
    unread: index % 3 !== 0,
    hasAttachments: /pdf|invoice|attachment|doc/i.test(item.subject),
    summary: item.snippet || 'No AI summary generated for this email yet.',
    suggestedReplies: ['Thanks, received.', 'I will review and reply shortly.', 'Please share more details.'],
  }
}

const buildContacts = (emails: Email[]): Contact[] => {
  const unique = new Map<string, Contact>()

  emails.forEach((email, index) => {
    if (unique.has(email.senderEmail)) {
      return
    }

    const names = email.senderName.split(' ').filter(Boolean)
    const initials = names.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'NA'

    unique.set(email.senderEmail, {
      id: email.senderEmail,
      name: email.senderName,
      email: email.senderEmail,
      initials,
      avatarClass: FALLBACK_CONTACT_CLASSES[index % FALLBACK_CONTACT_CLASSES.length],
    })
  })

  return Array.from(unique.values())
}

export const InboxPage = () => {
  const { theme, toggleTheme } = useTheme()

  const [activeView, setActiveView] = useState<NavView>('inbox')
  const [query, setQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [filters, setFilters] = useState<InboxFilterState>(DEFAULT_FILTERS)

  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)

  const fetchEmails = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setErrorMessage('')

    try {
      const response = await apiClient.get<{ emails?: ApiEmail[] } | ApiEmail[]>('/api/emails/', {
        signal,
      })

      const payload = Array.isArray(response.data) ? response.data : response.data.emails || []
      const mappedEmails = payload.map(mapApiEmail)
      setEmails(mappedEmails)
      setSelectedEmailId((current) => current ?? mappedEmails[0]?.id ?? null)
    } catch (error) {
      if (axios.isCancel(error)) {
        return
      }

      setEmails((current) => (current.length > 0 ? current : fallbackEmails.slice(0, 9)))
      setSelectedEmailId((current) => current ?? fallbackEmails[0]?.id ?? null)
      setErrorMessage('Backend API is currently unreachable. Showing local inbox data. Start Django on port 8000 and click Retry.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void fetchEmails(controller.signal)
    return () => controller.abort()
  }, [fetchEmails])

  const contacts = useMemo(() => buildContacts(emails), [emails])

  const filteredEmails = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const normalizedSender = filters.sender.trim().toLowerCase()

    return emails
      .filter((email) => email.category === activeView)
      .filter((email) => {
        if (!normalizedQuery) {
          return true
        }

        return (
          email.senderName.toLowerCase().includes(normalizedQuery) ||
          email.senderEmail.toLowerCase().includes(normalizedQuery) ||
          email.subject.toLowerCase().includes(normalizedQuery) ||
          email.preview.toLowerCase().includes(normalizedQuery)
        )
      })
      .filter((email) => {
        if (!normalizedSender) {
          return true
        }
        return (
          email.senderName.toLowerCase().includes(normalizedSender) ||
          email.senderEmail.toLowerCase().includes(normalizedSender)
        )
      })
      .filter((email) => {
        if (selectedContactId === null) {
          return true
        }
        return email.senderEmail === selectedContactId
      })
      .filter((email) => {
        if (filters.readStatus === 'all') {
          return true
        }
        if (filters.readStatus === 'unread') {
          return email.unread
        }
        return !email.unread
      })
      .filter((email) => {
        if (!filters.attachmentsOnly) {
          return true
        }
        return email.hasAttachments
      })
      .filter((email) => {
        if (filters.dateRange === 'all') {
          return true
        }

        const now = new Date()
        const diff = now.getTime() - email.timestamp.getTime()
        const diffHours = diff / (1000 * 60 * 60)

        if (filters.dateRange === '24h') {
          return diffHours <= 24
        }
        if (filters.dateRange === '7d') {
          return diffHours <= 24 * 7
        }
        return diffHours <= 24 * 30
      })
  }, [activeView, emails, filters, query, selectedContactId])

  const selectedEmail = useMemo(
    () => filteredEmails.find((email) => email.id === selectedEmailId) ?? null,
    [filteredEmails, selectedEmailId],
  )

  useEffect(() => {
    if (!selectedEmailId && filteredEmails.length > 0) {
      setSelectedEmailId(filteredEmails[0].id)
      return
    }

    if (selectedEmailId && !filteredEmails.some((email) => email.id === selectedEmailId)) {
      setSelectedEmailId(filteredEmails[0]?.id ?? null)
    }
  }, [filteredEmails, selectedEmailId])

  const removeEmail = (emailId: string) => {
    setEmails((current) => current.filter((email) => email.id !== emailId))
    if (selectedEmailId === emailId) {
      setSelectedEmailId(null)
    }
  }

  const markAsRead = (emailId: string) => {
    setEmails((current) =>
      current.map((email) => {
        if (email.id !== emailId) {
          return email
        }

        return {
          ...email,
          unread: false,
        }
      }),
    )
  }

  return (
    <>
      <DashboardLayout
        activeView={activeView}
        onViewChange={setActiveView}
        sidebarOpen={sidebarOpen}
        onSidebarClose={() => setSidebarOpen(false)}
        onSidebarOpen={() => setSidebarOpen(true)}
        query={query}
        onQueryChange={setQuery}
        onOpenFilters={() => setFilterModalOpen(true)}
        theme={theme}
        onThemeToggle={toggleTheme}
      >
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-['Space_Grotesk'] text-2xl font-semibold text-slate-900 dark:text-slate-100">Smart Inbox</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{filteredEmails.length} results</p>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span>{errorMessage}</span>
                  <button
                    type="button"
                    onClick={() => void fetchEmails()}
                    className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-200 dark:hover:bg-rose-500/30"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            <div className="max-h-[calc(100vh-12.5rem)] space-y-3 overflow-y-auto pr-1">
              {loading && <LoadingSkeleton />}
              {!loading && filteredEmails.length === 0 && (
                <EmptyState
                  onClear={() => {
                    setQuery('')
                    setSelectedContactId(null)
                    setFilters(DEFAULT_FILTERS)
                  }}
                />
              )}
              {!loading &&
                filteredEmails.map((email) => (
                  <EmailCard
                    key={email.id}
                    email={email}
                    isActive={selectedEmailId === email.id}
                    onOpen={() => {
                      setSelectedEmailId(email.id)
                      if (email.unread) {
                        markAsRead(email.id)
                      }
                    }}
                    onArchive={() => removeEmail(email.id)}
                    onDelete={() => removeEmail(email.id)}
                    onMarkRead={() => markAsRead(email.id)}
                  />
                ))}
            </div>
          </div>

          <div className="space-y-4">
            <EmailDetail email={selectedEmail} onUseReply={() => undefined} />

            <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-slate-900 dark:text-slate-100">Frequent Contacts</h3>
                <button
                  type="button"
                  onClick={() => setSelectedContactId(null)}
                  className="text-xs font-medium text-teal-600 transition hover:text-teal-500 dark:text-teal-300"
                >
                  Clear
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {contacts.slice(0, 6).map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    isActive={selectedContactId === contact.id}
                    onSelect={() => setSelectedContactId(contact.id)}
                  />
                ))}
              </div>

              <div className="mt-5">
                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Quick Filters</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFilters((current) => ({ ...current, readStatus: 'unread' }))}
                    className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Unread
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilters((current) => ({ ...current, attachmentsOnly: true }))}
                    className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Attachments
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilters((current) => ({ ...current, dateRange: '7d' }))}
                    className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Last 7 days
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </DashboardLayout>

      <FilterModal
        isOpen={filterModalOpen}
        initialFilters={filters}
        onApply={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        onClose={() => setFilterModalOpen(false)}
      />
    </>
  )
}