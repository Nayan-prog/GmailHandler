export type EmailCategory = 'inbox' | 'important' | 'promotions' | 'social' | 'spam'

export type EmailPriority = 'normal' | 'important' | 'urgent'

export type ReadFilter = 'all' | 'read' | 'unread'
export type DateRangeFilter = 'all' | '24h' | '7d' | '30d'

export interface Email {
  id: string
  senderName: string
  senderEmail: string
  subject: string
  preview: string
  body: string
  timeLabel: string
  timestamp: Date
  category: EmailCategory
  priority: EmailPriority
  unread: boolean
  hasAttachments: boolean
  summary: string
  suggestedReplies: string[]
}

export interface ApiEmail {
  id: string
  subject: string
  sender: string
  snippet: string
}

export interface Contact {
  id: string
  name: string
  email: string
  initials: string
  avatarClass: string
}

export interface InboxFilterState {
  sender: string
  dateRange: DateRangeFilter
  attachmentsOnly: boolean
  readStatus: ReadFilter
}

export interface DashboardStat {
  id: string
  label: string
  value: string
  delta: string
}

export interface ChartPoint {
  label: string
  value: number
}
