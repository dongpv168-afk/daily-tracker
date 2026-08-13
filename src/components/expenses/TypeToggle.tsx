import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { TransactionType } from '@/types/transaction';

export function TypeToggle({ value, onChange }: { value: TransactionType; onChange: (value: TransactionType) => void }) {
  const colors = useThemeColors();
  const options: { value: TransactionType; label: string; color: string }[] = [
    { value: 'expense', label: 'Chi tiêu', color: colors.danger },
    { value: 'income', label: 'Thu nhập', color: colors.success },
  ];

  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.button, { backgroundColor: active ? opt.color : 'transparent' }]}
          >
            <Text style={[styles.label, { color: active ? '#fff' : colors.text }]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
