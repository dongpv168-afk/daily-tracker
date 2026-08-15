import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { FormInput } from '@/components/common/FormInput';
import { KeyboardAwareScreen } from '@/components/common/KeyboardAwareScreen';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColors } from '@/hooks/useThemeColors';
import { updateDisplayName } from '@/services/auth.service';

export default function EditProfileScreen() {
  const colors = useThemeColors();
  const { user, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setError('');
    setSaving(true);
    try {
      await updateDisplayName(displayName);
      refreshUser();
      router.back();
    } catch {
      setError('Không lưu được, thử lại.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAwareScreen>
      <Text style={[styles.title, { color: colors.text }]}>Sửa thông tin</Text>

      <FormInput label="Tên hiển thị" value={displayName} onChangeText={setDisplayName} placeholder="Tên của bạn" />
      <Text style={[styles.value, { color: colors.textMuted }]}>{user?.email}</Text>

      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

      <PrimaryButton title="Lưu" onPress={handleSave} loading={saving} />
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
  value: {
    fontSize: 14,
    marginBottom: 8,
  },
  error: {
    fontSize: 13,
  },
});
