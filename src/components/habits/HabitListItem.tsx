import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SwipeableRow } from '@/components/common/SwipeableRow';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { Habit } from '@/types/habit';
import type { StreakInfo } from '@/utils/streaks';
import { hapticToggle } from '@/utils/haptics';

export function HabitListItem({
  habit,
  completedToday,
  streak,
  last7Days,
  onToggleToday,
  onPress,
  onDelete,
}: {
  habit: Habit;
  completedToday: boolean;
  streak: StreakInfo;
  /** oldest -> newest, today last */
  last7Days: boolean[];
  onToggleToday: () => void;
  onPress: () => void;
  onDelete: () => void;
}) {
  const colors = useThemeColors();

  function handleToggle() {
    hapticToggle();
    onToggleToday();
  }

  return (
    <SwipeableRow onDelete={onDelete}>
      <Pressable onPress={onPress} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.topRow}>
          <View style={styles.nameArea}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {habit.name}
            </Text>
            <View style={styles.streakRow}>
              <Ionicons name="flame" size={14} color={streak.current > 0 ? colors.warning : colors.textMuted} />
              <Text style={[styles.streakText, { color: colors.textMuted }]}>
                {streak.current} ngày liên tiếp · dài nhất {streak.longest}
              </Text>
            </View>
          </View>
          <Pressable onPress={handleToggle} hitSlop={8}>
            <Ionicons
              name={completedToday ? 'checkmark-circle' : 'ellipse-outline'}
              size={28}
              color={completedToday ? colors.success : colors.textMuted}
            />
          </Pressable>
        </View>
        <View style={styles.dotsRow}>
          {last7Days.map((done, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: done ? colors.success : colors.border }]} />
          ))}
        </View>
      </Pressable>
    </SwipeableRow>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nameArea: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
});
