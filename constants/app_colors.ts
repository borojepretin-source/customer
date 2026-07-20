export const AppColors = {
  // Primary Gradient
  primaryStart: '#E6007A', // Pink #E6007A
  primaryEnd: '#E6007A',

  // Background
  bgDark: '#FFFFFF',
  bgMid: '#FFFFFF',
  bgLight: '#FFFFFF',

  // Surface / Card (White, thin gray border)
  glassLight: '#FFFFFF',
  glassMid: '#FFFFFF',
  glassBorder: '#E2E8F0', // Thin gray border

  // Text
  textPrimary: '#1B1B1B', // Hitam #1B1B1B
  textSecondary: '#4A4A4A',
  textMuted: '#7A7A7A',
  textHint: '#B0B0B0',

  // Status
  success: '#4CAF50',
  error: '#FF5252',
  warning: '#FFB74D',
  info: '#29B6F6',

  // Accent
  accentPurple: '#E6007A',
  accentBlue: '#E6007A',
  accentPink: '#E6007A',
  accentTeal: '#E6007A',

  // Overlay (ARGB to RGBA)
  overlayDark: 'rgba(0, 0, 0, 0.2)', // 0x33 is 51/255 = 20%
  overlayLight: 'rgba(255, 255, 255, 0.067)', // 0x11 is 17/255 = 6.7%

  // Gradient definitions as CSS strings
  gradients: {
    primaryGradient: 'linear-gradient(to right, #E6007A, #E6007A)',
    primaryGradientVertical: 'linear-gradient(to bottom, #E6007A, #E6007A)',
    backgroundGradient: 'linear-gradient(to bottom right, #FFFFFF, #FFFFFF, #FFFFFF)',
    cardGradient: 'linear-gradient(to bottom right, #FFFFFF, #FFFFFF)',
    shimmerGradient: 'linear-gradient(90deg, #F1F5F9 0%, #E2E8F0 50%, #F1F5F9 100%)',
  },
} as const;
