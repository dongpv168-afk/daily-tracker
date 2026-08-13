import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

/** Renders the loading spinner, error/slow-connection message, or empty-state text for a list. */
export function ListState({
  loading,
  error,
  empty,
  emptyMessage,
}: {
  loading: boolean;
  error: string | null;
  empty: boolean;
  emptyMessage: string;
}) {
  const colors = useThemeColors();

  // Checked before `loading`: a still-loading state that has gone on long enough to produce a
  // "waiting for network" message is more useful to show than a bare spinner.
  if (error) {
    return (
      <View style={styles.center}>
        {loading ? <ActivityIndicator color={colors.primary} style={styles.spinner} /> : null}
        <Text style={[styles.text, { color: colors.danger }]}>{error}</Text>
      </View>
    );
  }
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  if (empty) {
    return (
      <View style={styles.center}>
        <Text style={[styles.text, { color: colors.textMuted }]}>{emptyMessage}</Text>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  center: {
    marginTop: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  spinner: {
    marginBottom: 0,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});
