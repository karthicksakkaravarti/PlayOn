import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Text from '../components/ui/Text';
import Button from '../components/ui/Button';
import { RootStackParamList } from '../navigation';
import { useTheme } from '../hooks/useTheme';
import { colors, spacing, radius } from '../constants/theme';

// For DEMO purposes, since Expo doesn't support Firebase Recaptcha out of the box
const useMockFirebaseAuth = () => {
  const sendVerificationCode = async (phoneNumber: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return 'mock-verification-id-123456';
  };

  return { sendVerificationCode };
};

type PhoneAuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PhoneAuth'>;

const PhoneAuthScreen: React.FC = () => {
  const navigation = useNavigation<PhoneAuthScreenNavigationProp>();
  const { theme } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const mockAuth = useMockFirebaseAuth();

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    
    setLoading(true);
    
    try {
      const formattedPhoneNumber = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+${phoneNumber}`;
        
      // Use our mock verification for demo purposes
      const verificationId = await mockAuth.sendVerificationCode(formattedPhoneNumber);
      
      // Navigate to OTP verification screen
      navigation.navigate('OTPVerification', {
        phoneNumber: formattedPhoneNumber,
        verificationId,
      });
    } catch (error) {
      console.error('Error sending verification code:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
          <View style={styles.headerContainer}>
            <Text variant="h1" style={styles.title}>PlayOn</Text>
            <Text variant="body1" style={styles.subtitle}>
              Enter your phone number to sign in or create an account
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text variant="body2" style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: theme.colors.border.light }
              ]}
              placeholder="+1 (234) 567-8901"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholderTextColor={theme.colors.text.secondary}
            />
            
            <Button 
              variant="primary"
              onPress={handleSendOTP}
              fullWidth
              loading={loading}
              style={styles.button}
            >
              Continue
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  headerContainer: {
    marginTop: spacing.xxxl,
    marginBottom: spacing.xxl,
  },
  title: {
    marginBottom: spacing.md,
  },
  subtitle: {
    color: colors.text.secondary,
  },
  formContainer: {
    marginTop: spacing.xl,
  },
  inputLabel: {
    marginBottom: spacing.xs,
    color: colors.text.secondary,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
    fontSize: 16,
    color: colors.text.primary,
  },
  button: {
    marginTop: spacing.md,
  },
});

export default PhoneAuthScreen; 