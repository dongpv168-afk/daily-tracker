import { differenceInCalendarDays, subDays } from 'date-fns';
import { fromDateString, toDateString } from '@/utils/date';

export interface StreakInfo {
  current: number;
  longest: number;
}

/**
 * Computes current and longest streak from a set of completed 'YYYY-MM-DD' dates.
 * "Current" counts consecutive completed days ending today; if today isn't completed yet,
 * it counts back from yesterday instead (so the streak isn't shown as broken until the day ends).
 */
export function calculateStreak(completedDates: Set<string>, todayStr: string): StreakInfo {
  let current = 0;
  let cursor = fromDateString(todayStr);
  if (!completedDates.has(toDateString(cursor))) {
    cursor = subDays(cursor, 1);
  }
  while (completedDates.has(toDateString(cursor))) {
    current++;
    cursor = subDays(cursor, 1);
  }

  const sortedDates = Array.from(completedDates).sort();
  let longest = 0;
  let run = 0;
  let previous: Date | null = null;
  for (const dateStr of sortedDates) {
    const date = fromDateString(dateStr);
    run = previous && differenceInCalendarDays(date, previous) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = date;
  }

  return { current, longest };
}

/** Last N days (oldest first) as 'YYYY-MM-DD', for a mini completion strip. */
export function lastNDays(n: number, todayStr: string): string[] {
  const today = fromDateString(todayStr);
  return Array.from({ length: n }, (_, i) => toDateString(subDays(today, n - 1 - i)));
}
