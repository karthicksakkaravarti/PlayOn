import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';

// Components
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import OTPInput from '../../components/auth/OTPInput';

// Auth context
import { useAuth } from '../../hooks/useAuth';

// Styling
import { spacing, colors } from '../../constants/theme';

type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OTPVerification'
>;

type OTPVerificationScreenRouteProp = RouteProp<
  RootStackParamList,
  'OTPVerification'
>;

const OTPVerificationScreen = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const [verificationId, setVerificationId] = useState(route.params.verificationId);
  const { phoneNumber } = route.params;
  const { verifyOTP, login, error: authError, resetError } = useAuth();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend option
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleVerify = async () => {
    // Reset error states
    setError(null);
    resetError();

    // Basic validation
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);

    try {
      // Call verifyOTP from auth context
      const user = await verifyOTP(verificationId, otp);
      
      // If phone auth successful but user profile incomplete, 
      // navigate to profile completion screen
      if (!user.name) {
        navigation.navigate('UserInfo', { phoneNumber });
      }
      // Otherwise, navigation will be handled by the Navigation component 
      // since currentUser will be set
    } catch (err) {
      // Error is handled by the auth context, but we can update the UI state
      console.error('Error verifying code:', err);
      // If authError is not set by context, set a fallback error
      if (!authError) {
        setError('Invalid code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    resetError();
    setLoading(true);
    
    try {
      // Use the login function to resend verification code
      const newVerificationId = await login(phoneNumber);
      
      // Store the new verification ID
      setVerificationId(newVerificationId);
      
      // Reset countdown
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      console.error('Error resending code:', err);
      // If authError is not set by context, set a fallback error
      if (!authError) {
        setError('Failed to resend code. Please try again.');
      }
    } finally {
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
              <Text variant="h1" style={styles.title}>Verify Your Number</Text>
              <Text variant="body1" style={styles.subtitle}>
                Enter the 6-digit code sent to {phoneNumber}
              </Text>
            </View>
            
            <View style={styles.form}>
              <OTPInput
                value={otp}
                onChange={setOtp}
                error={displayError || undefined}
                length={6}
              />
              
              <Button
                style={styles.button}
                onPress={handleVerify}
                loading={loading}
                disabled={otp.length !== 6 || loading}
                fullWidth
              >
                Verify
              </Button>
              
              <View style={styles.resendContainer}>
                {canResend ? (
                  <Button
                    onPress={handleResendCode}
                    variant="text"
                    disabled={loading}
                  >
                    Resend Code
                  </Button>
                ) : (
                  <Text variant="body2" style={styles.countdownText}>
                    Resend code in {countdown}s
                  </Text>
                )}
              </View>
            </View>
            
            <View style={styles.footer}>
              <Button
                onPress={() => navigation.goBack()}
                variant="outlined"
                style={styles.backButton}
              >
                Back
              </Button>
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
  resendContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  countdownText: {
    color: colors.text.secondary,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  backButton: {
    marginBottom: spacing.md,
  },
});

export default OTPVerificationScreen; 