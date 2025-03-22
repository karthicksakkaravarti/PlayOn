import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Context
import { useAuth } from '../hooks/useAuth';
import { colors } from '../constants/theme';

// Define the navigation parameters
export type RootStackParamList = {
  Home: undefined;
  PhoneAuth: undefined;
  OTPVerification: { phoneNumber: string, verificationId: string };
  UserInfo: { phoneNumber: string };
};

// Import the actual screens
import PhoneEntryScreen from '../screens/auth/PhoneEntryScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen'; 
import UserInfoScreen from '../screens/auth/UserInfoScreen';

// Temporary placeholder for Home screen until the real one is properly imported
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Home Screen</Text>
  </View>
);

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  const { currentUser, loading, initialized } = useAuth();
  // Add state to track if we've been loading too long
  const [forceRender, setForceRender] = React.useState(false);

  // Force render after 5 seconds if we're still in loading state
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading && !initialized) {
        console.log('🔍 NAVIGATION DEBUG: Forcing navigation render after timeout');
        setForceRender(true);
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [loading, initialized]);

  console.log('🔍 NAVIGATION DEBUG: Navigation rendering with state:', { 
    currentUser, 
    loading, 
    initialized,
    forceRender,
    isLoading: loading && !initialized && !forceRender,
    shouldShowPhoneAuth: !currentUser && (!loading || initialized || forceRender)
  });

  // Show loading indicator while checking authentication state
  // But only if we haven't forced rendering
  if (loading && !initialized && !forceRender) {
    console.log('🔍 NAVIGATION DEBUG: Showing loading indicator');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text>Loading...</Text>
      </View>
    );
  }

  // If we get here, we're either initialized or not loading or forced render
  console.log('🔍 NAVIGATION DEBUG: Loading complete or bypassed. Ready to navigate:', {
    loading,
    initialized,
    forceRender,
    currentUser: currentUser ? 'User exists' : 'No user'
  });
  
  console.log('🔍 NAVIGATION DEBUG: Rendering main navigation with initialRouteName:', 
    currentUser ? 'Home' : 'PhoneAuth');

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={currentUser ? 'Home' : 'PhoneAuth'}
        screenOptions={{
          headerShown: false,
        }}
      >
        {currentUser ? (
          // Authenticated routes
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          // Auth routes
          <>
            <Stack.Screen name="PhoneAuth" component={PhoneEntryScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="UserInfo" component={UserInfoScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
});

export default Navigation; 