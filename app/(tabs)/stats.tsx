import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FilterChips } from '@/components/common/FilterChips';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { getCategory } from '@/constants/categories';
import { useHabitLogs } from '@/hooks/useHabitLogs';
import { useHabits } from '@/hooks/useHabits';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTodos } from '@/hooks/useTodos';
import { useTransactions } from '@/hooks/useTransactions';
import { formatVND } from '@/utils/currency';
import { todayString } from '@/utils/date';
import { isWithinPeriod, periodDayCount, type Period } from '@/utils/period';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'week', label: '7 ngày' },
  { value: 'month', label: 'Tháng này' },
];

export default function StatsScreen() {
  const colors = useThemeColors();
  const [period, setPeriod] = useState<Period>('week');
  const today = todayString();

  const { todos } = useTodos();
  const { habits } = useHabits();
  const { logs } = useHabitLogs();
  const { transactions } = useTransactions();

  const todoStats = useMemo(() => {
    const inPeriod = todos.filter((t) => t.dueDate && isWithinPeriod(t.dueDate, period, today));
    const completed = inPeriod.filter((t) => t.isCompleted).length;
    const overdue = todos.filter((t) => !t.isCompleted && !!t.dueDate && t.dueDate < today).length;
    return { total: inPeriod.length, completed, overdue };
  }, [todos, period, today]);

  const habitStats = useMemo(() => {
    const days = periodDayCount(period, today);
    const perHabit = habits.map((habit) => {
      const completedCount = logs.filter(
        (l) => l.habitId === habit.id && l.completed && isWithinPeriod(l.date, period, today)
      ).length;
      const rate = days > 0 ? Math.min(1, completedCount / days) : 0;
      return { habit, rate, completedCount, days };
    });
    const avgRate = perHabit.length ? perHabit.reduce((sum, h) => sum + h.rate, 0) / perHabit.length : 0;
    return { perHabit, avgRate };
  }, [habits, logs, period, today]);

  const expenseStats = useMemo(() => {
    const inPeriod = transactions.filter((t) => isWithinPeriod(t.date, period, today));
    let income = 0;
    let expense = 0;
    const byCategory = new Map<string, number>();
    for (const t of inPeriod) {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
        byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
      }
    }
    const topCategories = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return { income, expense, topCategories };
  }, [transactions, period, today]);

  return (
    <Screen>
      <ScreenHeader title="Thống kê" />
      <FilterChips options={PERIODS} value={period} onChange={setPeriod} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionCard title="Việc cần làm">
          <Text style={[styles.big, { color: colors.text }]}>
            {todoStats.completed}/{todoStats.total} hoàn thành
          </Text>
          <ProgressBar progress={todoStats.total ? todoStats.completed / todoStats.total : 0} color={colors.success} />
          {todoStats.overdue > 0 ? (
            <Text style={[styles.muted, { color: colors.danger }]}>{todoStats.overdue} việc quá hạn</Text>
          ) : null}
        </SectionCard>

        <SectionCard title="Thói quen">
          {habitStats.perHabit.length === 0 ? (
            <Text style={[styles.muted, { color: colors.textMuted }]}>Chưa có thói quen nào.</Text>
          ) : (
            <>
              <Text style={[styles.big, { color: colors.text }]}>{Math.round(habitStats.avgRate * 100)}% trung bình</Text>
              {habitStats.perHabit.map(({ habit, rate, completedCount, days }) => (
                <View key={habit.id} style={styles.habitRow}>
                  <View style={styles.habitLabelRow}>
                    <Text style={[styles.habitName, { color: colors.text }]} numberOfLines={1}>
                      {habit.name}
                    </Text>
                    <Text style={[styles.muted, { color: colors.textMuted }]}>
                      {completedCount}/{days}
                    </Text>
                  </View>
                  <ProgressBar progress={rate} />
                </View>
              ))}
            </>
          )}
        </SectionCard>

        <SectionCard title="Chi tiêu">
          <View style={styles.expenseSummaryRow}>
            <Text style={[styles.muted, { color: colors.textMuted }]}>
              Thu <Text style={{ color: colors.success, fontWeight: '700' }}>{formatVND(expenseStats.income)}</Text>
            </Text>
            <Text style={[styles.muted, { color: colors.textMuted }]}>
              Chi <Text style={{ color: colors.danger, fontWeight: '700' }}>{formatVND(expenseStats.expense)}</Text>
            </Text>
          </View>
          {expenseStats.topCategories.length > 0 ? (
            <View style={styles.categoryList}>
              {expenseStats.topCategories.map(([key, amount]) => (
                <View key={key} style={styles.categoryRow}>
                  <Text style={[styles.muted, { color: colors.text }]}>{getCategory(key)?.label ?? key}</Text>
                  <Text style={[styles.muted, { color: colors.textMuted }]}>{formatVND(amount)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.muted, { color: colors.textMuted }]}>Chưa có chi tiêu nào ở kỳ này.</Text>
          )}
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
  muted: {
    fontSize: 13,
  },
  habitRow: {
    gap: 4,
  },
  habitLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitName: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
  expenseSummaryRow: {
    flexDirection: 'row',
    gap: 20,
  },
  categoryList: {
    gap: 6,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
