import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface BadgeProps {
  /**
   * Content to display inside the badge
   */
  content?: React.ReactNode;
  
  /**
   * Text content to display inside the badge
   */
  text?: string;
  
  /**
   * Value to display inside the badge (converted to string)
   */
  value?: number;
  
  /**
   * Maximum value to display (values above this will show as max+)
   * @default 99
   */
  max?: number;
  
  /**
   * Badge variant
   * @default "default"
   */
  variant?: 'default' | 'dot' | 'outline';
  
  /**
   * Position of the badge
   * @default "topRight"
   */
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  
  /**
   * Color of the badge
   */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  
  /**
   * Whether the badge is visible
   * @default true
   */
  visible?: boolean;
  
  /**
   * Custom background color for the badge
   */
  backgroundColor?: string;
  
  /**
   * Custom text color for the badge
   */
  textColor?: string;
  
  /**
   * Custom style for the badge container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Custom style for the badge text
   */
  textStyle?: StyleProp<TextStyle>;
  
  /**
   * Children to render as an anchoring element
   */
  children?: React.ReactNode;
  
  /**
   * Whether to add spacing around the badge
   * @default true
   */
  showZero?: boolean;
}

/**
 * Badge component for displaying notification counts or status indicators
 */
export const Badge: React.FC<BadgeProps> = ({
  content,
  text,
  value,
  max = 99,
  variant = 'default',
  position = 'topRight',
  color = 'primary',
  visible = true,
  backgroundColor,
  textColor,
  style,
  textStyle,
  children,
  showZero = false,
}) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  
  // If badge should be hidden
  if (!visible) {
    return <>{children}</>;
  }
  
  // If value is 0 and showZero is false, don't display
  if (value === 0 && !showZero && !text && !content) {
    return <>{children}</>;
  }
  
  // Get color based on variant
  const getBackgroundColor = (): string => {
    if (backgroundColor) return backgroundColor;
    
    switch (color) {
      case 'secondary': return colors.secondary.main;
      case 'success': return colors.system.success;
      case 'error': return colors.system.error;
      case 'warning': return colors.system.warning;
      case 'info': return colors.system.info;
      case 'primary':
      default: return colors.primary.main;
    }
  };
  
  // Get text color
  const getTextColor = (): string => {
    if (textColor) return textColor;
    
    switch (color) {
      case 'secondary': return colors.secondary.contrast;
      case 'success':
      case 'error':
      case 'warning':
      case 'info':
      case 'primary':
      default: return colors.primary.contrast;
    }
  };
  
  // Get badge content
  const getBadgeContent = (): React.ReactNode => {
    if (content) return content;
    
    if (text) return text;
    
    if (value !== undefined) {
      if (value > max) {
        return `${max}+`;
      }
      return value.toString();
    }
    
    return null;
  };
  
  // Get position style
  const getPositionStyle = (): ViewStyle => {
    switch (position) {
      case 'topLeft':
        return {
          top: 0,
          left: 0,
          transform: [{ translateX: -8 }, { translateY: -8 }],
        };
      case 'bottomRight':
        return {
          bottom: 0,
          right: 0,
          transform: [{ translateX: 8 }, { translateY: 8 }],
        };
      case 'bottomLeft':
        return {
          bottom: 0,
          left: 0,
          transform: [{ translateX: -8 }, { translateY: 8 }],
        };
      case 'topRight':
      default:
        return {
          top: 0,
          right: 0,
          transform: [{ translateX: 8 }, { translateY: -8 }],
        };
    }
  };
  
  // Get variant style
  const getVariantStyle = (): ViewStyle => {
    const bgColor = getBackgroundColor();
    
    switch (variant) {
      case 'dot':
        return {
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: bgColor,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: bgColor,
        };
      case 'default':
      default:
        return {
          backgroundColor: bgColor,
        };
    }
  };
  
  // Create badge styles
  const badgeStyles = StyleSheet.create({
    container: {
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      zIndex: 1,
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
      ...getPositionStyle(),
      ...getVariantStyle(),
    },
    text: {
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fontFamily.medium,
      color: variant === 'outline' ? getBackgroundColor() : getTextColor(),
      textAlign: 'center',
    },
    standalone: {
      position: 'relative',
      transform: [{ translateX: 0 }, { translateY: 0 }],
    },
  });
  
  // If there are no children, render standalone badge
  if (!children) {
    return (
      <View style={[badgeStyles.badge, badgeStyles.standalone, style]}>
        {variant !== 'dot' && (
          <Text style={[badgeStyles.text, textStyle]}>
            {getBadgeContent()}
          </Text>
        )}
      </View>
    );
  }
  
  // Render badge with children
  return (
    <View style={badgeStyles.container}>
      {children}
      <View style={[badgeStyles.badge, style]}>
        {variant !== 'dot' && (
          <Text style={[badgeStyles.text, textStyle]}>
            {getBadgeContent()}
          </Text>
        )}
      </View>
    </View>
  );
};