import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { useTimer } from '../context/TimerContext';
import { addTask, deleteTask, getPomodoroCounts, getTasks, updateTask } from '../db';

export default function TasksPage() {
  const navigate = useNavigate();
  const { setTask } = useTimer();
  const data = useLiveQuery(
    async () => ({ tasks: await getTasks(), counts: await getPomodoroCounts() }),
    [],
  );

  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');

  // Tugas aktif di atas, yang sudah selesai di bawah (urutan terbaru tetap terjaga).
  const tasks = [...(data?.tasks ?? [])].sort((a, b) => Number(a.done) - Number(b.done));
  const activeCount = tasks.filter((t) => !t.done).length;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title);
    setTitle('');
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setDraft(task.title);
  };

  const commitEdit = (id) => {
    if (draft.trim()) updateTask(id, { title: draft.trim() });
    setEditingId(null);
  };

  const handleDelete = (task) => {
    if (window.confirm(`Hapus tugas "${task.title}"? Riwayat sesinya tetap tersimpan.`)) {
      deleteTask(task.id);
    }
  };

  const focusOn = (task) => {
    setTask({ id: task.id, title: task.title });
    navigate('/m/pomodoro/fokus');
  };

  return (
    <section className="space-y-5 px-4 py-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Tugas</h1>
        <p className="text-sm text-slate-500">{activeCount} tugas aktif</p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tambah tugas baru…"
          maxLength={120}
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
        />
        <button type="submit" className="rounded-2xl bg-rose-600 px-5 font-semibold text-white transition active:scale-95">
          Tambah
        </button>
      </form>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
          Belum ada tugas. Tambahkan satu untuk mulai fokus.
        </div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => {
            const isEditing = editingId === task.id;
            return (
              <li key={task.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => updateTask(task.id, { done: !task.done })}
                  aria-label="Tandai selesai"
                  className="h-5 w-5 shrink-0 accent-rose-600"
                />

                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <input
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={() => commitEdit(task.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitEdit(task.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="w-full border-b border-rose-400 bg-transparent text-sm focus:outline-none"
                    />
                  ) : (
                    <p className={`truncate text-sm font-medium ${task.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </p>
                  )}
                  <p className="text-xs text-slate-400">🍅 {data?.counts[task.id] ?? 0} pomodoro</p>
                </div>

                {!task.done && !isEditing && (
                  <button
                    onClick={() => focusOn(task)}
                    className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition active:scale-95"
                  >
                    Fokus
                  </button>
                )}
                {!isEditing && (
                  <button onClick={() => startEdit(task)} aria-label="Edit" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                    ✎
                  </button>
                )}
                <button onClick={() => handleDelete(task)} aria-label="Hapus" className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500">
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
