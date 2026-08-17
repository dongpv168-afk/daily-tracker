import * as Haptics from 'expo-haptics';

// expo-haptics rejects on platforms/devices without a vibration engine (e.g. some
// Android emulators) — swallow that so a missing haptic never crashes a tap handler.
function safe(trigger: () => Promise<void>) {
  trigger().catch(() => {});
}

/** Light tap feedback for toggling a checkbox/switch. */
export function hapticToggle() {
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

/** Feedback for a destructive action (delete) actually going through. */
export function hapticDelete() {
  safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
}

/** Feedback for picking one option among several (filter chips, theme picker...). */
export function hapticSelect() {
  safe(() => Haptics.selectionAsync());
}
