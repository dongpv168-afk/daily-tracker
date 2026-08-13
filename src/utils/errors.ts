/** Turns a Firestore error into a short Vietnamese message for display. */
export function friendlyFirestoreError(error: Error): string {
  const code = (error as { code?: string }).code;
  if (code === 'permission-denied') {
    return 'Không có quyền truy cập dữ liệu. Kiểm tra lại Firestore Rules.';
  }
  return 'Không tải được dữ liệu. Kiểm tra kết nối mạng và thử lại.';
}
