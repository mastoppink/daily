import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import CategorySheet from '../components/CategorySheet';
import { getSince } from '../db';
import { startOfDay } from '../lib/date';

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const today = useLiveQuery(() => getSince(startOfDay().getTime()), []);

  const handleSaved = () => {
    setOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-8">
      <div className="text-center">
        <p className="text-sm text-slate-500">Gangguan hari ini</p>
        <p className="text-5xl font-bold tabular-nums text-slate-900">{today?.length ?? '–'}</p>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="flex aspect-square w-full max-w-xs flex-col items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/30 transition active:scale-95"
      >
        <span className="text-5xl">🙋</span>
        <span className="mt-3 text-xl font-semibold">Saya Terdistraksi</span>
      </button>

      <p className="max-w-xs text-center text-sm text-slate-500">
        Tekan setiap kali fokusmu terpecah. Menyadarinya adalah langkah pertama.
      </p>

      {open && <CategorySheet onClose={() => setOpen(false)} onSaved={handleSaved} />}

      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-2 text-sm text-white shadow-lg">
          ✓ Tercatat
        </div>
      )}
    </div>
  );
}
