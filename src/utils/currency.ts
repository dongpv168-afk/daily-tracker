const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function formatVND(amount: number): string {
  return formatter.format(amount);
}

/** Inserts '.' every 3 digits (e.g. "50000" -> "50.000") for a digits-only input string. */
export function formatThousands(digitsOnly: string): string {
  if (!digitsOnly) return '';
  return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
