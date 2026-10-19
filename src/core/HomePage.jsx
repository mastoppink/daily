import { Link } from 'react-router-dom';
import { MODULES } from './registry';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Focus Suite</h1>
        <p className="text-sm text-slate-500">Pilih modul untuk mulai.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map((mod) => (
          <Link
            key={mod.id}
            to={`/m/${mod.id}`}
            className="flex items-start gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md active:scale-[0.99]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              {mod.icon}
            </span>
            <div className="min-w-0">
              <h2 className="font-semibold text-slate-900">{mod.name}</h2>
              <p className="text-sm text-slate-500">{mod.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
