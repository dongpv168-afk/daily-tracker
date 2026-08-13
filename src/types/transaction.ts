import type { Timestamp } from 'firebase/firestore';

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string | null;
  /** 'YYYY-MM-DD' */
  date: string;
  createdAt: Timestamp | null;
}

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string;
}
