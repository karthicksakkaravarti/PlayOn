import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';

// Placeholder components for screens (will be implemented later)
const PhoneEntryScreen = () => null;
const OTPVerificationScreen = () => null;
const UserInfoScreen = () => null;

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="UserInfo" component={UserInfoScreen} />
    </Stack.Navigator>
  );
}; 