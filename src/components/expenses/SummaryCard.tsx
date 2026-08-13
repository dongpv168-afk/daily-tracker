import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatVND } from '@/utils/currency';

export function SummaryCard({ income, expense }: { income: number; expense: number }) {
  const colors = useThemeColors();
  const balance = income - expense;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.item}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Thu</Text>
        <Text style={[styles.value, { color: colors.success }]}>{formatVND(income)}</Text>
      </View>
      <View style={styles.item}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Chi</Text>
        <Text style={[styles.value, { color: colors.danger }]}>{formatVND(expense)}</Text>
      </View>
      <View style={styles.item}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Số dư</Text>
        <Text style={[styles.value, { color: colors.text }]}>{formatVND(balance)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 14,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
  },
});
