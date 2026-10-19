/** Date → "YYYY-MM-DD" memakai zona waktu lokal (bukan UTC). */
export const toISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const todayISO = () => toISO(new Date());

export const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

/** Rentang minggu ini (Senin–Minggu) sebagai [startISO, endISO]. */
export const weekRange = () => {
  const now = new Date();
  const start = addDays(now, -((now.getDay() + 6) % 7));
  return [toISO(start), toISO(addDays(start, 6))];
};

export const formatDueDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

/** Urutkan: tugas aktif dulu, lalu berdasarkan tenggat terdekat (tanpa tenggat di akhir). */
export const byPriority = (a, b) =>
  Number(a.completed) - Number(b.completed) ||
  (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31');
