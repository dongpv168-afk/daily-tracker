import { useColorScheme } from 'react-native';
import { colors, ThemeColors } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

/** Returns the palette matching the user's theme preference (or system setting, if set to "system"). */
export function useThemeColors(): ThemeColors {
  const systemScheme = useColorScheme();
  const preference = useThemeStore((state) => state.preference);
  const scheme = preference === 'system' ? systemScheme : preference;
  return scheme === 'dark' ? colors.dark : colors.light;
}

/** Resolves the same effective scheme useThemeColors uses, for callers that just need 'light' | 'dark'. */
export function useEffectiveScheme(): 'light' | 'dark' {
  const systemScheme = useColorScheme();
  const preference = useThemeStore((state) => state.preference);
  const scheme = preference === 'system' ? systemScheme : preference;
  return scheme === 'dark' ? 'dark' : 'light';
}
