import { collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { HabitLog } from '@/types/habit';
import { resilientWrite } from '@/utils/withTimeout';

function habitLogsCollection(uid: string) {
  return collection(db, 'users', uid, 'habitLogs');
}

/** Subscribes to all habit logs for the user (fine at personal-app scale — filtered/aggregated client-side). */
export function subscribeHabitLogs(uid: string, onChange: (logs: HabitLog[]) => void, onError?: (error: Error) => void) {
  return onSnapshot(
    habitLogsCollection(uid),
    (snapshot) => onChange(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<HabitLog, 'id'>) }))),
    onError
  );
}

/** Upserts (idempotent) the completion state for a habit on a given day. */
export async function setHabitLog(uid: string, habitId: string, date: string, completed: boolean) {
  const logId = `${habitId}_${date}`;
  await resilientWrite(
    setDoc(doc(db, 'users', uid, 'habitLogs', logId), {
      habitId,
      date,
      completed,
      completedAt: completed ? serverTimestamp() : null,
    })
  );
}
