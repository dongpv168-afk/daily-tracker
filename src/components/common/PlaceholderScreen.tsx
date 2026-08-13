import { StyleSheet, Text } from 'react-native';
import { Screen } from '@/components/common/Screen';
import { useThemeColors } from '@/hooks/useThemeColors';

/** Temporary stand-in for a tab's real content, used while scaffolding navigation (Phase 1). */
export function PlaceholderScreen({ title, note }: { title: string; note?: string }) {
  const colors = useThemeColors();
  return (
    <Screen style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {note ? <Text style={[styles.note, { color: colors.textMuted }]}>{note}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
  },
});
