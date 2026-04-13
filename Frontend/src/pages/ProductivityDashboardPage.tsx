import type { ChartPoint, DashboardStat } from '../types/email'

interface ProductivityDashboardPageProps {
  stats: DashboardStat[]
  emailsTrend: ChartPoint[]
  categoryTrend: ChartPoint[]
}

const maxValue = (points: ChartPoint[]) => Math.max(...points.map((point) => point.value), 1)

export const ProductivityDashboardPage = ({
  stats,
  emailsTrend,
  categoryTrend,
}: ProductivityDashboardPageProps) => {
  const emailsMax = maxValue(emailsTrend)
  const categoriesMax = maxValue(categoryTrend)

  return (
    <section className="space-y-5">
      <div>
        <h2 className="font-['Space_Grotesk'] text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Productivity Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track response quality, workload trends, and category distribution.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-2 font-['Space_Grotesk'] text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">{stat.delta} vs yesterday</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-slate-900 dark:text-slate-100">Emails Per Day</h3>
          <div className="mt-5 flex h-56 items-end gap-3 overflow-x-auto pb-1">
            {emailsTrend.map((point) => (
              <div key={point.label} className="flex min-w-12 flex-col items-center gap-2">
                <div className="w-full rounded-t-xl bg-gradient-to-t from-cyan-500 to-teal-400" style={{ height: `${(point.value / emailsMax) * 180}px` }} />
                <p className="text-xs text-slate-500 dark:text-slate-400">{point.label}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-slate-900 dark:text-slate-100">Category Distribution</h3>
          <div className="mt-5 space-y-3">
            {categoryTrend.map((point) => (
              <div key={point.label}>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{point.label}</span>
                  <span>{point.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-orange-400 to-rose-500"
                    style={{ width: `${(point.value / categoriesMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
