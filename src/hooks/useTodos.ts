import { useRealtimeCollection } from '@/hooks/useRealtimeCollection';
import { subscribeTodos } from '@/services/todos.service';
import type { Todo } from '@/types/todo';

export function useTodos() {
  const { items: todos, loading, error } = useRealtimeCollection<Todo>(subscribeTodos);
  return { todos, loading, error };
}
