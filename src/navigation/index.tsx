import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Context
import { useAuth } from '../hooks/useAuth';
import { colors } from '../constants/theme';
import { UserRole } from '../types/auth';

// Import navigators
import { AuthNavigator } from './AuthNavigator';
import { UserNavigator } from './UserNavigator';
import { VenueOwnerNavigator } from './VenueOwnerNavigator';
import { AdminNavigator } from './AdminNavigator';

// Define the navigation parameters
export type RootStackParamList = {
  Auth: undefined;
  User: undefined;
  VenueOwner: undefined;
  Admin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Splash screen component
const SplashScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary.main} />
    <Text style={styles.loadingText}>Loading PlayOn...</Text>
  </View>
);

export const Navigation = () => {
  const { currentUser, loading, initialized } = useAuth();
  // Add state to track if we've been loading too long
  const [forceRender, setForceRender] = React.useState(false);

  // Force render after 1 second if we're still in loading state
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading && !initialized) {
        setForceRender(true);
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [loading, initialized]);



  // Show loading indicator while checking authentication state
  if (loading && !initialized && !forceRender) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          // No user, show auth flow
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : currentUser.role === UserRole.USER ? (
          // User role flow
          <Stack.Screen name="User" component={UserNavigator} />
        ) : currentUser.role === UserRole.VENUE_OWNER ? (
          // Venue owner flow
          <Stack.Screen name="VenueOwner" component={VenueOwnerNavigator} />
        ) : (
          // Admin flow
          <Stack.Screen name="Admin" component={AdminNavigator} />
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
  loadingText: {
    marginTop: 12,
    color: colors.text.secondary,
    fontSize: 16,
  }
});

export default Navigation; 