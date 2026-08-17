import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SwipeableRow } from '@/components/common/SwipeableRow';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { Todo } from '@/types/todo';
import { formatDisplayDate } from '@/utils/date';
import { hapticToggle } from '@/utils/haptics';

export function TodoListItem({
  todo,
  onToggle,
  onPress,
  onDelete,
}: {
  todo: Todo;
  onToggle: () => void;
  onPress: () => void;
  onDelete: () => void;
}) {
  const colors = useThemeColors();

  function handleToggle() {
    hapticToggle();
    onToggle();
  }

  return (
    <SwipeableRow onDelete={onDelete}>
      <Pressable onPress={onPress} style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable onPress={handleToggle} hitSlop={8} style={styles.checkbox}>
          <Ionicons
            name={todo.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={todo.isCompleted ? colors.success : colors.textMuted}
          />
        </Pressable>
        <View style={styles.textArea}>
          <Text
            style={[styles.title, { color: todo.isCompleted ? colors.textMuted : colors.text }, todo.isCompleted && styles.strikethrough]}
            numberOfLines={2}
          >
            {todo.title}
          </Text>
          {todo.dueDate ? <Text style={[styles.due, { color: colors.textMuted }]}>{formatDisplayDate(todo.dueDate)}</Text> : null}
        </View>
      </Pressable>
    </SwipeableRow>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  checkbox: {
    padding: 2,
  },
  textArea: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  due: {
    fontSize: 12,
  },
});
