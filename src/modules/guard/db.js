import Dexie from 'dexie';
import { addDays, startOfDay, startOfWeek } from './lib/date';

export const db = new Dexie('focusguard');

db.version(1).stores({
  // createdAt diindeks untuk query rentang waktu; category untuk agregasi.
  distractions: '++id, createdAt, category',
});

export const addDistraction = ({ category, note = '' }) =>
  db.distractions.add({ category, note: note.trim(), createdAt: Date.now() });

export const deleteDistraction = (id) => db.distractions.delete(id);

/** Semua catatan sejak timestamp `fromTs`, terbaru di atas. */
export const getSince = (fromTs) =>
  db.distractions.where('createdAt').aboveOrEqual(fromTs).reverse().toArray();

/** Jumlah gangguan per hari untuk N hari terakhir (termasuk hari ini). */
export async function getDailyCounts(days = 7) {
  const first = addDays(startOfDay(), -(days - 1));
  const rows = await getSince(first.getTime());

  return Array.from({ length: days }, (_, i) => {
    const from = addDays(first, i).getTime();
    const to = addDays(first, i + 1).getTime();
    return {
      label: new Date(from).toLocaleDateString('id-ID', { weekday: 'short' }),
      count: rows.filter((r) => r.createdAt >= from && r.createdAt < to).length,
    };
  });
}

/** Ringkasan minggu ini (mulai Senin): total dan jumlah per kategori. */
export async function getWeekSummary() {
  const rows = await getSince(startOfWeek().getTime());
  const byCategory = rows.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {});
  return { total: rows.length, byCategory };
}
