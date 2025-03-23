import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../constants/theme';

const ProfileSetupScreen = () => {
  const { currentUser, updateUserProfile, error: authError, resetError } = useAuth();
  const navigation = useNavigation();
  
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
      console.log('Submitting profile data:', { name, email });
      
      // Update user profile with auth context
      const updatedUser = await updateUserProfile({
        name: name.trim(),
        email: email.trim() || undefined,
      });
      
      console.log('Profile updated successfully:', updatedUser);
      
      // Show success message
      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully!',
        [{ text: 'OK' }]
      );
      
      // Navigation will be handled by the Navigation component 
      // since currentUser will be updated
    } catch (err) {
      console.error('Error updating profile:', err);
      
      // Show error message
      Alert.alert(
        'Update Failed',
        'There was a problem updating your profile. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Update profile with minimal info
    resetError();
    setLoading(true);
    
    console.log('Skipping profile setup, using default name: User');
    
    updateUserProfile({ 
      name: 'User',
      // Include timestamp to ensure the update is detected
      updatedAt: Date.now()
    })
      .then(user => {
        console.log('Profile set with default values:', user);
      })
      .catch(err => {
        console.error('Error updating profile with defaults:', err);
        Alert.alert(
          'Error',
          'Failed to set up profile with default values',
          [{ text: 'OK' }]
        );
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
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>
                Add more information to personalize your experience
              </Text>
            </View>
            
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
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
                  <Text style={styles.errorText}>{errors.name}</Text>
                ) : null}
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.email ? styles.inputError : null
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email (optional)"
                  placeholderTextColor={colors.text.secondary}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>
              
              {authError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorMessage}>{authError}</Text>
                </View>
              ) : null}
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Save Profile</Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkip}
                  disabled={loading}
                >
                  <Text style={styles.skipButtonText}>Skip for now</Text>
                </TouchableOpacity>
              </View>
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
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: colors.background.light,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.system.error,
  },
  errorText: {
    color: colors.system.error,
    fontSize: 14,
    marginTop: 5,
  },
  errorContainer: {
    padding: 15,
    backgroundColor: colors.system.error + '20',  // 20 for opacity
    borderRadius: 8,
    marginBottom: 20,
  },
  errorMessage: {
    color: colors.system.error,
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    height: 50,
    backgroundColor: colors.primary.main,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  skipButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
  },
});

export default ProfileSetupScreen; 