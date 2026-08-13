import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getCategory } from '@/constants/categories';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { Transaction } from '@/types/transaction';
import { formatVND } from '@/utils/currency';
import { formatDisplayDate } from '@/utils/date';

export function TransactionListItem({
  transaction,
  onPress,
  onDelete,
}: {
  transaction: Transaction;
  onPress: () => void;
  onDelete: () => void;
}) {
  const colors = useThemeColors();
  const category = getCategory(transaction.category);
  const isIncome = transaction.type === 'income';

  return (
    <Pressable onPress={onPress} style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: isIncome ? colors.success + '22' : colors.danger + '22' }]}>
        <Ionicons name={category?.icon ?? 'pricetag-outline'} size={18} color={isIncome ? colors.success : colors.danger} />
      </View>
      <View style={styles.textArea}>
        <Text style={[styles.category, { color: colors.text }]} numberOfLines={1}>
          {category?.label ?? transaction.category}
        </Text>
        <Text style={[styles.meta, { color: colors.textMuted }]} numberOfLines={1}>
          {formatDisplayDate(transaction.date)}
          {transaction.note ? ` · ${transaction.note}` : ''}
        </Text>
      </View>
      <Text style={[styles.amount, { color: isIncome ? colors.success : colors.danger }]}>
        {isIncome ? '+' : '-'}
        {formatVND(transaction.amount)}
      </Text>
      <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textArea: {
    flex: 1,
    gap: 2,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
  },
  meta: {
    fontSize: 12,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    paddingLeft: 2,
  },
});
