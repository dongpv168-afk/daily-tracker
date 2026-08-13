import type { Ionicons } from '@expo/vector-icons';
import type { TransactionType } from '@/types/transaction';

export interface Category {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: TransactionType;
}

export const EXPENSE_CATEGORIES: Category[] = [
  { key: 'food', label: 'Ăn uống', icon: 'fast-food-outline', type: 'expense' },
  { key: 'transport', label: 'Di chuyển', icon: 'car-outline', type: 'expense' },
  { key: 'shopping', label: 'Mua sắm', icon: 'bag-outline', type: 'expense' },
  { key: 'bills', label: 'Hóa đơn', icon: 'receipt-outline', type: 'expense' },
  { key: 'health', label: 'Sức khỏe', icon: 'medkit-outline', type: 'expense' },
  { key: 'entertainment', label: 'Giải trí', icon: 'game-controller-outline', type: 'expense' },
  { key: 'other_expense', label: 'Khác', icon: 'ellipsis-horizontal-outline', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { key: 'salary', label: 'Lương', icon: 'cash-outline', type: 'income' },
  { key: 'bonus', label: 'Thưởng', icon: 'gift-outline', type: 'income' },
  { key: 'other_income', label: 'Khác', icon: 'ellipsis-horizontal-outline', type: 'income' },
];

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function categoriesForType(type: TransactionType): Category[] {
  return type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
}

export function getCategory(key: string): Category | undefined {
  return ALL_CATEGORIES.find((c) => c.key === key);
}
