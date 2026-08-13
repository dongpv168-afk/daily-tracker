import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { cancelReminder } from '@/services/notifications.service';
import type { Habit, HabitInput } from '@/types/habit';
import { resilientWrite } from '@/utils/withTimeout';

function habitsCollection(uid: string) {
  return collection(db, 'users', uid, 'habits');
}

function habitLogsCollection(uid: string) {
  return collection(db, 'users', uid, 'habitLogs');
}

export function subscribeHabits(uid: string, onChange: (habits: Habit[]) => void, onError?: (error: Error) => void) {
  const q = query(habitsCollection(uid), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => onChange(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Habit, 'id'>) }))),
    onError
  );
}

export async function createHabit(uid: string, input: HabitInput) {
  await resilientWrite(
    addDoc(habitsCollection(uid), {
      name: input.name.trim(),
      reminderEnabled: input.reminderEnabled,
      reminderTime: input.reminderTime,
      notificationId: input.notificationId,
      createdAt: serverTimestamp(),
    })
  );
}

export async function updateHabit(uid: string, habitId: string, input: HabitInput) {
  await resilientWrite(
    updateDoc(doc(db, 'users', uid, 'habits', habitId), {
      name: input.name.trim(),
      reminderEnabled: input.reminderEnabled,
      reminderTime: input.reminderTime,
      notificationId: input.notificationId,
    })
  );
}

/** Deletes the habit and all of its logs (they'd otherwise be orphaned in Firestore). */
export async function deleteHabit(uid: string, habitId: string, notificationId: string | null) {
  if (notificationId) {
    await cancelReminder(notificationId);
  }
  await resilientWrite(
    (async () => {
      const logsSnapshot = await getDocs(query(habitLogsCollection(uid), where('habitId', '==', habitId)));
      const batch = writeBatch(db);
      logsSnapshot.forEach((logDoc) => batch.delete(logDoc.ref));
      batch.delete(doc(db, 'users', uid, 'habits', habitId));
      await batch.commit();
    })()
  );
}
