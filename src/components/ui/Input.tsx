import React, { useState, useRef, forwardRef } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

// Icon types - assuming we're using icons from a library
type IconPosition = 'left' | 'right';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /**
   * Label text to display above the input
   */
  label?: string;
  
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  
  /**
   * Error message to display when input is invalid
   */
  error?: string;
  
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether the input is required
   * @default false
   */
  required?: boolean;
  
  /**
   * Content to render on the left side of the input
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Content to render on the right side of the input
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Custom style for the input container
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Custom style for the input
   */
  inputStyle?: StyleProp<TextStyle>;
  
  /**
   * Input variant
   * @default "outlined"
   */
  variant?: 'outlined' | 'filled' | 'underlined';
  
  /**
   * Function called when the clear button is pressed
   */
  onClear?: () => void;
  
  /**
   * Whether to show a clear button when the input has text
   * @default false
   */
  clearable?: boolean;
}

/**
 * Input component for text entry with various styling options
 */
export const Input = forwardRef<TextInput, InputProps>(({
  label,
  helperText,
  error,
  disabled = false,
  required = false,
  placeholder,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  variant = 'outlined',
  onFocus,
  onBlur,
  clearable = false,
  onClear,
  onChangeText,
  value,
  secureTextEntry,
  ...rest
}, ref) => {
  const { theme } = useTheme();
  const { colors, typography, spacing, radius } = theme;
  
  const [isFocused, setIsFocused] = useState(false);
  const [secureText, setSecureText] = useState(secureTextEntry);
  
  // Animation for label
  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;
  
  // Handle focus event
  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    Animated.timing(labelAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    if (onFocus) {
      onFocus(e);
    }
  };
  
  // Handle blur event
  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(labelAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    
    if (onBlur) {
      onBlur(e);
    }
  };
  
  // Handle text change
  const handleChangeText = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    }
  };
  
  // Handle clear button press
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChangeText) {
      onChangeText('');
    }
  };
  
  // Toggle password visibility
  const toggleSecureText = () => {
    setSecureText(!secureText);
  };
  
  // Determine border color based on state
  const getBorderColor = () => {
    if (error) return colors.system.error;
    if (isFocused) return colors.primary.main;
    return colors.border.light;
  };
  
  // Determine fill color based on variant and state
  const getBackgroundColor = () => {
    if (disabled) return colors.grey[200];
    if (variant === 'filled') return colors.grey[100];
    return 'transparent';
  };
  
  // Style variables for different variants
  const variantStyles: Record<string, ViewStyle> = {
    outlined: {
      borderWidth: 1,
      borderColor: getBorderColor(),
      borderRadius: radius.md,
    },
    filled: {
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: getBorderColor(),
      backgroundColor: getBackgroundColor(),
      borderRadius: radius.sm,
    },
    underlined: {
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: getBorderColor(),
      paddingHorizontal: 0,
    },
  };
  
  // Label animation styles
  const labelStyle = {
    position: 'absolute',
    left: leftIcon ? spacing.xl : spacing.sm,
    top: Animated.multiply(
      Animated.add(
        Animated.multiply(labelAnimation, -1),
        1
      ),
      20
    ).interpolate({
      inputRange: [0, 20],
      outputRange: [0, 20],
    }),
    fontSize: Animated.multiply(
      Animated.add(
        Animated.multiply(labelAnimation, -1),
        1
      ),
      -2
    ).interpolate({
      inputRange: [-2, 0],
      outputRange: [typography.fontSize.xs, typography.fontSize.md],
    }),
    color: error 
      ? colors.system.error 
      : isFocused 
        ? colors.primary.main 
        : colors.text.secondary,
    backgroundColor: variant === 'outlined' ? colors.background.light : 'transparent',
    paddingHorizontal: variant === 'outlined' ? spacing.xxs : 0,
    zIndex: 1,
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <Animated.Text style={[labelStyle]}>
          {label}
          {required && <Text style={{ color: colors.system.error }}> *</Text>}
        </Animated.Text>
      )}
      
      {/* Input Container */}
      <View style={[
        styles.inputContainer,
        variantStyles[variant],
        { paddingLeft: leftIcon ? spacing.xl : spacing.md },
      ]}>
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        {/* Text Input */}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              color: disabled ? colors.text.disabled : colors.text.primary,
              fontFamily: typography.fontFamily.regular,
              fontSize: typography.fontSize.md,
            },
            inputStyle,
          ]}
          placeholder={isFocused || !label ? placeholder : ''}
          placeholderTextColor={colors.text.disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          value={value}
          editable={!disabled}
          secureTextEntry={secureText}
          {...rest}
        />
        
        {/* Clear Button */}
        {clearable && value && (
          <TouchableOpacity onPress={handleClear} style={styles.rightIcon}>
            <Text style={{ fontSize: typography.fontSize.lg, color: colors.text.disabled }}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
        
        {/* Password Toggle Button */}
        {secureTextEntry && (
          <TouchableOpacity onPress={toggleSecureText} style={styles.rightIcon}>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
              {secureText ? 'SHOW' : 'HIDE'}
            </Text>
          </TouchableOpacity>
        )}
        
        {/* Right Icon */}
        {rightIcon && !clearable && !secureTextEntry && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {/* Helper Text or Error */}
      {(helperText || error) && (
        <Text
          style={[
            styles.helperText,
            {
              color: error ? colors.system.error : colors.text.secondary,
              fontFamily: typography.fontFamily.regular,
              fontSize: typography.fontSize.xs,
            },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    minHeight: 56,
  },
  input: {
    flex: 1,
    height: 48,
    paddingVertical: 8,
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    marginTop: 4,
    marginLeft: 12,
  },
}); 