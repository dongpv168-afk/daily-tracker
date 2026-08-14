import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { FormInput } from '@/components/common/FormInput';
import { KeyboardAwareScreen } from '@/components/common/KeyboardAwareScreen';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { useThemeColors } from '@/hooks/useThemeColors';
import { authErrorMessage, signUp } from '@/services/auth.service';

export default function SignupScreen() {
  const colors = useThemeColors();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    if (!email.trim() || !password) {
      setError('Nhập đầy đủ email và mật khẩu.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu tối thiểu 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, displayName);
      router.replace('/(tabs)');
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAwareScreen>
      <Text style={[styles.title, { color: colors.text }]}>Tạo tài khoản</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Dùng chung tài khoản này trên mọi thiết bị để đồng bộ dữ liệu
      </Text>

      <FormInput label="Tên hiển thị" value={displayName} onChangeText={setDisplayName} placeholder="Tên của bạn" />
      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
      />
      <FormInput
        label="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Tối thiểu 6 ký tự"
      />
      <FormInput
        label="Nhập lại mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Nhập lại mật khẩu"
      />
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

      <PrimaryButton title="Đăng ký" onPress={handleSubmit} loading={loading} />
      <Link href="/(auth)/login" style={[styles.link, { color: colors.primary }]}>
        Đã có tài khoản? Đăng nhập
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
