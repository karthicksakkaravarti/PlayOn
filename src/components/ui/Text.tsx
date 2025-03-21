import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import theme, { typography } from '../../constants/theme';

export interface TextProps extends RNTextProps {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body1' | 'body2' | 'caption' | 'button';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'bold' | '400' | '500' | '700';
  children: React.ReactNode;
}

// Mapping our semantic weights to React Native weights
const fontWeightMap = {
  regular: 'normal' as const,
  medium: '500' as const,
  bold: 'bold' as const,
};

/**
 * Custom Text component with typography styles from theme
 */
export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color,
  align,
  weight,
  style,
  children,
  ...rest
}) => {
  return (
    <RNText
      style={[
        styles.base,
        styles[variant],
        align && { textAlign: align },
        weight && { fontWeight: weight },
        color && { color },
        style, // Allow custom overrides
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    color: theme.colors.text.primary,
    fontFamily: typography.fontFamily.regular,
  },
  display: {
    fontSize: typography.fontSize.display,
    lineHeight: typography.lineHeight.display,
    fontWeight: 'bold',
  },
  h1: {
    fontSize: typography.fontSize.xxxl,
    lineHeight: typography.lineHeight.xxxl,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.lineHeight.xxl,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.xl,
    fontWeight: 'bold',
  },
  h4: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: '500',
  },
  h5: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontWeight: '500',
  },
  body1: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontWeight: 'normal',
  },
  body2: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    fontWeight: 'normal',
  },
  button: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});

export default Text; 