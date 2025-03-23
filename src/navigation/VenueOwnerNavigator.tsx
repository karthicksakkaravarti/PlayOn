import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';
import { VenueOwnerStackParamList } from '../types/navigation';

// Placeholder screens for now - these would be implemented properly
const DashboardScreen = () => <View style={styles.placeholder}><Text>Venue Owner Dashboard</Text></View>;
const ManageVenuesScreen = () => <View style={styles.placeholder}><Text>Manage Venues</Text></View>;
const VenueDetailsScreen = () => <View style={styles.placeholder}><Text>Venue Details</Text></View>;
const AddVenueScreen = () => <View style={styles.placeholder}><Text>Add Venue</Text></View>;
const EditVenueScreen = () => <View style={styles.placeholder}><Text>Edit Venue</Text></View>;
const BookingsScreen = () => <View style={styles.placeholder}><Text>Bookings</Text></View>;
const ProfileScreen = () => <View style={styles.placeholder}><Text>Profile</Text></View>;
const SettingsScreen = () => <View style={styles.placeholder}><Text>Settings</Text></View>;

const Stack = createStackNavigator<VenueOwnerStackParamList>();

export const VenueOwnerNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary.main,
        },
        headerTintColor: colors.primary.contrast,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ManageVenues" component={ManageVenuesScreen} options={{ title: 'My Venues' }} />
      <Stack.Screen name="VenueDetails" component={VenueDetailsScreen} options={{ title: 'Venue Details' }} />
      <Stack.Screen name="AddVenue" component={AddVenueScreen} options={{ title: 'Add New Venue' }} />
      <Stack.Screen name="EditVenue" component={EditVenueScreen} options={{ title: 'Edit Venue' }} />
      <Stack.Screen name="Bookings" component={BookingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
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