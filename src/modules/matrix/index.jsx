import MatrixPage from './pages/MatrixPage';
import SummaryPage from './pages/SummaryPage';

/** Manifest modul FocusMatrix. */
export default {
  id: 'matrix',
  order: 3,
  name: 'FocusMatrix',
  description: 'To-do dengan Matriks Eisenhower: seret tugas ke kuadran prioritas.',
  icon: '🟪',
  accent: 'text-violet-600',
  maxWidth: 'max-w-5xl',
  routes: [
    { index: true, label: 'Matriks', icon: '🟪', Component: MatrixPage },
    { path: 'ringkasan', label: 'Ringkasan', icon: '📈', Component: SummaryPage },
  ],
};
