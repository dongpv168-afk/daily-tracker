import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { friendlyFirestoreError } from '@/utils/errors';

type Unsubscribe = () => void;
type Subscribe<T> = (uid: string, onChange: (items: T[]) => void, onError: (error: Error) => void) => Unsubscribe;

const SLOW_CONNECTION_MS = 8000;

/**
 * Shared realtime-subscription logic for the todos/habits/habitLogs/transactions hooks.
 * Firestore's onSnapshot doesn't error out when offline — it just waits silently for a
 * reconnect — so a plain loading flag would spin forever with no feedback. This adds a timeout:
 * if the first snapshot hasn't arrived after SLOW_CONNECTION_MS, it surfaces a "waiting for
 * network" message instead of leaving the UI stuck on a spinner.
 */
export function useRealtimeCollection<T>(subscribe: Subscribe<T>) {
  const { user } = useAuth();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);

    const slowTimer = setTimeout(() => {
      setError('Đang chờ kết nối mạng — dữ liệu sẽ tự cập nhật khi có mạng trở lại.');
    }, SLOW_CONNECTION_MS);

    const unsubscribe = subscribe(
      user.uid,
      (next) => {
        clearTimeout(slowTimer);
        setItems(next);
        setError(null);
        setLoading(false);
      },
      (err) => {
        clearTimeout(slowTimer);
        setError(friendlyFirestoreError(err));
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(slowTimer);
      unsubscribe();
    };
  }, [user, subscribe]);

  return { items, loading, error };
}
