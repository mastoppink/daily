import { useState } from 'react';
import { QUADRANTS } from '../lib/quadrants';

const inputClass =
  'w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100';

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </label>
  );
}

/** Modal tambah/edit tugas. Juga jadi jalur alternatif memindah kuadran (selain drag). */
export default function TaskForm({ task, defaultQuadrant = 'q1', onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    dueDate: task?.dueDate ?? '',
    quadrant: task?.quadrant ?? defaultQuadrant,
    completed: task?.completed ?? false,
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate || null,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-md space-y-4 overflow-y-auto rounded-t-3xl bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl"
      >
        <h2 className="text-lg font-semibold text-slate-900">{task ? 'Edit tugas' : 'Tugas baru'}</h2>

        <Field label="Judul">
          <input
            autoFocus
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            maxLength={120}
            className={inputClass}
          />
        </Field>

        <Field label="Deskripsi (opsional)">
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tenggat (opsional)">
            <input type="date" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Kuadran">
            <select value={form.quadrant} onChange={(e) => set('quadrant', e.target.value)} className={inputClass}>
              {QUADRANTS.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.completed}
            onChange={(e) => set('completed', e.target.checked)}
            className="h-4 w-4 accent-violet-600"
          />
          Sudah selesai
        </label>

        <div className="flex items-center gap-3 pt-2">
          {task && (
            <button type="button" onClick={onDelete} className="mr-auto text-sm font-medium text-rose-500">
              Hapus
            </button>
          )}
          <button type="button" onClick={onClose} className="flex-1 rounded-2xl py-3 font-medium text-slate-600 ring-1 ring-slate-200">
            Batal
          </button>
          <button type="submit" className="flex-1 rounded-2xl bg-violet-600 py-3 font-semibold text-white active:scale-95">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
