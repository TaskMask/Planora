import type { Label } from '../types';

export const defaultLabels: Omit<Label, 'id' | 'boardId'>[] = [
  { name: 'Bug', color: '#ef4444' }, // red-500
  { name: 'Feature', color: '#3b82f6' }, // blue-500
  { name: 'Enhancement', color: '#10b981' }, // emerald-500
  { name: 'Documentation', color: '#8b5cf6' }, // violet-500
  { name: 'Urgent', color: '#f59e0b' }, // amber-500
  { name: 'Review', color: '#06b6d4' }, // cyan-500
  { name: 'Testing', color: '#ec4899' }, // pink-500
  { name: 'Backend', color: '#6366f1' }, // indigo-500
  { name: 'Frontend', color: '#84cc16' }, // lime-500
  { name: 'Design', color: '#f97316' }, // orange-500
  { name: 'Research', color: '#14b8a6' }, // teal-500
  { name: 'Meeting', color: '#a855f7' }, // purple-500
];

export const priorityColors = {
  low: '#6b7280', // gray-500
  medium: '#3b82f6', // blue-500
  high: '#f59e0b', // amber-500
  urgent: '#ef4444', // red-500
};

export const createBoardLabels = (boardId: string): Label[] => {
  return defaultLabels.map((label, index) => ({
    id: `${boardId}-label-${index}`,
    boardId,
    ...label,
  }));
};
