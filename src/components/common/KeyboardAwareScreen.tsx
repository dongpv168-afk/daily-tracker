import { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { Screen } from '@/components/common/Screen';

/**
 * Screen wrapper for forms: keeps the focused input above the keyboard on both platforms by
 * combining KeyboardAvoidingView with a scrollable, flex-grown content area (rather than relying
 * on a fixed vertical offset, which breaks across device/status-bar sizes).
 */
export function KeyboardAwareScreen({ children }: PropsWithChildren) {
  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    gap: 14,
  },
});
