import { AppColors } from './app_colors';
import { CSSProperties } from 'react';

export const AppTextStyles: Record<string, CSSProperties> = {
  // Display
  displayLarge: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '48px',
    fontWeight: '700',
    color: AppColors.textPrimary,
    letterSpacing: '-1.0px',
    lineHeight: 1.1,
  },

  displayMedium: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '36px',
    fontWeight: '700',
    color: AppColors.textPrimary,
    letterSpacing: '-0.5px',
    lineHeight: 1.2,
  },

  displaySmall: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '28px',
    fontWeight: '600',
    color: AppColors.textPrimary,
    letterSpacing: '-0.3px',
    lineHeight: 1.2,
  },

  // Headline
  headlineLarge: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '24px',
    fontWeight: '600',
    color: AppColors.textPrimary,
    lineHeight: 1.3,
  },

  headlineMedium: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '20px',
    fontWeight: '600',
    color: AppColors.textPrimary,
    lineHeight: 1.3,
  },

  headlineSmall: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '18px',
    fontWeight: '600',
    color: AppColors.textPrimary,
    lineHeight: 1.3,
  },

  // Title
  titleLarge: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '16px',
    fontWeight: '600',
    color: AppColors.textPrimary,
    lineHeight: 1.4,
  },

  titleMedium: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
    fontWeight: '500',
    color: AppColors.textPrimary,
    lineHeight: 1.4,
  },

  // Body
  bodyLarge: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '16px',
    fontWeight: '400',
    color: AppColors.textPrimary,
    lineHeight: 1.5,
  },

  bodyMedium: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
    fontWeight: '400',
    color: AppColors.textSecondary,
    lineHeight: 1.5,
  },

  bodySmall: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '12px',
    fontWeight: '400',
    color: AppColors.textMuted,
    lineHeight: 1.5,
  },

  // Label
  labelLarge: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '16px',
    fontWeight: '600',
    color: AppColors.textPrimary,
    letterSpacing: '0.5px',
  },

  labelMedium: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
    fontWeight: '500',
    color: AppColors.textSecondary,
    letterSpacing: '0.3px',
  },

  // Special
  timerDisplay: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '32px',
    fontWeight: '700',
    color: AppColors.textPrimary,
    letterSpacing: '2.0px',
  },

  countdown: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '120px',
    fontWeight: '700',
    color: AppColors.textPrimary,
    letterSpacing: '-4.0px',
    lineHeight: 1.0,
  },

  buttonText: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '16px',
    fontWeight: '600',
    color: AppColors.textPrimary,
    letterSpacing: '1.0px',
  },

  inputText: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '18px',
    fontWeight: '500',
    color: AppColors.textPrimary,
    letterSpacing: '2.0px',
  },
} as const;
