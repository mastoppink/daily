import { Link, NavLink, Route, Routes } from 'react-router-dom';

/** URL absolut untuk sebuah rute di dalam modul. */
const pathOf = (mod, route) => (route.index ? `/m/${mod.id}` : `/m/${mod.id}/${route.path}`);

/** Kerangka satu modul: header, rute internal, dan bottom nav milik modul tersebut. */
export default function ModuleShell({ mod }) {
  const width = mod.maxWidth ?? 'max-w-xl';

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-slate-50/80 backdrop-blur">
        <div className={`mx-auto flex ${width} items-center gap-3 px-4 py-3`}>
          <Link
            to="/"
            aria-label="Kembali ke beranda"
            className="rounded-xl px-2 py-1 text-lg text-slate-500 transition hover:bg-slate-100"
          >
            ←
          </Link>
          <span className={`font-bold tracking-tight ${mod.accent}`}>
            {mod.icon} {mod.name}
          </span>
        </div>
      </header>

      <main className={`mx-auto flex w-full ${width} flex-1 flex-col pb-24`}>
        <Routes>
          {mod.routes.map((route) => (
            <Route
              key={route.index ? 'index' : route.path}
              {...(route.index ? { index: true } : { path: route.path })}
              element={<route.Component />}
            />
          ))}
        </Routes>
      </main>

      <nav
        className={`fixed inset-x-0 bottom-0 z-10 mx-auto flex ${width} border-t border-slate-200 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur`}
      >
        {mod.routes.map((route) => (
          <NavLink
            key={route.index ? 'index' : route.path}
            to={pathOf(mod, route)}
            end
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition ${
                isActive ? mod.accent : 'text-slate-400'
              }`
            }
          >
            <span className="text-lg">{route.icon}</span>
            {route.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
