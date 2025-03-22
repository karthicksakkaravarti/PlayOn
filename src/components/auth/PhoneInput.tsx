import React from 'react';
import { View, StyleSheet, TextInput, TextInputProps } from 'react-native';
import Text from '../ui/Text';
import { spacing, colors, radius, typography } from '../../constants/theme';

interface PhoneInputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  showCountryCode?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  error,
  showCountryCode = true,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text variant="body2" style={styles.label}>Phone Number</Text>
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputContainerError : null
      ]}>
        {showCountryCode && (
          <View style={styles.countryCode}>
            <Text variant="body1">+91</Text>
          </View>
        )}
        
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          placeholderTextColor={colors.text.secondary}
          {...props}
        />
      </View>
      
      {error ? (
        <Text variant="body2" style={styles.errorText}>{error}</Text>
      ) : null}
      
      <Text variant="body2" style={styles.helperText}>
        We'll send you a verification code to this number
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  inputContainerError: {
    borderColor: colors.system.error,
  },
  countryCode: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRightWidth: 1,
    borderRightColor: colors.border.light,
    backgroundColor: colors.background.grey,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  errorText: {
    color: colors.system.error,
    marginTop: spacing.xs,
  },
  helperText: {
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});

export default PhoneInput; 