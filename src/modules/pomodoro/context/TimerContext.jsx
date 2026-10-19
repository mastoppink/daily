import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { addSession, DEFAULT_SETTINGS, getSettings } from '../db';
import { formatClock } from '../lib/date';
import { notify } from '../lib/notify';
import { playChime } from '../lib/sound';

const TimerContext = createContext(null);

/**
 * Menyimpan state timer. Waktu dihitung dari `endAt` (timestamp), bukan hitungan tick,
 * sehingga tetap akurat walau tab di-background atau layar terkunci.
 */
export function TimerProvider({ children }) {
  const settings = useLiveQuery(getSettings, [], DEFAULT_SETTINGS);

  const [phase, setPhase] = useState('work'); // 'work' | 'break'
  const [status, setStatus] = useState('idle'); // 'idle' | 'running' | 'paused'
  const [task, setTask] = useState(null); // { id, title } | null
  const [endAt, setEndAt] = useState(0);
  const [pausedLeft, setPausedLeft] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const durationMs = (phase === 'work' ? settings.workMinutes : settings.breakMinutes) * 60_000;
  const msLeft =
    status === 'running' ? Math.max(0, endAt - now) : status === 'paused' ? pausedLeft : durationMs;

  const finish = useCallback(() => {
    if (phase === 'work') {
      addSession({
        type: 'work',
        taskId: task?.id ?? null,
        taskTitle: task?.title ?? 'Tanpa tugas',
        minutes: settings.workMinutes,
      });
      notify('Fokus selesai 🍅', task ? `Tugas: ${task.title}. Waktunya istirahat.` : 'Waktunya istirahat.');
    } else {
      addSession({ type: 'break', taskId: task?.id ?? null, taskTitle: task?.title ?? 'Istirahat', minutes: settings.breakMinutes });
      notify('Istirahat selesai ⏰', 'Siap untuk sesi fokus berikutnya?');
    }
    playChime();
    setPhase(phase === 'work' ? 'break' : 'work');
    setStatus('idle');
  }, [phase, task, settings.workMinutes, settings.breakMinutes]);

  useEffect(() => {
    if (status !== 'running') return undefined;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= endAt) finish();
    }, 250);
    return () => clearInterval(id);
  }, [status, endAt, finish]);

  useEffect(() => {
    document.title = status === 'running' ? `${formatClock(msLeft)} · Focus Suite` : 'Focus Suite';
  }, [status, msLeft]);

  const start = () => {
    setNow(Date.now());
    setEndAt(Date.now() + msLeft);
    setStatus('running');
  };

  const pause = () => {
    setPausedLeft(Math.max(0, endAt - Date.now()));
    setStatus('paused');
  };

  const reset = () => setStatus('idle');

  /** Lewati fase tanpa mencatat sesi. */
  const skip = () => {
    setPhase((p) => (p === 'work' ? 'break' : 'work'));
    setStatus('idle');
  };

  return (
    <TimerContext.Provider
      value={{ phase, status, msLeft, durationMs, task, setTask, settings, start, pause, reset, skip }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer harus digunakan di dalam TimerProvider');
  return ctx;
}
