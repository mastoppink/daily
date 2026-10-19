import { useLiveQuery } from 'dexie-react-hooks';
import DistractionItem from '../components/DistractionItem';
import { deleteDistraction, getSince } from '../db';
import { formatDate, startOfDay } from '../lib/date';

export default function HistoryPage() {
  const items = useLiveQuery(() => getSince(startOfDay().getTime()), []);

  const handleDelete = (id) => {
    if (window.confirm('Hapus catatan ini?')) deleteDistraction(id);
  };

  return (
    <section className="px-4 py-6">
      <h1 className="text-xl font-bold text-slate-900">Riwayat Hari Ini</h1>
      <p className="mb-5 text-sm text-slate-500">{formatDate(Date.now())}</p>

      {items?.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
          Belum ada gangguan tercatat hari ini. 🎉
        </div>
      )}

      {items?.length > 0 && (
        <ul className="space-y-3">
          {items.map((item) => (
            <DistractionItem key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </section>
  );
}
