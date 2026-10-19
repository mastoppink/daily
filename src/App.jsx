import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './core/HomePage';
import ModuleShell from './core/ModuleShell';
import { MODULES } from './core/registry';

/**
 * Provider dari setiap modul (mis. TimerProvider) dipasang di level atas,
 * supaya state-nya tetap hidup saat pengguna pindah antar modul.
 */
const ProviderTree = MODULES.reduce(
  (Outer, mod) => {
    if (!mod.Provider) return Outer;
    const Inner = mod.Provider;
    return function Composed({ children }) {
      return (
        <Outer>
          <Inner>{children}</Inner>
        </Outer>
      );
    };
  },
  ({ children }) => children,
);

export default function App() {
  return (
    <ProviderTree>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {MODULES.map((mod) => (
          <Route key={mod.id} path={`/m/${mod.id}/*`} element={<ModuleShell mod={mod} />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProviderTree>
  );
}
