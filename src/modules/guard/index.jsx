import HistoryPage from './pages/HistoryPage';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';

/** Manifest modul FocusGuard. */
export default {
  id: 'guard',
  order: 1,
  name: 'FocusGuard',
  description: 'Catat gangguan fokus dan lihat polanya.',
  icon: '🙋',
  accent: 'text-indigo-600',
  maxWidth: 'max-w-xl',
  routes: [
    { index: true, label: 'Catat', icon: '➕', Component: HomePage },
    { path: 'riwayat', label: 'Riwayat', icon: '🕘', Component: HistoryPage },
    { path: 'statistik', label: 'Statistik', icon: '📊', Component: StatsPage },
  ],
};
