import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserStackParamList } from '../types/navigation';

type EditProfileScreenNavigationProp = StackNavigationProp<UserStackParamList, 'EditProfile'>;

const EditProfileScreen = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
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

  const handleSave = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      const updatedUser = await updateUserProfile({
        name: name.trim(),
        email: email.trim() || undefined,
        updatedAt: Date.now()
      });
      
      console.log('Profile updated successfully:', updatedUser);
      
      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully!',
        [{ 
          text: 'OK',
          onPress: () => navigation.goBack()
        }]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Update Failed',
        'There was a problem updating your profile. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
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
              <Text style={styles.title}>Edit Profile</Text>
              <Text style={styles.subtitle}>
                Update your personal information
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
              
              <View style={styles.phoneContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <Text style={styles.phoneValue}>{currentUser?.phoneNumber}</Text>
                <Text style={styles.phoneNote}>Phone number cannot be changed</Text>
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
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
  phoneContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: colors.background.grey,
    borderRadius: 8,
  },
  phoneValue: {
    fontSize: 16,
    color: colors.text.primary,
    marginVertical: 5,
  },
  phoneNote: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 20,
  },
  saveButton: {
    height: 50,
    backgroundColor: colors.primary.main,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  cancelButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
  },
});

export default EditProfileScreen; 