import type { Timestamp } from 'firebase/firestore';

export interface Todo {
  id: string;
  title: string;
  notes: string | null;
  /** 'YYYY-MM-DD', or null for no due date. */
  dueDate: string | null;
  isCompleted: boolean;
  completedAt: Timestamp | null;
  reminderEnabled: boolean;
  /** 'HH:mm', only meaningful when reminderEnabled and dueDate are set. */
  reminderTime: string | null;
  notificationId: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface TodoInput {
  title: string;
  notes: string;
  dueDate: string | null;
  reminderEnabled: boolean;
  reminderTime: string | null;
  notificationId: string | null;
}
