import type { Email } from '../types/email'

const now = new Date()

const ago = (days: number, hours = 0) => {
  const date = new Date(now)
  date.setDate(date.getDate() - days)
  date.setHours(date.getHours() - hours)
  return date
}

export const emails: Email[] = [
  {
    id: 'e1',
    senderName: 'Ariana Patel',
    senderEmail: 'ariana@nova.ai',
    subject: 'Contract update needed before EOD',
    preview: 'Can you approve section 4.2 today? Legal is waiting for your final signoff.',
    body: 'Hi team, legal has approved everything except section 4.2. Please confirm pricing and return with your final signoff before end of day.',
    timeLabel: '09:12',
    timestamp: ago(0, 3),
    category: 'important',
    priority: 'urgent',
    unread: true,
    hasAttachments: true,
    summary: 'Legal requires your signoff on section 4.2 today. Blocking issue for contract completion.',
    suggestedReplies: ['Approved. Sending signed doc now.', 'Need 2 hours for a final review.', 'Please share the latest redline version.'],
  },
  {
    id: 'e2',
    senderName: 'Marcus Lee',
    senderEmail: 'marcus@orbitlabs.io',
    subject: 'Weekly sync notes',
    preview: 'Action items are listed in the doc. Biggest blocker is data migration timing.',
    body: 'Thanks for joining. Top action items: migration estimate by Wednesday, QA checklist by Friday, and final launch dry-run next Monday.',
    timeLabel: '08:40',
    timestamp: ago(0, 4),
    category: 'inbox',
    priority: 'important',
    unread: true,
    hasAttachments: false,
    summary: 'Three key action items with migration estimate as the immediate blocker.',
    suggestedReplies: ['Received. I will send migration estimate by noon.', 'Can we move QA checklist review to Thursday?', 'Looks good, no blockers from my side.'],
  },
  {
    id: 'e3',
    senderName: 'Amazon Orders',
    senderEmail: 'order-update@amazon.com',
    subject: 'Your package has shipped',
    preview: 'Track your shipment and estimated delivery time in your order history.',
    body: 'Your package has shipped and is expected to arrive in 2 days. Track status via your order dashboard.',
    timeLabel: 'Yesterday',
    timestamp: ago(1, 2),
    category: 'promotions',
    priority: 'normal',
    unread: false,
    hasAttachments: false,
    summary: 'Shipment confirmation with tracking details.',
    suggestedReplies: ['Thanks!', 'No response needed.'],
  },
  {
    id: 'e4',
    senderName: 'LinkedIn',
    senderEmail: 'messages-noreply@linkedin.com',
    subject: 'You appeared in 18 searches this week',
    preview: 'See who viewed your profile and opportunities aligned with your role.',
    body: 'Your profile gained traction this week. Upgrade insights or review suggested opportunities.',
    timeLabel: 'Yesterday',
    timestamp: ago(1, 7),
    category: 'social',
    priority: 'normal',
    unread: true,
    hasAttachments: false,
    summary: 'Profile engagement digest and job recommendation highlights.',
    suggestedReplies: ['No response needed.'],
  },
]
