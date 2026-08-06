export const Colors = {
  // Primary palette
  primary: '#2563EB',
  primaryLight: '#60A5FA',
  primaryDark: '#1D4ED8',

  // Background gradients
  gradientWarm: ['#F97316', '#FBBF24'] as const,
  gradientCool: ['#0EA5E9', '#38BDF8'] as const,
  gradientNight: ['#0F172A', '#1E293B', '#334155'] as const,
  gradientClear: ['#3B82F6', '#60A5FA'] as const,
  gradientCloudy: ['#64748B', '#1E293B'] as const,
  gradientRainy: ['#475569', '#0F172A'] as const,

  // Temperature colors
  tempHot: '#EF4444',
  tempWarm: '#F59E0B',
  tempMild: '#10B981',
  tempCool: '#3B82F6',
  tempCold: '#8B5CF6',

  // Neutral colors
  white: '#FFFFFF',
  offWhite: '#F8FAFC',
  lightGray: '#E2E8F0',
  mediumGray: '#94A3B8',
  darkGray: '#475569',
  charcoal: '#1E293B',
  black: '#0F172A',

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#06B6D4',

  // Card and surface colors
  cardBackground: 'rgba(255, 255, 255, 0.12)',
  cardBackgroundSolid: '#FFFFFF',
  surfaceOverlay: 'rgba(0, 0, 0, 0.4)',
  glassBg: 'rgba(255, 255, 255, 0.18)',
  glassBorder: 'rgba(255, 255, 255, 0.25)',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.75)',
  textDark: '#0F172A',
  textMuted: '#64748B',
} as const;

export type ColorKey = keyof typeof Colors;
