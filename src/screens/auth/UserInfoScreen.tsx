import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import { spacing, colors, radius, typography } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

type UserInfoScreenRouteProp = RouteProp<RootStackParamList, 'UserInfo'>;
type UserInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserInfo'>;

const UserInfoScreen: React.FC = () => {
  const navigation = useNavigation<UserInfoScreenNavigationProp>();
  const route = useRoute<UserInfoScreenRouteProp>();
  const { phoneNumber } = route.params;
  const { updateUserProfile, error: authError, resetError } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validateInputs = () => {
    const newErrors: { name?: string; email?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }

    // Reset auth errors
    resetError();
    setLoading(true);

    try {
      // Update user profile with auth context
      await updateUserProfile({
        name,
        email: email || undefined,
        phoneNumber
      });
      
      // Navigation will be handled by the Navigation component 
      // since currentUser will be updated
    } catch (err) {
      console.error('Error updating profile:', err);
      // Error is handled by auth context
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Update profile with just phone number
    resetError();
    setLoading(true);
    
    updateUserProfile({ phoneNumber })
      .catch(err => {
        console.error('Error updating profile:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
              <Text variant="h1" style={styles.title}>Complete Your Profile</Text>
              <Text variant="body1" style={styles.subtitle}>
                Add more information to personalize your experience
              </Text>
            </View>
            
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text variant="body2" style={styles.label}>Full Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.name ? styles.inputError : null
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.text.secondary}
                  autoCapitalize="words"
                />
                {errors.name ? (
                  <Text variant="body2" style={styles.errorText}>{errors.name}</Text>
                ) : null}
              </View>
              
              <View style={styles.inputContainer}>
                <Text variant="body2" style={styles.label}>Email (Optional)</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.email ? styles.inputError : null
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email address"
                  placeholderTextColor={colors.text.secondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email ? (
                  <Text variant="body2" style={styles.errorText}>{errors.email}</Text>
                ) : null}
                {authError ? (
                  <Text variant="body2" style={styles.errorText}>{authError}</Text>
                ) : null}
              </View>
              
              <Button
                style={styles.button}
                onPress={handleSubmit}
                loading={loading}
                disabled={!name.trim() || loading}
                fullWidth
              >
                Save
              </Button>
              
              <Button
                variant="text"
                onPress={handleSkip}
                disabled={loading}
                style={styles.skipButton}
              >
                Skip for now
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
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.text.secondary,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.system.error,
  },
  errorText: {
    color: colors.system.error,
    marginTop: spacing.xs,
  },
  button: {
    marginTop: spacing.xl,
  },
  skipButton: {
    marginTop: spacing.md,
  },
});

export default UserInfoScreen; 