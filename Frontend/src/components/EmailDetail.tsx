import { Clock3, Sparkles, UserRound } from 'lucide-react'
import type { Email } from '../types/email'

interface EmailDetailProps {
  email: Email | null
  onUseReply: (reply: string) => void
}

export const EmailDetail = ({ email, onUseReply }: EmailDetailProps) => {
  if (!email) {
    return (
      <aside className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
        <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-slate-900 dark:text-slate-100">Select an email</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Open a message to preview details, AI summary, and quick reply suggestions.
        </p>
      </aside>
    )
  }

  return (
    <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Email Detail</p>
        <h3 className="mt-2 font-['Space_Grotesk'] text-xl font-semibold text-slate-900 dark:text-slate-100">{email.subject}</h3>
      </div>

      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/70">
        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <UserRound className="h-4 w-4" />
          <span className="font-medium">{email.senderName}</span>
          <span className="text-slate-500">{email.senderEmail}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Clock3 className="h-3.5 w-3.5" />
          {email.timeLabel}
        </div>
      </div>

      <article className="rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:text-slate-300">
        {email.body}
      </article>

      <section className="rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 p-4 dark:border-teal-500/30 dark:from-teal-500/10 dark:to-cyan-500/10">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-teal-700 dark:text-teal-300">
          <Sparkles className="h-4 w-4" />
          AI Summary
        </p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{email.summary}</p>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Suggested Replies</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {email.suggestedReplies.slice(0, 3).map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => onUseReply(reply)}
              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {reply}
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}