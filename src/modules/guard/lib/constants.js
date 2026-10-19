export const CATEGORIES = [
  { id: 'social', label: 'Sosial Media', emoji: '📱' },
  { id: 'chat', label: 'Chat / Messaging', emoji: '💬' },
  { id: 'video', label: 'YouTube / Video', emoji: '▶️' },
  { id: 'email', label: 'Email', emoji: '✉️' },
  { id: 'other', label: 'Lainnya', emoji: '🔖' },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
