import { subDays } from 'date-fns';
import { fromDateString, toDateString } from '@/utils/date';

export type Period = 'today' | 'week' | 'month';

/** Whether a 'YYYY-MM-DD' date string falls within the selected period, relative to today. */
export function isWithinPeriod(dateStr: string, period: Period, todayStr: string): boolean {
  switch (period) {
    case 'today':
      return dateStr === todayStr;
    case 'week': {
      const weekAgo = toDateString(subDays(fromDateString(todayStr), 6));
      return dateStr >= weekAgo && dateStr <= todayStr;
    }
    case 'month':
      return dateStr.startsWith(todayStr.slice(0, 7));
  }
}

/** Number of days elapsed so far in the period (used as the denominator for completion rates). */
export function periodDayCount(period: Period, todayStr: string): number {
  switch (period) {
    case 'today':
      return 1;
    case 'week':
      return 7;
    case 'month':
      return Number(todayStr.slice(8, 10)); // day-of-month so far, not the full month length
  }
}
