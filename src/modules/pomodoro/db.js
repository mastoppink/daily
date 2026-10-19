import Dexie from 'dexie';
import { addDays, startOfDay } from './lib/date';

export const db = new Dexie('focuspomodoro');

db.version(1).stores({
  tasks: '++id, createdAt',
  // taskTitle disimpan sebagai snapshot, sehingga riwayat tetap terbaca meski tugas dihapus.
  sessions: '++id, taskId, type, completedAt',
  settings: 'key',
});

export const DEFAULT_SETTINGS = { workMinutes: 25, breakMinutes: 5 };

/* ---------- Tugas ---------- */

export const getTasks = () => db.tasks.orderBy('createdAt').reverse().toArray();

export const addTask = (title) =>
  db.tasks.add({ title: title.trim(), done: false, createdAt: Date.now() });

export const updateTask = (id, patch) => db.tasks.update(id, patch);

export const deleteTask = (id) => db.tasks.delete(id);

/* ---------- Sesi (riwayat fokus & istirahat) ---------- */

export const addSession = ({ type, taskId, taskTitle, minutes }) =>
  db.sessions.add({ type, taskId, taskTitle, minutes, completedAt: Date.now() });

export const getSessionsSince = (fromTs) =>
  db.sessions.where('completedAt').aboveOrEqual(fromTs).reverse().toArray();

/** Map { taskId: jumlahPomodoro } dari seluruh riwayat fokus. */
export async function getPomodoroCounts() {
  const rows = await db.sessions.where('type').equals('work').toArray();
  return rows.reduce((acc, s) => {
    if (s.taskId != null) acc[s.taskId] = (acc[s.taskId] ?? 0) + 1;
    return acc;
  }, {});
}

/** Jumlah pomodoro selesai per hari untuk N hari terakhir. */
export async function getDailyWork(days = 7) {
  const first = addDays(startOfDay(), -(days - 1));
  const rows = (await getSessionsSince(first.getTime())).filter((s) => s.type === 'work');

  return Array.from({ length: days }, (_, i) => {
    const from = addDays(first, i).getTime();
    const to = addDays(first, i + 1).getTime();
    return {
      label: new Date(from).toLocaleDateString('id-ID', { weekday: 'short' }),
      count: rows.filter((r) => r.completedAt >= from && r.completedAt < to).length,
    };
  });
}

/* ---------- Pengaturan ---------- */

export const getSettings = async () =>
  (await db.settings.get('main')) ?? { key: 'main', ...DEFAULT_SETTINGS };

export const saveSettings = async (patch) =>
  db.settings.put({ ...(await getSettings()), ...patch, key: 'main' });
