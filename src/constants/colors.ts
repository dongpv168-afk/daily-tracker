export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  success: string;
  danger: string;
  warning: string;
  tabInactive: string;
}

// Simple light/dark palette. Swap these values to re-theme the whole app.
export const colors: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    background: '#F7F7FA',
    surface: '#FFFFFF',
    text: '#1A1B25',
    textMuted: '#6B6F80',
    border: '#E3E4EA',
    primary: '#4F5DFF',
    success: '#20C997',
    danger: '#FF5C5C',
    warning: '#FFB020',
    tabInactive: '#9AA0B4',
  },
  dark: {
    background: '#101116',
    surface: '#1B1D26',
    text: '#F2F2F7',
    textMuted: '#9AA0B4',
    border: '#2A2C38',
    primary: '#7C87FF',
    success: '#2FE0A8',
    danger: '#FF7A7A',
    warning: '#FFC94D',
    tabInactive: '#5C6079',
  },
};
