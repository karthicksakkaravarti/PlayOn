import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';
import { AdminStackParamList } from '../types/navigation';

// Placeholder screens for now - these would be implemented properly
const DashboardScreen = () => <View style={styles.placeholder}><Text>Admin Dashboard</Text></View>;
const ManageUsersScreen = () => <View style={styles.placeholder}><Text>Manage Users</Text></View>;
const ManageVenuesScreen = () => <View style={styles.placeholder}><Text>Manage Venues</Text></View>;
const UserDetailsScreen = () => <View style={styles.placeholder}><Text>User Details</Text></View>;
const VenueDetailsScreen = () => <View style={styles.placeholder}><Text>Venue Details</Text></View>;
const SettingsScreen = () => <View style={styles.placeholder}><Text>Settings</Text></View>;

const Stack = createStackNavigator<AdminStackParamList>();

export const AdminNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary.dark,
        },
        headerTintColor: colors.primary.contrast,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="ManageUsers" component={ManageUsersScreen} options={{ title: 'Manage Users' }} />
      <Stack.Screen name="ManageVenues" component={ManageVenuesScreen} options={{ title: 'Manage Venues' }} />
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} options={{ title: 'User Details' }} />
      <Stack.Screen name="VenueDetails" component={VenueDetailsScreen} options={{ title: 'Venue Details' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
}); 