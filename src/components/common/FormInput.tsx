import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export function FormInput({ label, error, style, ...inputProps }: TextInputProps & { label: string; error?: string }) {
  const colors = useThemeColors();
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          { color: colors.text, borderColor: error ? colors.danger : colors.border, backgroundColor: colors.surface },
          style,
        ]}
        {...inputProps}
      />
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
  },
});
