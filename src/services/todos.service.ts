import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { cancelReminder } from '@/services/notifications.service';
import type { Todo, TodoInput } from '@/types/todo';
import { resilientWrite } from '@/utils/withTimeout';

function todosCollection(uid: string) {
  return collection(db, 'users', uid, 'todos');
}

/** Realtime-subscribes to all of a user's todos, newest first. */
export function subscribeTodos(uid: string, onChange: (todos: Todo[]) => void, onError?: (error: Error) => void) {
  const q = query(todosCollection(uid), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => onChange(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Todo, 'id'>) }))),
    onError
  );
}

export async function createTodo(uid: string, input: TodoInput) {
  await resilientWrite(
    addDoc(todosCollection(uid), {
      title: input.title.trim(),
      notes: input.notes.trim() || null,
      dueDate: input.dueDate,
      isCompleted: false,
      completedAt: null,
      reminderEnabled: input.reminderEnabled,
      reminderTime: input.reminderTime,
      notificationId: input.notificationId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
}

export async function updateTodo(uid: string, todoId: string, input: TodoInput) {
  await resilientWrite(
    updateDoc(doc(db, 'users', uid, 'todos', todoId), {
      title: input.title.trim(),
      notes: input.notes.trim() || null,
      dueDate: input.dueDate,
      reminderEnabled: input.reminderEnabled,
      reminderTime: input.reminderTime,
      notificationId: input.notificationId,
      updatedAt: serverTimestamp(),
    })
  );
}

export async function toggleTodoComplete(uid: string, todoId: string, isCompleted: boolean, notificationId: string | null) {
  // No point reminding about a task that's already done.
  if (isCompleted && notificationId) {
    await cancelReminder(notificationId);
  }
  await resilientWrite(
    updateDoc(doc(db, 'users', uid, 'todos', todoId), {
      isCompleted,
      completedAt: isCompleted ? serverTimestamp() : null,
      notificationId: isCompleted ? null : notificationId,
      updatedAt: serverTimestamp(),
    })
  );
}

export async function deleteTodo(uid: string, todoId: string, notificationId: string | null) {
  if (notificationId) {
    await cancelReminder(notificationId);
  }
  await resilientWrite(deleteDoc(doc(db, 'users', uid, 'todos', todoId)));
}
