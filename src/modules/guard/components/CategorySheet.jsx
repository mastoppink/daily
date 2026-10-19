import { useState } from 'react';
import { CATEGORIES } from '../lib/constants';
import { addDistraction } from '../db';

/** Bottom sheet: pilih kategori → tulis catatan opsional → simpan. */
export default function CategorySheet({ onClose, onSaved }) {
  const [category, setCategory] = useState(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!category || saving) return;
    setSaving(true);
    await addDistraction({ category: category.id, note });
    onSaved();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-t-3xl bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />

        {!category ? (
          <>
            <h2 className="text-lg font-semibold text-slate-900">Apa yang mengganggumu?</h2>
            <p className="mb-4 text-sm text-slate-500">Pilih kategori cepat.</p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c)}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 active:scale-95"
                >
                  <span className="text-2xl">{c.emoji}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setCategory(null)} className="mb-3 text-sm font-medium text-indigo-600">
              ← Ganti kategori
            </button>
            <h2 className="text-lg font-semibold text-slate-900">
              {category.emoji} {category.label}
            </h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder="Catatan singkat (opsional)"
              className="mt-4 w-full resize-none rounded-2xl border border-slate-200 p-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <button
              onClick={save}
              disabled={saving}
              className="mt-4 w-full rounded-2xl bg-indigo-600 py-3 font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
            >
              Simpan
            </button>
          </>
        )}
      </div>
    </div>
  );
}
