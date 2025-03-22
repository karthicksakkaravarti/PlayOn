import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';

// Components
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import PhoneInput from '../../components/auth/PhoneInput';

// Auth context
import { useAuth } from '../../hooks/useAuth';

// Styling
import { spacing, colors } from '../../constants/theme';

type PhoneAuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PhoneAuth'>;

const PhoneEntryScreen = () => {
  const navigation = useNavigation<PhoneAuthScreenNavigationProp>();
  const { login, error: authError, resetError } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePhoneNumber = (phone: string) => {
    // Basic validation - can be improved based on requirements
    return phone.length >= 10;
  };

  const handleContinue = async () => {
    console.log('🔍 PHONE ENTRY DEBUG: handleContinue pressed');
    // Reset error states
    setError(null);
    resetError();

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      console.log('🔍 PHONE ENTRY DEBUG: Invalid phone number:', phoneNumber);
      setError('Please enter a valid phone number');
      return;
    }

    console.log('🔍 PHONE ENTRY DEBUG: Phone validation passed, setting loading state');
    setLoading(true);

    try {
      console.log('🔍 PHONE ENTRY DEBUG: Calling login with phoneNumber:', phoneNumber);
      // Call the login function from auth context
      const verificationId = await login(phoneNumber);
      
      console.log('🔍 PHONE ENTRY DEBUG: Login successful, navigating to OTP screen');
      // Navigate to OTP verification screen with phone number and verification ID
      navigation.navigate('OTPVerification', {
        phoneNumber,
        verificationId
      });
    } catch (err) {
      // Error is handled by the auth context, but we can update the UI state
      console.error('🔍 PHONE ENTRY DEBUG: Error sending verification code:', err);
      // If authError is not set by context, set a fallback error
      if (!authError) {
        setError('Failed to send verification code. Please try again.');
      }
    } finally {
      console.log('🔍 PHONE ENTRY DEBUG: Login attempt completed, resetting loading state');
      setLoading(false);
    }
  };

  // Use auth error if available, otherwise use local error
  const displayError = authError || error;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text variant="h1" style={styles.title}>Welcome to PlayOn</Text>
              <Text variant="body1" style={styles.subtitle}>
                Enter your phone number to continue
              </Text>
            </View>
            
            <View style={styles.form}>
              <PhoneInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                error={displayError || undefined}
                autoFocus
              />
              
              <Button
                style={styles.button}
                onPress={handleContinue}
                loading={loading}
                disabled={!phoneNumber.trim() || loading}
                fullWidth
              >
                Continue
              </Button>
            </View>
            
            <View style={styles.footer}>
              <Text variant="body2" style={styles.footerText}>
                By continuing, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: spacing.xl * 2,
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.text.secondary,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    marginTop: spacing.xl,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default PhoneEntryScreen; 