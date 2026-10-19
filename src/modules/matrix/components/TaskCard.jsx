import { useDraggable } from '@dnd-kit/core';
import { formatDueDate, todayISO } from '../lib/dates';

/** Tampilan kartu tugas (dipakai juga di DragOverlay). Hanya ikon ⠿ yang memicu drag. */
export function TaskBody({ task, onOpen, onToggle, handleProps }) {
  const overdue = !task.completed && !!task.dueDate && task.dueDate < todayISO();

  return (
    <div className="flex items-start gap-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <button
        {...handleProps}
        aria-label="Seret tugas"
        className="touch-none cursor-grab select-none rounded-md px-1 text-lg leading-none text-slate-300 active:cursor-grabbing"
      >
        ⠿
      </button>

      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle?.(task)}
        aria-label="Tandai selesai"
        className="mt-1 h-4 w-4 shrink-0 accent-violet-600"
      />

      <button onClick={() => onOpen?.(task)} className="min-w-0 flex-1 text-left">
        <p className={`truncate text-sm font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
          {task.title}
        </p>
        {task.dueDate && (
          <p className={`text-xs ${overdue ? 'font-medium text-rose-500' : 'text-slate-400'}`}>
            📅 {formatDueDate(task.dueDate)}
            {overdue && ' · lewat tenggat'}
          </p>
        )}
      </button>
    </div>
  );
}

export default function TaskCard({ task, onOpen, onToggle }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `task-${task.id}`,
    data: { taskId: task.id },
  });

  return (
    <li ref={setNodeRef} className={isDragging ? 'opacity-40' : ''}>
      <TaskBody
        task={task}
        onOpen={onOpen}
        onToggle={onToggle}
        handleProps={{ ...attributes, ...listeners }}
      />
    </li>
  );
}
