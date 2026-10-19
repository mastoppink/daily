import { useLiveQuery } from 'dexie-react-hooks';
import { getDailyWork, getSessionsSince } from '../db';
import { formatTime, startOfDay } from '../lib/date';

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}

export default function StatsPage() {
  const sessions = useLiveQuery(() => getSessionsSince(startOfDay().getTime()), [], []);
  const daily = useLiveQuery(() => getDailyWork(7), [], []);

  const workToday = sessions.filter((s) => s.type === 'work');
  const focusMinutes = workToday.reduce((sum, s) => sum + s.minutes, 0);
  const maxDaily = Math.max(1, ...daily.map((d) => d.count));

  return (
    <section className="space-y-5 px-4 py-6">
      <h1 className="text-xl font-bold text-slate-900">Statistik</h1>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Pomodoro hari ini" value={workToday.length} />
        <StatCard label="Menit fokus" value={focusMinutes} />
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h2 className="mb-4 font-semibold text-slate-800">7 hari terakhir</h2>
        <div className="flex gap-2">
          {daily.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium text-slate-500">{d.count}</span>
              <div className="flex h-32 w-full items-end">
                <div
                  className="w-full rounded-t-lg bg-rose-500/80 transition-all"
                  style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count ? 6 : 2 }}
                />
              </div>
              <span className="text-xs text-slate-400">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-semibold text-slate-800">Riwayat sesi hari ini</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada sesi hari ini.</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-slate-100">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">
                    {s.type === 'work' ? '🍅 Fokus' : '☕ Istirahat'} · {s.taskTitle}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatTime(s.completedAt)} · {s.minutes} menit
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
