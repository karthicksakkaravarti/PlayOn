import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { RootStackParamList } from '../types/navigation';
import { AuthNavigator } from './AuthNavigator';
import { UserNavigator } from './UserNavigator';
import { VenueOwnerNavigator } from './VenueOwnerNavigator';
import { AdminNavigator } from './AdminNavigator';
import HomeScreen from '../screens/HomeScreen';
// Placeholder for splash screen
const SplashScreen = () => null;

const Stack = createStackNavigator<RootStackParamList>();

export const Navigation = () => {
  // This state will be replaced with actual auth context later
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'user' | 'venueOwner' | 'admin'>('user');

  // Simulate splash screen and authentication check
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      // For development, set this to test different navigators
      setUserToken(null);
    }, 1000);
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoading ? (
          // Show splash screen while loading
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : userToken === null ? (
          // No token, show auth flow
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : userRole === 'user' ? (
          // User role flow
          <Stack.Screen name="User" component={UserNavigator} />
        ) : userRole === 'venueOwner' ? (
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