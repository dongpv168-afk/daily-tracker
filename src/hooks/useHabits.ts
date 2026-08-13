import { useRealtimeCollection } from '@/hooks/useRealtimeCollection';
import { subscribeHabits } from '@/services/habits.service';
import type { Habit } from '@/types/habit';

export function useHabits() {
  const { items: habits, loading, error } = useRealtimeCollection<Habit>(subscribeHabits);
  return { habits, loading, error };
}
