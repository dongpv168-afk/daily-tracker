import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { FormInput } from '@/components/common/FormInput';
import { KeyboardAwareScreen } from '@/components/common/KeyboardAwareScreen';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { useThemeColors } from '@/hooks/useThemeColors';
import { authErrorMessage, signIn } from '@/services/auth.service';

export default function LoginScreen() {
  const colors = useThemeColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    if (!email.trim() || !password) {
      setError('Nhập đầy đủ email và mật khẩu.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAwareScreen>
      <Text style={[styles.title, { color: colors.text }]}>Daily Tracker</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>Đăng nhập để đồng bộ dữ liệu</Text>

      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
      />
      <FormInput label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

      <PrimaryButton title="Đăng nhập" onPress={handleSubmit} loading={loading} />
      <Link href="/(auth)/signup" style={[styles.link, { color: colors.primary }]}>
        Chưa có tài khoản? Đăng ký
      </Link>
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  error: {
    fontSize: 13,
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
  },
});
