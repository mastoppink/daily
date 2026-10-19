import { CATEGORY_MAP } from '../lib/constants';
import { formatTime } from '../lib/date';

export default function DistractionItem({ item, onDelete }) {
  const cat = CATEGORY_MAP[item.category] ?? CATEGORY_MAP.other;

  return (
    <li className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <span className="text-2xl">{cat.emoji}</span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-medium text-slate-800">{cat.label}</p>
          <time className="shrink-0 text-xs text-slate-400">{formatTime(item.createdAt)}</time>
        </div>
        {item.note && <p className="mt-1 break-words text-sm text-slate-500">{item.note}</p>}
      </div>

      <button
        onClick={() => onDelete(item.id)}
        aria-label="Hapus catatan"
        className="rounded-lg p-1 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
      >
        ✕
      </button>
    </li>
  );
}
