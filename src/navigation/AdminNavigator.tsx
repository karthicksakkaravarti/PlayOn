import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminStackParamList, AdminTabParamList } from '../types/navigation';

// Placeholder components for screens (will be implemented later)
const DashboardScreen = () => null;
const AdminVenuesScreen = () => null;
const AdminBookingsScreen = () => null;
const PoliciesScreen = () => null;
const AdminProfileScreen = () => null;
const AdminVenueDetailScreen = () => null;
const AdminBookingDetailScreen = () => null;
const CommissionSettingsScreen = () => null;
const CancellationPoliciesScreen = () => null;

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createStackNavigator<AdminStackParamList>();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0066cc',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Venues" 
        component={AdminVenuesScreen} 
        options={{
          tabBarLabel: 'Venues',
        }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={AdminBookingsScreen} 
        options={{
          tabBarLabel: 'Bookings',
        }}
      />
      <Tab.Screen 
        name="Policies" 
        component={PoliciesScreen} 
        options={{
          tabBarLabel: 'Policies',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={AdminProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={AdminTabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="VenueDetail" 
        component={AdminVenueDetailScreen} 
        options={{ title: 'Venue Details' }}
      />
      <Stack.Screen 
        name="BookingDetail" 
        component={AdminBookingDetailScreen} 
        options={{ title: 'Booking Details' }}
      />
      <Stack.Screen 
        name="CommissionSettings" 
        component={CommissionSettingsScreen} 
        options={{ title: 'Commission Settings' }}
      />
      <Stack.Screen 
        name="CancellationPolicies" 
        component={CancellationPoliciesScreen} 
        options={{ title: 'Cancellation Policies' }}
      />
    </Stack.Navigator>
  );
}; 