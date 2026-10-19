import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

export default function Quadrant({ quadrant, tasks, onOpen, onToggle, onAdd }) {
  const { setNodeRef, isOver } = useDroppable({ id: quadrant.id });
  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[12rem] flex-col rounded-3xl border p-3 transition ${quadrant.tone} ${
        isOver ? 'ring-2 ring-violet-400' : ''
      }`}
    >
      <header className="mb-3 flex items-start justify-between gap-2 px-1">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">{quadrant.title}</h2>
          <p className="text-xs text-slate-500">
            {quadrant.subtitle} · {activeCount} aktif
          </p>
        </div>
        <button
          onClick={onAdd}
          aria-label={`Tambah tugas ke ${quadrant.title}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-lg text-slate-500 shadow-sm ring-1 ring-slate-200 active:scale-95"
        >
          +
        </button>
      </header>

      <ul className="flex-1 space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onOpen={onOpen} onToggle={onToggle} />
        ))}

        {tasks.length === 0 && (
          <li className="rounded-2xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
            Seret tugas ke sini
          </li>
        )}
      </ul>
    </div>
  );
}
