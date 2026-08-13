import { format, parse } from 'date-fns';

const DATE_FORMAT = 'yyyy-MM-dd';

/** Today as 'YYYY-MM-DD', matching how dates are stored in Firestore. */
export function todayString(): string {
  return format(new Date(), DATE_FORMAT);
}

/** Converts a JS Date to the 'YYYY-MM-DD' string used as the Firestore field value. */
export function toDateString(date: Date): string {
  return format(date, DATE_FORMAT);
}

/** Parses a 'YYYY-MM-DD' string back into a local JS Date (midnight, local time). */
export function fromDateString(dateStr: string): Date {
  return parse(dateStr, DATE_FORMAT, new Date());
}

/** 'YYYY-MM-DD' -> 'dd/MM/yyyy' for display. */
export function formatDisplayDate(dateStr: string): string {
  return format(fromDateString(dateStr), 'dd/MM/yyyy');
}
