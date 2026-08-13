import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

/** Title row with an optional "+" add button. Reused across Todos/Habits/Expenses. */
export function ScreenHeader({ title, onAdd }: { title: string; onAdd?: () => void }) {
  const colors = useThemeColors();
  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {onAdd ? (
        <Pressable onPress={onAdd} style={[styles.addButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
