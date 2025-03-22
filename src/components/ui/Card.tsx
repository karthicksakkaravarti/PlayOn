import React from 'react';
import { 
  View, 
  StyleSheet, 
  StyleProp, 
  ViewStyle, 
  Pressable, 
  PressableProps 
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface CardProps extends PressableProps {
  /**
   * Content to render inside the card
   */
  children: React.ReactNode;
  
  /**
   * Whether the card is interactive (pressable)
   * @default false
   */
  interactive?: boolean;
  
  /**
   * Additional styles for the card
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Elevation level of the card (0-5)
   * @default 1
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  
  /**
   * Whether to display the card with a border
   * @default false
   */
  bordered?: boolean;
  
  /**
   * Whether to make the card's corners rounded
   * @default true
   */
  rounded?: boolean;
  
  /**
   * Padding preset to apply to the card
   * @default "medium"
   */
  padding?: 'none' | 'small' | 'medium' | 'large';
}

/**
 * Card component for displaying content in a contained, styled box
 */
export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  style,
  elevation = 1,
  bordered = false,
  rounded = true,
  padding = 'medium',
  onPress,
  ...rest
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  
  const CardContainer = interactive ? Pressable : View;
  
  // Calculate shadow values based on elevation
  const getShadowStyle = (el: number): ViewStyle => {
    if (el === 0) return {};
    
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: el },
      shadowOpacity: 0.1 + (el * 0.03),
      shadowRadius: el * 2,
      elevation: el * 2, // Android
    };
  };
  
  // Calculate padding based on preset
  const getPadding = (size: string): number => {
    switch (size) {
      case 'none': return 0;
      case 'small': return spacing.sm;
      case 'large': return spacing.lg;
      case 'medium':
      default: return spacing.md;
    }
  };
  
  const cardStyle = StyleSheet.create({
    container: {
      backgroundColor: colors.background.light,
      borderRadius: rounded ? radius.md : 0,
      padding: getPadding(padding),
      ...(bordered ? { borderWidth: 1, borderColor: colors.border.light } : {}),
      ...getShadowStyle(elevation),
    },
  });

  return (
    <CardContainer
      style={[cardStyle.container, style]}
      {...(interactive ? { onPress } : {})}
      {...rest}
    >
      {children}
    </CardContainer>
  );
}; 