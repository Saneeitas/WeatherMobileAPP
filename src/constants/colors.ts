export const Colors = {
  // Primary palette
  primary: '#1a73e8',
  primaryLight: '#4da3ff',
  primaryDark: '#0d47a1',

  // Background gradients
  gradientWarm: ['#f7971e', '#ffd200'] as const,
  gradientCool: ['#2193b0', '#6dd5ed'] as const,
  gradientNight: ['#0f2027', '#203a43', '#2c5364'] as const,
  gradientClear: ['#56ccf2', '#2f80ed'] as const,
  gradientCloudy: ['#bdc3c7', '#2c3e50'] as const,
  gradientRainy: ['#4b6cb7', '#182848'] as const,

  // Temperature colors
  tempHot: '#e74c3c',
  tempWarm: '#f39c12',
  tempMild: '#27ae60',
  tempCool: '#3498db',
  tempCold: '#9b59b6',

  // Neutral colors
  white: '#ffffff',
  offWhite: '#f8f9fa',
  lightGray: '#e9ecef',
  mediumGray: '#adb5bd',
  darkGray: '#495057',
  charcoal: '#212529',
  black: '#000000',

  // Semantic colors
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',

  // Card and surface colors
  cardBackground: 'rgba(255, 255, 255, 0.15)',
  cardBackgroundSolid: '#ffffff',
  surfaceOverlay: 'rgba(0, 0, 0, 0.3)',

  // Text colors
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textDark: '#212529',
  textMuted: '#6c757d',
} as const;

export type ColorKey = keyof typeof Colors;
