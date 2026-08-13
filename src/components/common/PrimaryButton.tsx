import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
}) {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        variant === 'primary'
          ? { backgroundColor: colors.primary, opacity: isDisabled ? 0.6 : 1 }
          : { backgroundColor: 'transparent' },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.primary} />
      ) : (
        <Text style={[styles.text, { color: variant === 'primary' ? '#fff' : colors.primary }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
