import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export interface AlertProps {
  /**
   * The type/severity of the alert
   * @default "info"
   */
  type?: 'info' | 'success' | 'warning' | 'error';
  
  /**
   * The title of the alert
   */
  title?: string;
  
  /**
   * The message content of the alert
   */
  message: string;
  
  /**
   * Whether the alert is dismissible
   * @default false
   */
  dismissible?: boolean;
  
  /**
   * Function to call when the alert is dismissed
   */
  onDismiss?: () => void;
  
  /**
   * Icon to display at the start of the alert
   */
  icon?: React.ReactNode;
  
  /**
   * Additional content to display below the message
   */
  children?: React.ReactNode;
  
  /**
   * Custom style for the alert container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Custom style for the title text
   */
  titleStyle?: StyleProp<TextStyle>;
  
  /**
   * Custom style for the message text
   */
  messageStyle?: StyleProp<TextStyle>;
  
  /**
   * Whether the alert is outlined instead of filled
   * @default false
   */
  outlined?: boolean;
  
  /**
   * Whether the alert is elevated with a shadow
   * @default false
   */
  elevated?: boolean;
  
  /**
   * Whether the alert takes up the full width
   * @default true
   */
  fullWidth?: boolean;
}

/**
 * Alert component for displaying informational messages to users
 */
export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  icon,
  children,
  style,
  titleStyle,
  messageStyle,
  outlined = false,
  elevated = false,
  fullWidth = true,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius, typography } = theme;
  
  // Get colors based on type
  const getTypeColors = () => {
    switch (type) {
      case 'success':
        return {
          background: 'rgba(76, 175, 80, 0.1)',
          border: colors.system.success,
          color: colors.system.success,
        };
      case 'warning':
        return {
          background: 'rgba(255, 152, 0, 0.1)',
          border: colors.system.warning,
          color: colors.system.warning,
        };
      case 'error':
        return {
          background: 'rgba(244, 67, 54, 0.1)',
          border: colors.system.error,
          color: colors.system.error,
        };
      case 'info':
      default:
        return {
          background: 'rgba(33, 150, 243, 0.1)',
          border: colors.system.info,
          color: colors.system.info,
        };
    }
  };
  
  const typeColors = getTypeColors();
  
  // Create alert styles
  const alertStyles = StyleSheet.create({
    container: {
      borderRadius: radius.md,
      borderWidth: outlined ? 1 : 0,
      borderLeftWidth: outlined ? 1 : 4,
      borderColor: typeColors.border,
      backgroundColor: outlined ? 'transparent' : typeColors.background,
      padding: spacing.md,
      width: fullWidth ? '100%' : 'auto',
      ...(elevated
        ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.5,
            elevation: 2,
          }
        : {}),
    },
    content: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    iconContainer: {
      marginRight: spacing.sm,
      paddingTop: 2,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      color: typeColors.color,
      marginBottom: spacing.xs,
    },
    message: {
      color: colors.text.primary,
    },
    dismissButton: {
      marginLeft: spacing.md,
      padding: spacing.xs,
    },
    dismissText: {
      fontSize: typography.fontSize.lg,
      color: colors.text.secondary,
      lineHeight: typography.fontSize.lg,
    },
    childrenContainer: {
      marginTop: spacing.md,
    },
  });
  
  return (
    <View style={[alertStyles.container, style]}>
      <View style={alertStyles.content}>
        {/* Icon */}
        {icon && <View style={alertStyles.iconContainer}>{icon}</View>}
        
        {/* Text Content */}
        <View style={alertStyles.textContainer}>
          {/* Title */}
          {title && (
            <Text
              variant="h5"
              weight="bold"
              style={[alertStyles.title, titleStyle]}
            >
              {title}
            </Text>
          )}
          
          {/* Message */}
          <Text
            variant="body1"
            style={[alertStyles.message, messageStyle]}
          >
            {message}
          </Text>
        </View>
        
        {/* Dismiss Button */}
        {dismissible && onDismiss && (
          <TouchableOpacity
            style={alertStyles.dismissButton}
            onPress={onDismiss}
          >
            <Text style={alertStyles.dismissText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Additional Content */}
      {children && (
        <View style={alertStyles.childrenContainer}>{children}</View>
      )}
    </View>
  );
}; 