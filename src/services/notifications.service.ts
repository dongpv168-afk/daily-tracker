import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Creates the Android notification channel required on Android 8+. Safe to call multiple times. */
export async function setupNotificationChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Nhắc việc & thói quen',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

/** Requests permission only when the user actually turns a reminder on (not eagerly on app start). */
export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

/** Schedules a one-off reminder at an exact date/time for a todo. Returns null if permission was denied. */
export async function scheduleTodoReminder(title: string, date: Date): Promise<string | null> {
  const granted = await ensureNotificationPermission();
  if (!granted) return null;
  return Notifications.scheduleNotificationAsync({
    content: { title: 'Nhắc việc cần làm', body: title },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
  });
}

/** Schedules a daily-repeating reminder at a fixed hour:minute for a habit. Returns null if permission was denied. */
export async function scheduleHabitReminder(name: string, hour: number, minute: number): Promise<string | null> {
  const granted = await ensureNotificationPermission();
  if (!granted) return null;
  return Notifications.scheduleNotificationAsync({
    content: { title: 'Nhắc thói quen', body: name },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute },
  });
}

export async function cancelReminder(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
