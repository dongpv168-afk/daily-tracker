import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { FormInput } from '@/components/common/FormInput';
import { KeyboardAwareScreen } from '@/components/common/KeyboardAwareScreen';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { TimeField } from '@/components/common/TimeField';
import { ToggleRow } from '@/components/common/ToggleRow';
import { useAuth } from '@/hooks/useAuth';
import { useHabits } from '@/hooks/useHabits';
import { useThemeColors } from '@/hooks/useThemeColors';
import { createHabit, deleteHabit, updateHabit } from '@/services/habits.service';
import { cancelReminder, scheduleHabitReminder } from '@/services/notifications.service';

export default function HabitFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const { user } = useAuth();
  const { habits } = useHabits();
  const colors = useThemeColors();
  const existing = !isNew ? habits.find((h) => h.id === id) : undefined;

  const [name, setName] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setReminderEnabled(existing.reminderEnabled);
      setReminderTime(existing.reminderTime ?? '20:00');
    }
  }, [existing]);

  async function handleSave() {
    if (!user) return;
    if (!name.trim()) {
      setError('Nhập tên thói quen.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      // Reschedule from scratch on every save to stay in sync with whatever changed.
      if (existing?.notificationId) {
        await cancelReminder(existing.notificationId);
      }
      let notificationId: string | null = null;
      if (reminderEnabled) {
        const [hours, minutes] = reminderTime.split(':').map(Number);
        notificationId = await scheduleHabitReminder(name, hours, minutes);
      }

      const input = { name, reminderEnabled, reminderTime, notificationId };
      if (isNew) {
        await createHabit(user.uid, input);
      } else {
        await updateHabit(user.uid, id, input);
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
    Alert.alert('Xóa thói quen?', 'Toàn bộ lịch sử theo dõi sẽ bị xóa. Không thể hoàn tác.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await deleteHabit(user.uid, id, existing?.notificationId ?? null);
          router.back();
        },
      },
    ]);
  }

  return (
    <KeyboardAwareScreen>
      <Text style={[styles.title, { color: colors.text }]}>{isNew ? 'Thêm thói quen' : 'Sửa thói quen'}</Text>
      <FormInput label="Tên thói quen" value={name} onChangeText={setName} placeholder="Vd: Uống 2 lít nước" />

      <ToggleRow label="Nhắc mỗi ngày" value={reminderEnabled} onChange={setReminderEnabled} />
      {reminderEnabled ? <TimeField label="Giờ nhắc" value={reminderTime} onChange={setReminderTime} /> : null}

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
