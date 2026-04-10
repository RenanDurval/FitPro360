// FitPro360 Design System
export const Colors = {
  primary: '#00D4AA',
  primaryDark: '#00B894',
  primaryLight: '#55EFC4',
  accent: '#FF6B35',
  accentDark: '#E55A2B',
  danger: '#E94560',
  warning: '#FDCB6E',
  success: '#00B894',
  info: '#74B9FF',

  dark: {
    background: '#0A0A1A',
    surface: '#1A1A2E',
    card: '#16213E',
    cardAlt: '#0F3460',
    text: '#FFFFFF',
    textSecondary: '#A0A0B8',
    textMuted: '#6C6C80',
    border: '#2A2A4A',
    overlay: 'rgba(0,0,0,0.6)',
  },

  gradient: {
    primary: ['#00D4AA', '#00B894'],
    accent: ['#FF6B35', '#E55A2B'],
    dark: ['#1A1A2E', '#0F3460'],
    card: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'],
    hero: ['#00D4AA', '#0F3460', '#1A1A2E'],
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  glow: {
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
};

export const Glass = {
  light: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
  },
  medium: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
  },
  dark: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
  },
};
