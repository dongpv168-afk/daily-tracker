import { Ionicons } from '@expo/vector-icons';
import { PropsWithChildren, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useThemeColors } from '@/hooks/useThemeColors';
import { hapticDelete } from '@/utils/haptics';

/** Wraps a list row with swipe-left-to-delete, revealing a red trash action. */
export function SwipeableRow({ children, onDelete }: PropsWithChildren<{ onDelete: () => void }>) {
  const colors = useThemeColors();
  const ref = useRef<Swipeable>(null);

  function handleDelete() {
    ref.current?.close();
    hapticDelete();
    onDelete();
  }

  function renderRightActions(progress: Animated.AnimatedInterpolation<number>) {
    const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1], extrapolate: 'clamp' });
    return (
      <Pressable onPress={handleDelete} style={[styles.action, { backgroundColor: colors.danger }]}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash-outline" size={22} color="#fff" />
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Swipeable ref={ref} renderRightActions={renderRightActions} overshootRight={false} rightThreshold={40}>
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  action: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginLeft: 8,
  },
});
