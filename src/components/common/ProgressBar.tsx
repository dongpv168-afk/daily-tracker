import { StyleSheet, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export function ProgressBar({ progress, color }: { progress: number; color?: string }) {
  const colors = useThemeColors();
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.track, { backgroundColor: colors.border }]}>
      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color ?? colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
