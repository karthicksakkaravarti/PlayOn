import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Navigation } from './navigation';
import { AuthProvider } from './contexts/AuthContext';
import { colors } from './constants/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.light} />
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

