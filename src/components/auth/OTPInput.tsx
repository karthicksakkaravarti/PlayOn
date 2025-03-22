import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  Keyboard, 
  KeyboardType,
  NativeSyntheticEvent,
  TextInputKeyPressEventData
} from 'react-native';
import Text from '../ui/Text';
import { colors, spacing, radius } from '../../constants/theme';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  autoFocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  error,
  autoFocus
}) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [inputValues, setInputValues] = useState<string[]>(Array(length).fill(''));
  
  // Initialize inputRefs
  useEffect(() => {
    inputRefs.current = Array(length).fill(null);
  }, [length]);
  
  // Update internal state when value changes externally
  useEffect(() => {
    const valueArray = value.split('').slice(0, length);
    const newInputValues = Array(length).fill('');
    
    valueArray.forEach((digit, index) => {
      newInputValues[index] = digit;
    });
    
    setInputValues(newInputValues);
  }, [value, length]);

  // Focus the first input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleInputChange = (text: string, index: number) => {
    // Only allow digits
    if (!/^\d*$/.test(text)) return;
    
    const newInputValues = [...inputValues];
    
    // Handle paste of multiple digits
    if (text.length > 1) {
      const digits = text.split('').slice(0, length - index);
      
      digits.forEach((digit, digitIndex) => {
        const targetIndex = index + digitIndex;
        if (targetIndex < length) {
          newInputValues[targetIndex] = digit;
        }
      });
      
      const nextIndex = Math.min(index + digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    } else {
      // Handle single digit input
      newInputValues[index] = text;
      setInputValues(newInputValues);
      
      // Auto-advance to next input
      if (text && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    
    // Update parent component value
    onChange(newInputValues.join(''));
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    // Handle backspace to move to previous input
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !inputValues[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleInputFocus = (index: number) => {
    // When an input is focused, focus the first empty input or the last one
    if (inputValues[index]) return;
    
    let focusIndex = inputValues.findIndex(digit => digit === '');
    if (focusIndex === -1) focusIndex = length - 1;
    
    if (focusIndex !== index) {
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        {Array(length).fill(0).map((_, index) => (
          <TextInput
            key={index}
            ref={ref => inputRefs.current[index] = ref}
            style={[
              styles.input,
              error ? styles.inputError : null,
              inputValues[index] ? styles.inputFilled : null
            ]}
            value={inputValues[index]}
            onChangeText={text => handleInputChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            onFocus={() => handleInputFocus(index)}
            keyboardType="number-pad"
            maxLength={length}
            selectTextOnFocus
            selectionColor={colors.primary.main}
          />
        ))}
      </View>
      {error && (
        <Text variant="body2" style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: colors.text.primary,
  },
  inputFilled: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
  },
  inputError: {
    borderColor: colors.system.error,
  },
  errorText: {
    color: colors.system.error,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default OTPInput; 