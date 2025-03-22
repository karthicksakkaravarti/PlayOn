import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableWithoutFeedback, 
  Platform 
} from 'react-native';
import Text from '../ui/Text';
import { colors, spacing, radius, typography } from '../../constants/theme';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({ 
  value, 
  onChange, 
  length = 6, 
  error 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  useEffect(() => {
    // Auto focus on component mount
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);
  
  const handlePress = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  const handleChangeText = (text: string) => {
    // Only allow digits
    const formattedText = text.replace(/[^0-9]/g, '');
    
    // Limit to specified length
    if (formattedText.length <= length) {
      onChange(formattedText);
    }
  };

  // Create an array with the length equal to OTP length
  const otpBoxArray = Array(length).fill(0);

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          {otpBoxArray.map((_, index) => {
            const digit = value[index] || '';
            const isCurrentPosition = index === value.length;
            const isFilledBox = digit !== '';
            
            return (
              <View
                key={index}
                style={[
                  styles.box,
                  isFocused && isCurrentPosition && styles.boxFocused,
                  error ? styles.boxError : null,
                ]}
              >
                <Text style={styles.digit}>{digit}</Text>
                {isFocused && isCurrentPosition && <View style={styles.cursor} />}
              </View>
            );
          })}
        </View>
        
        {error && <Text variant="caption" style={styles.errorText}>{error}</Text>}
        
        {/* Hidden TextInput to handle keyboard input */}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleChangeText}
          style={styles.hiddenInput}
          keyboardType="number-pad"
          maxLength={length}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  box: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
  boxFocused: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  boxError: {
    borderColor: colors.system.error,
  },
  digit: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.text.primary,
  },
  cursor: {
    position: 'absolute',
    width: 2,
    height: 24,
    backgroundColor: colors.primary.main,
    opacity: 0.8,
  },
  errorText: {
    color: colors.system.error,
    marginTop: spacing.xs,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});

export default OTPInput; 