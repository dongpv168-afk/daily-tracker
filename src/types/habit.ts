import type { Timestamp } from 'firebase/firestore';

export interface Habit {
  id: string;
  name: string;
  reminderEnabled: boolean;
  /** 'HH:mm', repeats daily. */
  reminderTime: string | null;
  notificationId: string | null;
  createdAt: Timestamp | null;
}

export interface HabitInput {
  name: string;
  reminderEnabled: boolean;
  reminderTime: string | null;
  notificationId: string | null;
}

export interface HabitLog {
  /** `${habitId}_${date}` — composite id makes a check-off an idempotent upsert. */
  id: string;
  habitId: string;
  /** 'YYYY-MM-DD' */
  date: string;
  completed: boolean;
  completedAt: Timestamp | null;
}
