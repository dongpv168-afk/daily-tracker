import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

/** Full-screen container with the current theme's background color applied. */
export function Screen({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const colors = useThemeColors();
  return <View style={[styles.container, { backgroundColor: colors.background }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
