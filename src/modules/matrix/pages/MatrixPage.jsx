import { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useLiveQuery } from 'dexie-react-hooks';
import Quadrant from '../components/Quadrant';
import TaskForm from '../components/TaskForm';
import { TaskBody } from '../components/TaskCard';
import { addTask, deleteTask, getTasks, updateTask } from '../db';
import { byPriority, todayISO, weekRange } from '../lib/dates';
import { QUADRANTS } from '../lib/quadrants';

const FILTERS = [
  { id: 'all', label: 'Semua' },
  { id: 'today', label: 'Hari Ini' },
  { id: 'week', label: 'Minggu Ini' },
  { id: 'completed', label: 'Completed' },
];

export default function MatrixPage() {
  const tasks = useLiveQuery(getTasks, [], []);
  const [filter, setFilter] = useState('all');
  const [dragging, setDragging] = useState(null);
  const [modal, setModal] = useState(null); // null | { mode: 'new', quadrant } | { mode: 'edit', task }

  // PointerSensor + jarak 6px: klik biasa tidak langsung memicu drag.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const today = todayISO();
  const [weekStart, weekEnd] = weekRange();
  const visible = (tasks ?? []).filter((t) => {
    switch (filter) {
      case 'today':
        return t.dueDate === today;
      case 'week':
        return !!t.dueDate && t.dueDate >= weekStart && t.dueDate <= weekEnd;
      case 'completed':
        return t.completed;
      default:
        return true;
    }
  });

  const handleDragStart = ({ active }) => {
    setDragging(tasks.find((t) => t.id === active.data.current.taskId) ?? null);
  };

  const handleDragEnd = ({ active, over }) => {
    setDragging(null);
    if (!over) return;
    const task = tasks.find((t) => t.id === active.data.current.taskId);
    if (task && task.quadrant !== over.id) updateTask(task.id, { quadrant: over.id });
  };

  const handleSave = async (data) => {
    if (modal.mode === 'new') await addTask(data);
    else await updateTask(modal.task.id, data);
    setModal(null);
  };

  const handleDelete = () => {
    if (window.confirm('Hapus tugas ini?')) {
      deleteTask(modal.task.id);
      setModal(null);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setDragging(null)}
    >
      <section className="space-y-5 px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Matriks Eisenhower</h1>
            <p className="text-sm text-slate-500">Seret ⠿ tugas ke kuadran yang sesuai.</p>
          </div>
          <button
            onClick={() => setModal({ mode: 'new', quadrant: 'q1' })}
            className="shrink-0 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 active:scale-95"
          >
            + Tugas
          </button>
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === f.id ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {QUADRANTS.map((q) => (
            <Quadrant
              key={q.id}
              quadrant={q}
              tasks={visible.filter((t) => t.quadrant === q.id).sort(byPriority)}
              onOpen={(task) => setModal({ mode: 'edit', task })}
              onToggle={(task) => updateTask(task.id, { completed: !task.completed })}
              onAdd={() => setModal({ mode: 'new', quadrant: q.id })}
            />
          ))}
        </div>
      </section>

      <DragOverlay>{dragging && <div className="w-72 rotate-2"><TaskBody task={dragging} /></div>}</DragOverlay>

      {modal && (
        <TaskForm
          task={modal.mode === 'edit' ? modal.task : null}
          defaultQuadrant={modal.quadrant}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </DndContext>
  );
}
