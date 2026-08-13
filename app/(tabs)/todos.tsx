import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { FilterChips } from '@/components/common/FilterChips';
import { ListState } from '@/components/common/ListState';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { TodoListItem } from '@/components/todos/TodoListItem';
import { useAuth } from '@/hooks/useAuth';
import { useTodos } from '@/hooks/useTodos';
import { deleteTodo, toggleTodoComplete } from '@/services/todos.service';
import { todayString } from '@/utils/date';

type Filter = 'today' | 'upcoming' | 'all' | 'done';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'upcoming', label: 'Sắp tới' },
  { value: 'all', label: 'Tất cả' },
  { value: 'done', label: 'Đã xong' },
];

export default function TodosScreen() {
  const { user } = useAuth();
  const { todos, loading, error } = useTodos();
  const [filter, setFilter] = useState<Filter>('today');

  const filtered = useMemo(() => {
    const today = todayString();
    switch (filter) {
      case 'today':
        return todos.filter((t) => !t.isCompleted && (t.dueDate === today || !t.dueDate));
      case 'upcoming':
        return todos.filter((t) => !t.isCompleted && !!t.dueDate && t.dueDate > today);
      case 'done':
        return todos.filter((t) => t.isCompleted);
      case 'all':
      default:
        return todos;
    }
  }, [todos, filter]);

  async function handleToggle(id: string, next: boolean, notificationId: string | null) {
    if (!user) return;
    await toggleTodoComplete(user.uid, id, next, notificationId);
  }

  function handleDelete(id: string, notificationId: string | null) {
    if (!user) return;
    Alert.alert('Xóa việc cần làm?', 'Không thể hoàn tác.', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => deleteTodo(user.uid, id, notificationId) },
    ]);
  }

  return (
    <Screen>
      <ScreenHeader title="Việc cần làm" onAdd={() => router.push('/todo/new')} />
      <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      {loading || error || filtered.length === 0 ? (
        <ListState loading={loading} error={error} empty={filtered.length === 0} emptyMessage="Chưa có việc nào ở mục này." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TodoListItem
              todo={item}
              onToggle={() => handleToggle(item.id, !item.isCompleted, item.notificationId)}
              onPress={() => router.push(`/todo/${item.id}`)}
              onDelete={() => handleDelete(item.id, item.notificationId)}
            />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 40,
    gap: 10,
  },
});
