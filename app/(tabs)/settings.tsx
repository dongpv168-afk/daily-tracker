import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Screen } from '@/components/common/Screen';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColors } from '@/hooks/useThemeColors';
import { signOutUser } from '@/services/auth.service';

export default function SettingsScreen() {
  const colors = useThemeColors();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      await signOutUser();
      // Root layout's auth guard redirects to (auth) automatically once user becomes null.
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Cài đặt</Text>

      <Text style={[styles.label, { color: colors.textMuted }]}>Tài khoản</Text>
      <Text style={[styles.value, { color: colors.text }]}>{user?.displayName || 'Chưa đặt tên'}</Text>
      <Text style={[styles.value, { color: colors.textMuted }]}>{user?.email}</Text>

      <PrimaryButton title="Đăng xuất" onPress={handleSignOut} loading={loading} variant="ghost" />

      <Text style={[styles.note, { color: colors.textMuted }]}>
        Thông báo, tiền tệ, theme sẽ có ở Phase 7.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 80,
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
  },
  note: {
    fontSize: 13,
    marginTop: 32,
  },
});
