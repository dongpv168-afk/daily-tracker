import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { useHabitLogs } from '@/hooks/useHabitLogs';
import { useHabits } from '@/hooks/useHabits';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTodos } from '@/hooks/useTodos';
import { useTransactions } from '@/hooks/useTransactions';
import { formatVND } from '@/utils/currency';
import { todayString } from '@/utils/date';

export default function TodayScreen() {
  const colors = useThemeColors();
  const today = todayString();
  const { todos } = useTodos();
  const { habits } = useHabits();
  const { logs } = useHabitLogs();
  const { transactions } = useTransactions();

  const todosToday = useMemo(() => todos.filter((t) => t.dueDate === today || !t.dueDate), [todos, today]);
  const todosDone = todosToday.filter((t) => t.isCompleted).length;

  const habitsDoneToday = useMemo(
    () => new Set(logs.filter((l) => l.date === today && l.completed).map((l) => l.habitId)),
    [logs, today]
  );

  const spentToday = useMemo(
    () => transactions.filter((t) => t.date === today && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [transactions, today]
  );

  return (
    <Screen>
      <ScreenHeader title="Hôm nay" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionCard title="Việc cần làm">
          <Text style={[styles.big, { color: colors.text }]}>
            {todosDone}/{todosToday.length} hoàn thành
          </Text>
          <ProgressBar progress={todosToday.length ? todosDone / todosToday.length : 0} color={colors.success} />
          <Pressable onPress={() => router.push('/(tabs)/todos')}>
            <Text style={[styles.link, { color: colors.primary }]}>Xem danh sách →</Text>
          </Pressable>
        </SectionCard>

        <SectionCard title="Thói quen">
          <Text style={[styles.big, { color: colors.text }]}>
            {habitsDoneToday.size}/{habits.length} hoàn thành
          </Text>
          <ProgressBar progress={habits.length ? habitsDoneToday.size / habits.length : 0} color={colors.primary} />
          <Pressable onPress={() => router.push('/(tabs)/habits')}>
            <Text style={[styles.link, { color: colors.primary }]}>Xem danh sách →</Text>
          </Pressable>
        </SectionCard>

        <SectionCard title="Chi tiêu hôm nay">
          <Text style={[styles.big, { color: colors.danger }]}>{formatVND(spentToday)}</Text>
          <Pressable onPress={() => router.push('/transaction/new')}>
            <Text style={[styles.link, { color: colors.primary }]}>+ Thêm giao dịch</Text>
          </Pressable>
        </SectionCard>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 4,
    paddingBottom: 40,
    gap: 14,
  },
  big: {
    fontSize: 20,
    fontWeight: '700',
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
});
