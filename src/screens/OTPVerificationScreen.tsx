import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Text from '../components/ui/Text';
import Button from '../components/ui/Button';
import { RootStackParamList } from '../navigation';
import { useTheme } from '../hooks/useTheme';
import { colors, spacing, radius } from '../constants/theme';

// Mock Firebase auth for demo purposes
const useMockFirebaseAuth = () => {
  const verifyOTP = async (verificationId: string, otp: string) => {
    // For demo purposes, any 6-digit code works
    if (otp.length !== 6) throw new Error('Invalid OTP');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a mock user
    return {
      uid: 'mock-user-id-123456',
      phoneNumber: '+12345678901',
      displayName: null,
      email: null,
      emailVerified: false,
    };
  };

  return { verifyOTP };
};

type OTPVerificationRouteProp = RouteProp<RootStackParamList, 'OTPVerification'>;
type OTPVerificationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OTPVerification'>;

const OTPVerificationScreen: React.FC = () => {
  const navigation = useNavigation<OTPVerificationNavigationProp>();
  const route = useRoute<OTPVerificationRouteProp>();
  const { theme } = useTheme();
  const mockAuth = useMockFirebaseAuth();
  
  const { phoneNumber, verificationId } = route.params;
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }
    
    setLoading(true);
    
    try {
      // Verify the OTP code
      await mockAuth.verifyOTP(verificationId, otp);
      
      // Alert success and navigate to Home screen
      Alert.alert(
        'Success', 
        'Phone number verified successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Home') 
          }
        ]
      );
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendCode = () => {
    Alert.alert('Info', 'A new verification code has been sent to your phone number.');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
          <View style={styles.headerContainer}>
            <Text variant="h2" style={styles.title}>Verification</Text>
            <Text variant="body1" style={styles.subtitle}>
              We've sent a verification code to {phoneNumber}
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text variant="body2" style={styles.inputLabel}>Verification Code</Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: theme.colors.border.light }
              ]}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              placeholderTextColor={theme.colors.text.secondary}
            />
            
            <Button 
              variant="primary"
              onPress={handleVerifyOTP}
              fullWidth
              loading={loading}
              style={styles.button}
            >
              Verify
            </Button>
            
            <TouchableWithoutFeedback onPress={handleResendCode}>
              <View style={styles.resendContainer}>
                <Text variant="body2" color={colors.primary.main}>
                  Didn't receive a code? Resend
                </Text>
              </View>
            </TouchableWithoutFeedback>
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
    textAlign: 'center',
    letterSpacing: 8,
  },
  button: {
    marginTop: spacing.md,
  },
  resendContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});

export default OTPVerificationScreen;