import { Platform } from 'react-native';

export const colors = {
  bg: '#F6F4EF',
  surface: '#FFFFFF',
  ink: '#121A16',
  muted: '#5A6660',
  border: '#E5E1D8',
  line: '#EEF0EA',

  primary: '#0E5A3A',
  primaryDark: '#0B4129',
  primarySoft: '#E5EFE8',
  tabActive: '#1C7A52',

  accent: '#B0541A',
  accentText: '#8A4A12',
  accentSoft: '#FDEBDD',

  danger: '#A8372B',
  dangerSoft: '#FBE6E3',
  blue: '#23498A',
  blueSoft: '#E6EEFA',
  amber: '#7A4F00',
  amberSoft: '#FFF1D6',
  purple: '#5A3290',
  purpleSoft: '#F0E8FA',
  gray: '#4A524D',
  graySoft: '#ECEDEA',
  gold: '#C9962C',

  dark: '#121A16',
  darkMuted: '#A7B2AB',
  white: '#FFFFFF',
};

export const radius = { sm: 12, md: 16, lg: 22, xl: 26, pill: 999 };

export const shadow = {
  shadowColor: '#121A16',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 3,
};

export const fonts = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
};

// Colour of each donation status badge
export const statusColors: Record<string, { bg: string; fg: string }> = {
  Posted: { bg: colors.blueSoft, fg: colors.blue },
  Accepted: { bg: colors.amberSoft, fg: colors.amber },
  'Picked up': { bg: colors.purpleSoft, fg: colors.purple },
  Delivered: { bg: colors.primarySoft, fg: colors.primaryDark },
  Expired: { bg: colors.graySoft, fg: colors.gray },
  Cancelled: { bg: colors.dangerSoft, fg: '#8E2E24' },
  Removed: { bg: colors.dangerSoft, fg: '#8E2E24' },
};
