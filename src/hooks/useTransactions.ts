import { useRealtimeCollection } from '@/hooks/useRealtimeCollection';
import { subscribeTransactions } from '@/services/transactions.service';
import type { Transaction } from '@/types/transaction';

export function useTransactions() {
  const { items: transactions, loading, error } = useRealtimeCollection<Transaction>(subscribeTransactions);
  return { transactions, loading, error };
}
