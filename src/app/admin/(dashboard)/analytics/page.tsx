import Link from "next/link";
import { getPageViewEvents, getCheckoutFunnel, MAX_HISTORY_DAYS } from "@/lib/analytics";
import { formatIST } from "@/lib/timezone";

export const dynamic = "force-dynamic";

function clampDays(value: string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return MAX_HISTORY_DAYS;
  return Math.min(Math.round(parsed), MAX_HISTORY_DAYS);
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const { days: daysParam } = await searchParams;
  const days = clampDays(daysParam);

  const [pageViews, funnel] = await Promise.all([
    getPageViewEvents(days),
    getCheckoutFunnel(days),
  ]);

  const uniqueVisitors = new Set(pageViews.map((v) => v.visitorId)).size;
  const abandonedCount = funnel.totalClicked - funnel.totalCompleted;
  const abandonRate =
    funnel.totalClicked > 0 ? Math.round((abandonedCount / funnel.totalClicked) * 100) : 0;

  const dayOptions = [1, 3, 7, MAX_HISTORY_DAYS];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[var(--color-ink)]">Analytics</h1>
          <p className="text-sm text-[var(--color-ink)]/60">
            Visitor activity and checkout funnel, last {days} day{days === 1 ? "" : "s"} (times in IST)
          </p>
        </div>
        <div className="flex gap-2">
          {dayOptions.map((d) => (
            <Link
              key={d}
              href={`/admin/analytics?days=${d}`}
              className={`rounded-full px-4 py-1.5 text-xs font-medium ${
                d === days
                  ? "bg-[var(--color-plum)] text-white"
                  : "border border-[var(--color-border)] text-[var(--color-ink)]/70 hover:border-[var(--color-plum)]"
              }`}
            >
              {d}d
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Unique Visitors" value={uniqueVisitors} />
        <StatCard label="Page Views" value={pageViews.length} />
        <StatCard label="Checkout Clicked" value={funnel.totalClicked} />
        <StatCard
          label="Checkout Completed"
          value={funnel.totalCompleted}
          sub={funnel.totalClicked > 0 ? `${abandonRate}% abandoned` : undefined}
        />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg text-[var(--color-ink)]">Checkout Funnel by Day</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-ink)]/50">
                <th className="px-4 py-3">Date (IST)</th>
                <th className="px-4 py-3">Clicked Checkout</th>
                <th className="px-4 py-3">Completed</th>
                <th className="px-4 py-3">Abandoned</th>
              </tr>
            </thead>
            <tbody>
              {funnel.daily.map((day) => (
                <tr key={day.date} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{day.date}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]/70">{day.clicked}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]/70">{day.completed}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]/70">
                    {Math.max(day.clicked - day.completed, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg text-[var(--color-ink)]">Abandoned Checkouts</h2>
        <p className="mt-1 text-xs text-[var(--color-ink)]/50">
          Visitors who clicked &quot;Proceed to Checkout&quot; but have no completed order since.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-ink)]/50">
                <th className="px-4 py-3">Clicked At (IST)</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Visitor</th>
              </tr>
            </thead>
            <tbody>
              {funnel.abandonedSessions.map((session, i) => (
                <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3 text-[var(--color-ink)]">{formatIST(session.clickedAt)}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]/70">{session.country ?? "Unknown"}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]/70">{session.city ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-ink)]/50">
                    {session.visitorId.slice(0, 8)}
                  </td>
                </tr>
              ))}
              {funnel.abandonedSessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-[var(--color-ink)]/50">
                    No abandoned checkouts in this window.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg text-[var(--color-ink)]">Visitor Log</h2>
        <p className="mt-1 text-xs text-[var(--color-ink)]/50">
          Most recent {pageViews.length} page view{pageViews.length === 1 ? "" : "s"}.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-ink)]/50">
                <th className="px-4 py-3">Time (IST)</th>
                <th className="px-4 py-3">Page</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Visitor</th>
              </tr>
            </thead>
            <tbody>
              {pageViews.map((view) => (
                <tr key={view.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3 text-[var(--color-ink)]">{formatIST(view.createdAt)}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]/70">{view.path ?? "—"}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]/70">{view.country ?? "Unknown"}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]/70">{view.city ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-ink)]/50">
                    {view.visitorId.slice(0, 8)}
                  </td>
                </tr>
              ))}
              {pageViews.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-[var(--color-ink)]/50">
                    No visits recorded in this window.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink)]/50">{label}</p>
      <p className="mt-1 font-display text-2xl text-[var(--color-ink)]">{value}</p>
      {sub && <p className="mt-1 text-xs text-[var(--color-gold)]">{sub}</p>}
    </div>
  );
}
