import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Screen } from '@/components/common/Screen';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColors } from '@/hooks/useThemeColors';
import { signOutUser } from '@/services/auth.service';
import { ThemePreference, useThemeStore } from '@/store/themeStore';
import { hapticSelect } from '@/utils/haptics';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Theo hệ thống' },
  { value: 'light', label: 'Sáng' },
  { value: 'dark', label: 'Tối' },
];

export default function SettingsScreen() {
  const colors = useThemeColors();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);

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
      <Pressable onPress={() => router.push('/edit-profile')}>
        <Text style={[styles.editLink, { color: colors.primary }]}>Sửa thông tin</Text>
      </Pressable>

      <PrimaryButton title="Đăng xuất" onPress={handleSignOut} loading={loading} variant="ghost" />

      <Text style={[styles.label, { color: colors.textMuted, marginTop: 32 }]}>Giao diện</Text>
      <View style={styles.themeRow}>
        {THEME_OPTIONS.map((option) => {
          const selected = option.value === preference;
          return (
            <Pressable
              key={option.value}
              onPress={() => {
                if (option.value !== preference) hapticSelect();
                setPreference(option.value);
              }}
              style={[
                styles.themeChip,
                {
                  backgroundColor: selected ? colors.primary : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.themeChipText, { color: selected ? '#fff' : colors.text }]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.version, { color: colors.textMuted }]}>
        Daily Tracker phiên bản {Constants.expoConfig?.version ?? '—'}
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
  editLink: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  themeChip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  themeChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  version: {
    fontSize: 12,
    marginTop: 40,
    textAlign: 'center',
  },
});
