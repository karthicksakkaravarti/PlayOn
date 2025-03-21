import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * PlayOn App Theme
 * 
 * This file contains all the theme-related constants such as
 * colors, typography, spacing, shadows, etc.
 */

// Colors
export const colors = {
  // Primary colors
  primary: {
    main: '#0066CC',
    light: '#4D94DB',
    dark: '#004999',
    contrast: '#FFFFFF',
  },
  // Secondary colors
  secondary: {
    main: '#00CC99',
    light: '#4DDBB5',
    dark: '#009973',
    contrast: '#FFFFFF',
  },
  // Accent colors
  accent: {
    main: '#FFC107',
    light: '#FFD54F',
    dark: '#FF8F00',
    contrast: '#000000',
  },
  // Grey palette
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  // System colors
  system: {
    success: '#4CAF50',
    info: '#2196F3',
    warning: '#FF9800',
    error: '#F44336',
    disabled: '#9E9E9E',
  },
  // Background colors
  background: {
    light: '#FFFFFF',
    dark: '#121212',
    grey: '#F5F5F5',
  },
  // Text colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9E9E9E',
    light: '#FFFFFF',
  },
  // Border colors
  border: {
    light: '#E0E0E0',
    dark: '#616161',
  },
};

// Typography
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    display: 36,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 30,
    xxl: 36,
    xxxl: 42,
    display: 48,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
};

// Spacing
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

// Radius
export const radius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 9999,
};

// Shadows
export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Screen dimensions
export const screen = {
  width,
  height,
};

// Theme object
export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  screen,
  isDark: false,
};

export type Theme = typeof theme;

export default theme; 