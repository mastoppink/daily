import Dexie from 'dexie';

export const db = new Dexie('focusmatrix');

db.version(1).stores({
  // quadrant & dueDate diindeks untuk filter; completed cukup disimpan sebagai boolean.
  tasks: '++id, quadrant, dueDate, createdAt',
});

export const getTasks = () => db.tasks.orderBy('createdAt').reverse().toArray();

export const addTask = (data) => {
  const now = Date.now();
  return db.tasks.add({
    title: '',
    description: '',
    dueDate: null,
    quadrant: 'q1',
    completed: false,
    ...data,
    createdAt: now,
    updatedAt: now,
  });
};

export const updateTask = (id, patch) => db.tasks.update(id, { ...patch, updatedAt: Date.now() });

export const deleteTask = (id) => db.tasks.delete(id);
