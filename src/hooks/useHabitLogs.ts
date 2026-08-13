import { useRealtimeCollection } from '@/hooks/useRealtimeCollection';
import { subscribeHabitLogs } from '@/services/habitLogs.service';
import type { HabitLog } from '@/types/habit';

export function useHabitLogs() {
  const { items: logs, loading, error } = useRealtimeCollection<HabitLog>(subscribeHabitLogs);
  return { logs, loading, error };
}
