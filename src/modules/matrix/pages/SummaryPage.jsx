import { useLiveQuery } from 'dexie-react-hooks';
import { getTasks } from '../db';
import { todayISO } from '../lib/dates';
import { QUADRANTS } from '../lib/quadrants';

function StatCard({ label, value, tone = 'text-slate-900' }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-3xl font-bold tabular-nums ${tone}`}>{value}</p>
    </div>
  );
}

export default function SummaryPage() {
  const tasks = useLiveQuery(getTasks, [], []);
  const today = todayISO();

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < today).length;
  const rate = total ? Math.round((done / total) * 100) : 0;

  return (
    <section className="space-y-5 px-4 py-6">
      <h1 className="text-xl font-bold text-slate-900">Ringkasan</h1>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total" value={total} />
        <StatCard label="Selesai" value={done} tone="text-emerald-600" />
        <StatCard label="Lewat" value={overdue} tone="text-rose-500" />
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-slate-700">Tingkat penyelesaian</span>
          <span className="font-semibold text-violet-600">{rate}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-violet-600 transition-all" style={{ width: `${rate}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-slate-800">Per kuadran (tugas aktif)</h2>
        {QUADRANTS.map((q) => {
          const active = tasks.filter((t) => t.quadrant === q.id && !t.completed).length;
          return (
            <div key={q.id} className={`flex items-center justify-between rounded-2xl border p-4 ${q.tone}`}>
              <div>
                <p className="text-sm font-semibold text-slate-800">{q.title}</p>
                <p className="text-xs text-slate-500">{q.subtitle}</p>
              </div>
              <span className="text-2xl font-bold tabular-nums text-slate-900">{active}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
