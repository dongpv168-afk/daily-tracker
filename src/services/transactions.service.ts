import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Transaction, TransactionInput } from '@/types/transaction';
import { resilientWrite } from '@/utils/withTimeout';

function transactionsCollection(uid: string) {
  return collection(db, 'users', uid, 'transactions');
}

export function subscribeTransactions(
  uid: string,
  onChange: (transactions: Transaction[]) => void,
  onError?: (error: Error) => void
) {
  // Ordering by a single field avoids needing a Firestore composite index; createdAt is used as
  // a same-day tiebreaker client-side instead of a second orderBy().
  const q = query(transactionsCollection(uid), orderBy('date', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const transactions = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Transaction, 'id'>) }));
      transactions.sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
        return (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0);
      });
      onChange(transactions);
    },
    onError
  );
}

export async function createTransaction(uid: string, input: TransactionInput) {
  await resilientWrite(
    addDoc(transactionsCollection(uid), {
      type: input.type,
      amount: input.amount,
      category: input.category,
      note: input.note.trim() || null,
      date: input.date,
      createdAt: serverTimestamp(),
    })
  );
}

export async function updateTransaction(uid: string, txId: string, input: TransactionInput) {
  await resilientWrite(
    updateDoc(doc(db, 'users', uid, 'transactions', txId), {
      type: input.type,
      amount: input.amount,
      category: input.category,
      note: input.note.trim() || null,
      date: input.date,
    })
  );
}

export async function deleteTransaction(uid: string, txId: string) {
  await resilientWrite(deleteDoc(doc(db, 'users', uid, 'transactions', txId)));
}
