import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { FormInput } from '@/components/common/FormInput';
import { KeyboardAwareScreen } from '@/components/common/KeyboardAwareScreen';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { useThemeColors } from '@/hooks/useThemeColors';
import { authErrorMessage, resetPassword } from '@/services/auth.service';

export default function ForgotPasswordScreen() {
  const colors = useThemeColors();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    if (!email.trim()) {
      setError('Nhập email của bạn.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAwareScreen>
      <Text style={[styles.title, { color: colors.text }]}>Quên mật khẩu</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu.
      </Text>

      {sent ? (
        <Text style={[styles.success, { color: colors.text }]}>
          Nếu email này đã đăng ký, một email đặt lại mật khẩu đã được gửi tới hộp thư của bạn.
          Kiểm tra cả mục Spam nếu chưa thấy.
        </Text>
      ) : (
        <>
          <FormInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
          />
          {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
          <PrimaryButton title="Gửi email đặt lại mật khẩu" onPress={handleSubmit} loading={loading} />
        </>
      )}

      <Link href="/(auth)/login" style={[styles.link, { color: colors.primary }]}>
        Quay lại đăng nhập
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
  success: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
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
