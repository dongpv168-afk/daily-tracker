import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

/** Time picker storing/emitting 'HH:mm' strings. */
export function TimeField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const colors = useThemeColors();
  const [showPicker, setShowPicker] = useState(false);

  const [hours, minutes] = value.split(':').map(Number);
  const dateValue = new Date();
  dateValue.setHours(hours || 0, minutes || 0, 0, 0);

  function handleChange(event: DateTimePickerEvent, selected?: Date) {
    setShowPicker(Platform.OS === 'ios');
    if (event.type === 'dismissed') return;
    if (selected) {
      const h = String(selected.getHours()).padStart(2, '0');
      const m = String(selected.getMinutes()).padStart(2, '0');
      onChange(`${h}:${m}`);
    }
  }

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <Pressable
        onPress={() => setShowPicker(true)}
        style={[styles.button, { borderColor: colors.border, backgroundColor: colors.surface }]}
      >
        <Text style={{ color: colors.text, fontSize: 16 }}>{value}</Text>
      </Pressable>
      {showPicker ? (
        <DateTimePicker
          value={dateValue}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
});
