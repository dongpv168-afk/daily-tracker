import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { categoriesForType } from '@/constants/categories';
import { DateField } from '@/components/common/DateField';
import { FilterChips } from '@/components/common/FilterChips';
import { FormInput } from '@/components/common/FormInput';
import { KeyboardAwareScreen } from '@/components/common/KeyboardAwareScreen';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { TypeToggle } from '@/components/expenses/TypeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTransactions } from '@/hooks/useTransactions';
import { createTransaction, deleteTransaction, updateTransaction } from '@/services/transactions.service';
import type { TransactionType } from '@/types/transaction';
import { formatThousands } from '@/utils/currency';
import { todayString } from '@/utils/date';

export default function TransactionFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const { user } = useAuth();
  const { transactions } = useTransactions();
  const colors = useThemeColors();
  const existing = !isNew ? transactions.find((t) => t.id === id) : undefined;

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categoriesForType('expense')[0].key);
  const [date, setDate] = useState(todayString());
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setType(existing.type);
      setAmount(String(existing.amount));
      setCategory(existing.category);
      setDate(existing.date);
      setNote(existing.note ?? '');
    }
  }, [existing]);

  function handleTypeChange(next: TransactionType) {
    setType(next);
    setCategory(categoriesForType(next)[0].key);
  }

  async function handleSave() {
    if (!user) return;
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      setError('Nhập số tiền hợp lệ.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const input = { type, amount: amountNum, category, note, date };
      if (isNew) {
        await createTransaction(user.uid, input);
      } else {
        await updateTransaction(user.uid, id, input);
      }
      router.back();
    } catch {
      setError('Không lưu được, thử lại.');
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!user || isNew) return;
    Alert.alert('Xóa giao dịch?', 'Không thể hoàn tác.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(user.uid, id);
          router.back();
        },
      },
    ]);
  }

  return (
    <KeyboardAwareScreen>
      <Text style={[styles.title, { color: colors.text }]}>{isNew ? 'Thêm giao dịch' : 'Sửa giao dịch'}</Text>

      <TypeToggle value={type} onChange={handleTypeChange} />
      <FormInput
        label="Số tiền (VND)"
        value={formatThousands(amount)}
        onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
        placeholder="0"
      />

      <FilterChips
        options={categoriesForType(type).map((c) => ({ value: c.key, label: c.label }))}
        value={category}
        onChange={setCategory}
      />

      <DateField label="Ngày" value={date} onChange={(d) => setDate(d ?? todayString())} allowClear={false} />
      <FormInput label="Ghi chú (không bắt buộc)" value={note} onChangeText={setNote} placeholder="Chi tiết thêm" />

      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

      <PrimaryButton title="Lưu" onPress={handleSave} loading={saving} />
      {!isNew ? <PrimaryButton title="Xóa" onPress={handleDelete} variant="ghost" /> : null}
      <PrimaryButton title="Hủy" onPress={() => router.back()} variant="ghost" />
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  error: {
    fontSize: 13,
  },
});
