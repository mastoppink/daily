import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { DEFAULT_SETTINGS, getSettings, saveSettings } from '../db';
import { requestNotifications } from '../lib/notify';

const clamp = (value) => Math.min(120, Math.max(1, Math.round(Number(value)) || 1));

const FIELDS = [
  { key: 'workMinutes', label: 'Durasi fokus (menit)' },
  { key: 'breakMinutes', label: 'Durasi istirahat (menit)' },
];

export default function SettingsPage() {
  const saved = useLiveQuery(getSettings, [], DEFAULT_SETTINGS);
  const [draft, setDraft] = useState(null);
  const [message, setMessage] = useState('');
  const [permission, setPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported',
  );

  const current = draft ?? saved;

  const flash = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleSave = async () => {
    await saveSettings({ workMinutes: clamp(current.workMinutes), breakMinutes: clamp(current.breakMinutes) });
    setDraft(null);
    flash('Pengaturan tersimpan ✓');
  };

  const handleReset = async () => {
    await saveSettings(DEFAULT_SETTINGS);
    setDraft(null);
    flash('Dikembalikan ke default ✓');
  };

  const handleNotif = async () => setPermission(await requestNotifications());

  return (
    <section className="space-y-6 px-4 py-6">
      <h1 className="text-xl font-bold text-slate-900">Pengaturan</h1>

      <div className="space-y-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h2 className="font-semibold text-slate-800">Durasi timer</h2>

        {FIELDS.map(({ key, label }) => (
          <label key={key} className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600">{label}</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={120}
              value={current?.[key] ?? ''}
              onChange={(e) => setDraft({ ...current, [key]: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
          </label>
        ))}

        <div className="flex gap-3 pt-2">
          <button onClick={handleReset} className="flex-1 rounded-2xl py-3 font-medium text-slate-600 ring-1 ring-slate-200 active:scale-95">
            Default
          </button>
          <button onClick={handleSave} className="flex-[2] rounded-2xl bg-rose-600 py-3 font-semibold text-white active:scale-95">
            Simpan
          </button>
        </div>

        {message && <p className="text-center text-sm text-emerald-600">{message}</p>}
      </div>

      <div className="space-y-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h2 className="font-semibold text-slate-800">Notifikasi</h2>
        <p className="text-sm text-slate-500">
          Status: <strong>{permission === 'granted' ? 'Diizinkan' : permission === 'denied' ? 'Diblokir' : permission === 'unsupported' ? 'Tidak didukung' : 'Belum diatur'}</strong>
        </p>
        {permission === 'default' && (
          <button onClick={handleNotif} className="w-full rounded-2xl bg-slate-900 py-3 font-medium text-white active:scale-95">
            Izinkan notifikasi
          </button>
        )}
      </div>
    </section>
  );
}
