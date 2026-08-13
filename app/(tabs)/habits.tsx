import { router } from 'expo-router';
import { useMemo } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { ListState } from '@/components/common/ListState';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { HabitListItem } from '@/components/habits/HabitListItem';
import { useAuth } from '@/hooks/useAuth';
import { useHabitLogs } from '@/hooks/useHabitLogs';
import { useHabits } from '@/hooks/useHabits';
import { deleteHabit } from '@/services/habits.service';
import { setHabitLog } from '@/services/habitLogs.service';
import { todayString } from '@/utils/date';
import { calculateStreak, lastNDays } from '@/utils/streaks';

export default function HabitsScreen() {
  const { user } = useAuth();
  const { habits, loading: loadingHabits, error: habitsError } = useHabits();
  const { logs, loading: loadingLogs, error: logsError } = useHabitLogs();
  const loading = loadingHabits || loadingLogs;
  const error = habitsError || logsError;

  const today = todayString();
  const last7 = useMemo(() => lastNDays(7, today), [today]);

  const perHabit = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const log of logs) {
      if (!log.completed) continue;
      if (!map.has(log.habitId)) map.set(log.habitId, new Set());
      map.get(log.habitId)!.add(log.date);
    }
    return map;
  }, [logs]);

  async function handleToggleToday(habitId: string, currentlyCompleted: boolean) {
    if (!user) return;
    await setHabitLog(user.uid, habitId, today, !currentlyCompleted);
  }

  function handleDelete(habitId: string, notificationId: string | null) {
    if (!user) return;
    Alert.alert('Xóa thói quen?', 'Toàn bộ lịch sử theo dõi sẽ bị xóa. Không thể hoàn tác.', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => deleteHabit(user.uid, habitId, notificationId) },
    ]);
  }

  return (
    <Screen>
      <ScreenHeader title="Thói quen" onAdd={() => router.push('/habit/new')} />
      {loading || error || habits.length === 0 ? (
        <ListState loading={loading} error={error} empty={habits.length === 0} emptyMessage="Chưa có thói quen nào. Bấm + để thêm." />
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const completedDates = perHabit.get(item.id) ?? new Set<string>();
            const streak = calculateStreak(completedDates, today);
            return (
              <HabitListItem
                habit={item}
                completedToday={completedDates.has(today)}
                streak={streak}
                last7Days={last7.map((d) => completedDates.has(d))}
                onToggleToday={() => handleToggleToday(item.id, completedDates.has(today))}
                onPress={() => router.push(`/habit/${item.id}`)}
                onDelete={() => handleDelete(item.id, item.notificationId)}
              />
            );
          }}
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
