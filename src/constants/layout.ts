import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * PlayOn App Layout Utilities
 * 
 * This file contains utility functions and constants for layout calculations,
 * responsive design, and device-specific adjustments.
 */

// Device dimensions
export const window = {
  width,
  height,
};

// Detect screen size
export const isSmallDevice = width < 375;
export const isMediumDevice = width >= 375 && width < 768;
export const isLargeDevice = width >= 768;

// Platform constants
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Status bar height (useful for safe area calculations)
export const statusBarHeight = isIOS
  ? 20
  : StatusBar.currentHeight || 0;

// Get scale based on current device width
const guidelineBaseWidth = 375;
export const scale = (size: number) => (width / guidelineBaseWidth) * size;

// Get vertical scale based on current device height
const guidelineBaseHeight = 812;
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

// Get moderate scale (less dramatic scaling for typography and fine elements)
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Calculate padding for safe areas
export const safeAreaInsets = {
  top: isIOS ? 44 : statusBarHeight,
  bottom: isIOS ? 34 : 0,
  left: 0,
  right: 0,
};

// Calculate screen dimensions without safe areas
export const usableScreenDimensions = {
  width: window.width,
  height: window.height - safeAreaInsets.top - safeAreaInsets.bottom,
};

// Grid system
export const grid = {
  column: 4,
  columnWidth: width / 4,
  gutter: 16,
  margin: 16,
};

// Default screen padding
export const screenPadding = {
  horizontal: 16,
  vertical: 16,
};

export default {
  window,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isIOS,
  isAndroid,
  statusBarHeight,
  scale,
  verticalScale,
  moderateScale,
  safeAreaInsets,
  usableScreenDimensions,
  grid,
  screenPadding,
}; 