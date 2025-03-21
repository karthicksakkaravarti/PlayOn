import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { VenueOwnerStackParamList, VenueOwnerTabParamList } from '../types/navigation';

// Placeholder components for screens (will be implemented later)
const VenuesScreen = () => null;
const VenueOwnerBookingsScreen = () => null;
const EarningsScreen = () => null;
const VenueOwnerProfileScreen = () => null;
const AddVenueScreen = () => null;
const EditVenueScreen = () => null;
const VenueOwnerVenueDetailScreen = () => null;
const AvailabilityScreen = () => null;
const VenueOwnerBookingDetailScreen = () => null;

const Tab = createBottomTabNavigator<VenueOwnerTabParamList>();
const Stack = createStackNavigator<VenueOwnerStackParamList>();

const VenueOwnerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0066cc',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Venues" 
        component={VenuesScreen} 
        options={{
          tabBarLabel: 'Venues',
        }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={VenueOwnerBookingsScreen} 
        options={{
          tabBarLabel: 'Bookings',
        }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={EarningsScreen} 
        options={{
          tabBarLabel: 'Earnings',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={VenueOwnerProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export const VenueOwnerNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={VenueOwnerTabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddVenue" 
        component={AddVenueScreen} 
        options={{ title: 'Add Venue' }}
      />
      <Stack.Screen 
        name="EditVenue" 
        component={EditVenueScreen} 
        options={{ title: 'Edit Venue' }}
      />
      <Stack.Screen 
        name="VenueDetail" 
        component={VenueOwnerVenueDetailScreen} 
        options={{ title: 'Venue Details' }}
      />
      <Stack.Screen 
        name="Availability" 
        component={AvailabilityScreen} 
        options={{ title: 'Manage Availability' }}
      />
      <Stack.Screen 
        name="BookingDetail" 
        component={VenueOwnerBookingDetailScreen} 
        options={{ title: 'Booking Details' }}
      />
    </Stack.Navigator>
  );
}; 