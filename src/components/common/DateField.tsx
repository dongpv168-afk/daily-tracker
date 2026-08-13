import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatDisplayDate, fromDateString, toDateString } from '@/utils/date';

/** Date picker field storing/emitting 'YYYY-MM-DD' strings (or null when cleared). */
export function DateField({
  label,
  value,
  onChange,
  allowClear = true,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  allowClear?: boolean;
}) {
  const colors = useThemeColors();
  const [showPicker, setShowPicker] = useState(false);

  function handleChange(event: DateTimePickerEvent, selected?: Date) {
    setShowPicker(Platform.OS === 'ios');
    if (event.type === 'dismissed') return;
    if (selected) onChange(toDateString(selected));
  }

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <View style={styles.row}>
        <Pressable
          onPress={() => setShowPicker(true)}
          style={[styles.button, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Text style={{ color: value ? colors.text : colors.textMuted, fontSize: 16 }}>
            {value ? formatDisplayDate(value) : 'Chọn ngày'}
          </Text>
        </Pressable>
        {allowClear && value ? (
          <Pressable onPress={() => onChange(null)} hitSlop={8} style={styles.clear}>
            <Text style={{ color: colors.danger, fontSize: 13 }}>Xóa</Text>
          </Pressable>
        ) : null}
      </View>
      {showPicker ? (
        <DateTimePicker
          value={value ? fromDateString(value) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexGrow: 1,
  },
  clear: {
    paddingHorizontal: 4,
  },
});
