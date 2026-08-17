import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Screen } from '@/components/common/Screen';
import { useAuth, useAuthListener } from '@/hooks/useAuth';
import { useEffectiveScheme, useThemeColors } from '@/hooks/useThemeColors';
import { setupNotificationChannel } from '@/services/notifications.service';

export default function RootLayout() {
  const scheme = useEffectiveScheme();
  const colors = useThemeColors();
  useAuthListener();
  const { isInitializing, isSignedIn } = useAuth();

  useEffect(() => {
    setupNotificationChannel();
  }, []);

  if (isInitializing) {
    // Waiting on the first onAuthStateChanged callback (session restore from storage).
    return (
      <GestureHandlerRootView style={styles.flex}>
        <Screen style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </Screen>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="edit-profile" options={{ presentation: 'modal' }} />
          <Stack.Screen name="todo/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="habit/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="transaction/[id]" options={{ presentation: 'modal' }} />
        </Stack.Protected>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
