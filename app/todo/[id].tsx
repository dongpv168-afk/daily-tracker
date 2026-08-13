import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { DateField } from '@/components/common/DateField';
import { FormInput } from '@/components/common/FormInput';
import { KeyboardAwareScreen } from '@/components/common/KeyboardAwareScreen';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { TimeField } from '@/components/common/TimeField';
import { ToggleRow } from '@/components/common/ToggleRow';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTodos } from '@/hooks/useTodos';
import { cancelReminder, scheduleTodoReminder } from '@/services/notifications.service';
import { createTodo, deleteTodo, updateTodo } from '@/services/todos.service';
import { fromDateString } from '@/utils/date';

export default function TodoFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const { user } = useAuth();
  const { todos } = useTodos();
  const colors = useThemeColors();
  const existing = !isNew ? todos.find((t) => t.id === id) : undefined;

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setNotes(existing.notes ?? '');
      setDueDate(existing.dueDate);
      setReminderEnabled(existing.reminderEnabled);
      setReminderTime(existing.reminderTime ?? '09:00');
    }
  }, [existing]);

  async function handleSave() {
    if (!user) return;
    if (!title.trim()) {
      setError('Nhập tên việc cần làm.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      // Reschedule from scratch on every save — simplest way to keep the notification in sync
      // with whatever changed (time, due date, or the reminder being turned off).
      if (existing?.notificationId) {
        await cancelReminder(existing.notificationId);
      }
      let notificationId: string | null = null;
      if (reminderEnabled && dueDate) {
        const [hours, minutes] = reminderTime.split(':').map(Number);
        const when = fromDateString(dueDate);
        when.setHours(hours, minutes, 0, 0);
        if (when.getTime() > Date.now()) {
          notificationId = await scheduleTodoReminder(title, when);
        }
      }

      const input = { title, notes, dueDate, reminderEnabled, reminderTime, notificationId };
      if (isNew) {
        await createTodo(user.uid, input);
      } else {
        await updateTodo(user.uid, id, input);
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
    Alert.alert('Xóa việc cần làm?', 'Không thể hoàn tác.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await deleteTodo(user.uid, id, existing?.notificationId ?? null);
          router.back();
        },
      },
    ]);
  }

  return (
    <KeyboardAwareScreen>
      <Text style={[styles.title, { color: colors.text }]}>{isNew ? 'Thêm việc cần làm' : 'Sửa việc cần làm'}</Text>

      <FormInput label="Tên việc" value={title} onChangeText={setTitle} placeholder="Vd: Gọi điện cho khách hàng" />
      <FormInput label="Ghi chú (không bắt buộc)" value={notes} onChangeText={setNotes} placeholder="Chi tiết thêm" multiline />
      <DateField label="Ngày đến hạn (không bắt buộc)" value={dueDate} onChange={setDueDate} />

      {dueDate ? (
        <>
          <ToggleRow label="Nhắc tôi" value={reminderEnabled} onChange={setReminderEnabled} />
          {reminderEnabled ? <TimeField label="Giờ nhắc" value={reminderTime} onChange={setReminderTime} /> : null}
        </>
      ) : null}

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
