import { useLiveQuery } from 'dexie-react-hooks';
import TimerRing from '../components/TimerRing';
import { useTimer } from '../context/TimerContext';
import { getTasks } from '../db';
import { formatClock } from '../lib/date';

export default function TimerPage() {
  const { phase, status, msLeft, durationMs, task, setTask, start, pause, reset, skip } = useTimer();
  const tasks = useLiveQuery(async () => (await getTasks()).filter((t) => !t.done), [], []);

  const isWork = phase === 'work';
  const running = status === 'running';
  const paused = status === 'paused';

  const handleSelect = (e) => {
    const picked = tasks.find((t) => String(t.id) === e.target.value);
    setTask(picked ? { id: picked.id, title: picked.title } : null);
  };

  return (
    <section className="flex flex-col items-center gap-6 px-4 py-6">
      <div className="flex rounded-full bg-slate-200/70 p-1 text-sm font-medium">
        <span className={`rounded-full px-5 py-1.5 transition ${isWork ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>
          Fokus
        </span>
        <span className={`rounded-full px-5 py-1.5 transition ${!isWork ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>
          Istirahat
        </span>
      </div>

      <TimerRing
        progress={1 - msLeft / durationMs}
        time={formatClock(msLeft)}
        tone={isWork ? 'rose' : 'emerald'}
      />

      <div className="w-full max-w-sm">
        <label htmlFor="task" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
          Tugas yang dikerjakan
        </label>
        <select
          id="task"
          value={task?.id ?? ''}
          onChange={handleSelect}
          disabled={running}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:opacity-60"
        >
          <option value="">— Tanpa tugas —</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex w-full max-w-sm items-center gap-3">
        <button
          onClick={reset}
          disabled={status === 'idle'}
          className="flex-1 rounded-2xl bg-white py-3 font-medium text-slate-600 ring-1 ring-slate-200 transition active:scale-95 disabled:opacity-40"
        >
          Reset
        </button>
        <button
          onClick={running ? pause : start}
          className="flex-[2] rounded-2xl bg-rose-600 py-3 text-lg font-semibold text-white shadow-lg shadow-rose-500/30 transition active:scale-95"
        >
          {running ? 'Jeda' : paused ? 'Lanjut' : 'Mulai'}
        </button>
        <button
          onClick={skip}
          disabled={running}
          className="flex-1 rounded-2xl bg-white py-3 font-medium text-slate-600 ring-1 ring-slate-200 transition active:scale-95 disabled:opacity-40"
        >
          Lewati
        </button>
      </div>

      <p className="max-w-sm text-center text-sm text-slate-500">
        {task ? (
          <>
            Sedang fokus pada <strong className="text-slate-800">{task.title}</strong>.
          </>
        ) : (
          'Pilih tugas agar setiap sesi tercatat per tugas.'
        )}
      </p>
    </section>
  );
}
