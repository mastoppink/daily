import { TimerProvider } from './context/TimerContext';
import SettingsPage from './pages/SettingsPage';
import StatsPage from './pages/StatsPage';
import TasksPage from './pages/TasksPage';
import TimerPage from './pages/TimerPage';

/** Manifest modul FocusPomodoro. `Provider` dipasang global agar timer tetap berjalan. */
export default {
  id: 'pomodoro',
  order: 2,
  name: 'FocusPomodoro',
  description: 'Timer Pomodoro dengan daftar tugas dan riwayat sesi.',
  icon: '🍅',
  accent: 'text-rose-600',
  maxWidth: 'max-w-xl',
  Provider: TimerProvider,
  routes: [
    { index: true, label: 'Tugas', icon: '📝', Component: TasksPage },
    { path: 'fokus', label: 'Fokus', icon: '⏱️', Component: TimerPage },
    { path: 'statistik', label: 'Statistik', icon: '📊', Component: StatsPage },
    { path: 'pengaturan', label: 'Pengaturan', icon: '⚙️', Component: SettingsPage },
  ],
};
