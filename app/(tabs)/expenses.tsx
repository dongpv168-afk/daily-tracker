import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { FilterChips } from '@/components/common/FilterChips';
import { ListState } from '@/components/common/ListState';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SummaryCard } from '@/components/expenses/SummaryCard';
import { TransactionListItem } from '@/components/expenses/TransactionListItem';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { deleteTransaction } from '@/services/transactions.service';
import { todayString } from '@/utils/date';

type Filter = 'today' | 'week' | 'month' | 'all';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'week', label: '7 ngày' },
  { value: 'month', label: 'Tháng này' },
  { value: 'all', label: 'Tất cả' },
];

export default function ExpensesScreen() {
  const { user } = useAuth();
  const { transactions, loading, error } = useTransactions();
  const [filter, setFilter] = useState<Filter>('today');

  const filtered = useMemo(() => {
    const today = todayString();
    switch (filter) {
      case 'today':
        return transactions.filter((t) => t.date === today);
      case 'week': {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 6);
        const weekAgoStr = weekAgo.toISOString().slice(0, 10);
        return transactions.filter((t) => t.date >= weekAgoStr && t.date <= today);
      }
      case 'month': {
        const monthPrefix = today.slice(0, 7); // 'YYYY-MM'
        return transactions.filter((t) => t.date.startsWith(monthPrefix));
      }
      case 'all':
      default:
        return transactions;
    }
  }, [transactions, filter]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of filtered) {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    }
    return { income, expense };
  }, [filtered]);

  function handleDelete(id: string) {
    if (!user) return;
    Alert.alert('Xóa giao dịch?', 'Không thể hoàn tác.', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => deleteTransaction(user.uid, id) },
    ]);
  }

  return (
    <Screen>
      <ScreenHeader title="Chi tiêu" onAdd={() => router.push('/transaction/new')} />
      <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      <SummaryCard income={totals.income} expense={totals.expense} />
      {loading || error || filtered.length === 0 ? (
        <ListState loading={loading} error={error} empty={filtered.length === 0} emptyMessage="Chưa có giao dịch nào ở mục này." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TransactionListItem
              transaction={item}
              onPress={() => router.push(`/transaction/${item.id}`)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 10,
  },
});
