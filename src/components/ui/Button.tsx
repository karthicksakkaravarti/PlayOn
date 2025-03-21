import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import theme, { colors, radius, spacing } from '../../constants/theme';
import Text from './Text';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
}

/**
 * Button component with variants and loading state
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  textColor,
  style,
  textStyle,
  children,
  ...rest
}) => {
  // Determine text color based on variant and disabled state
  const getTextColor = () => {
    if (textColor) return textColor;
    if (disabled) return colors.text.disabled;
    
    switch (variant) {
      case 'primary':
        return colors.primary.contrast;
      case 'secondary':
        return colors.secondary.contrast;
      case 'outlined':
      case 'text':
        return colors.primary.main;
      default:
        return colors.primary.contrast;
    }
  };

  // Create an array of styles for the text
  const textStyles = [
    styles.buttonText,
    styles[`${size}Text`],
    textStyle,
  ];

  // Only add icon spacing if we have icons
  if (startIcon || endIcon) {
    textStyles.push(styles.textWithIcon);
  }

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
        />
      ) : (
        <>
          {startIcon}
          <Text
            variant="button"
            color={getTextColor()}
            style={textStyles}
          >
            {children}
          </Text>
          {endIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  primary: {
    backgroundColor: colors.primary.main,
  },
  secondary: {
    backgroundColor: colors.secondary.main,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  text: {
    backgroundColor: 'transparent',
  },
  small: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 32,
  },
  medium: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  large: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    textAlign: 'center',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  textWithIcon: {
    marginHorizontal: spacing.xs,
  },
});

export default Button; 