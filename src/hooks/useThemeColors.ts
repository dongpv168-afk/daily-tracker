import { useColorScheme } from 'react-native';
import { colors, ThemeColors } from '@/constants/colors';

/** Returns the palette matching the current system light/dark mode. */
export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === 'dark' ? colors.dark : colors.light;
}
