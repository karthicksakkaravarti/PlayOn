import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export interface SpinnerProps {
  /**
   * Size of the spinner
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Color of the spinner
   */
  color?: string;
  
  /**
   * Whether to display the spinner with a backdrop
   * @default false
   */
  overlay?: boolean;
  
  /**
   * Text to display below the spinner
   */
  text?: string;
  
  /**
   * Custom style for the spinner container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Custom style for the text
   */
  textStyle?: StyleProp<TextStyle>;
  
  /**
   * Custom style for the overlay
   */
  overlayStyle?: StyleProp<ViewStyle>;
  
  /**
   * Whether the component is visible
   * @default true
   */
  visible?: boolean;
  
  /**
   * Whether to center the spinner in its container
   * @default true
   */
  centered?: boolean;
}

/**
 * Spinner component for displaying loading states
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color,
  overlay = false,
  text,
  style,
  textStyle,
  overlayStyle,
  visible = true,
  centered = true,
}) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  
  if (!visible) {
    return null;
  }
  
  // Get spinner size
  const getSize = (sizeType: string): 'small' | 'large' => {
    switch (sizeType) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      case 'medium':
      default:
        return 'small'; // React Native's "small" is close to what we'd call "medium"
    }
  };
  
  // Get activity indicator size in pixels for custom styles
  const getSizeInPixels = (sizeType: string): number => {
    switch (sizeType) {
      case 'small':
        return 24;
      case 'large':
        return 48;
      case 'medium':
      default:
        return 36;
    }
  };
  
  // Determine spinner color
  const spinnerColor = color || colors.primary.main;
  
  // Create spinner styles
  const spinnerStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      ...(centered ? { flex: 1 } : {}),
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
    },
    text: {
      marginTop: spacing.sm,
      textAlign: 'center',
      color: spinnerColor,
    },
    spinnerContainer: {
      backgroundColor: overlay ? colors.background.light : 'transparent',
      borderRadius: 8,
      padding: overlay ? spacing.lg : 0,
      ...(overlay ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      } : {}),
    },
  });
  
  // Create spinner component
  const SpinnerComponent = (
    <View style={[
      spinnerStyles.spinnerContainer,
      centered && !overlay && spinnerStyles.container,
      style
    ]}>
      <ActivityIndicator
        size={getSize(size)}
        color={spinnerColor}
      />
      {text && (
        <Text style={[spinnerStyles.text, textStyle]}>
          {text}
        </Text>
      )}
    </View>
  );
  
  // If overlay is true, render with backdrop
  if (overlay) {
    return (
      <View style={[spinnerStyles.overlay, overlayStyle]}>
        {SpinnerComponent}
      </View>
    );
  }
  
  // Otherwise, render standalone spinner
  return SpinnerComponent;
}; 