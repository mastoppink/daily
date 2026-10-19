export const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

/** Awal minggu = Senin. */
export const startOfWeek = (date = new Date()) => {
  const d = startOfDay(date);
  return addDays(d, -((d.getDay() + 6) % 7));
};

export const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

export const formatDate = (ts) =>
  new Date(ts).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
