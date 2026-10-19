import { useLiveQuery } from 'dexie-react-hooks';
import WeeklyChart from '../components/WeeklyChart';
import { getDailyCounts, getSince, getWeekSummary } from '../db';
import { CATEGORY_MAP } from '../lib/constants';
import { startOfDay } from '../lib/date';

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}

export default function StatsPage() {
  const today = useLiveQuery(() => getSince(startOfDay().getTime()), []);
  const week = useLiveQuery(getWeekSummary, []);
  const daily = useLiveQuery(() => getDailyCounts(7), []);

  const top = week && Object.entries(week.byCategory).sort((a, b) => b[1] - a[1])[0];
  const topCat = top && CATEGORY_MAP[top[0]];

  return (
    <section className="space-y-5 px-4 py-6">
      <h1 className="text-xl font-bold text-slate-900">Statistik</h1>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Hari ini" value={today?.length ?? 0} />
        <StatCard label="Minggu ini" value={week?.total ?? 0} />
      </div>

      {topCat && (
        <p className="rounded-2xl bg-white p-4 text-sm text-slate-600 ring-1 ring-slate-100">
          Gangguan terbanyak minggu ini:{' '}
          <strong className="text-slate-900">
            {topCat.emoji} {topCat.label}
          </strong>{' '}
          ({top[1]}x)
        </p>
      )}

      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h2 className="mb-3 font-semibold text-slate-800">7 hari terakhir</h2>
        <WeeklyChart data={daily ?? []} />
      </div>
    </section>
  );
}
