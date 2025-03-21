import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserStackParamList, UserTabParamList } from '../types/navigation';

// Placeholder components for screens (will be implemented later)
const HomeScreen = () => null;
const ExploreScreen = () => null;
const BookingsScreen = () => null;
const FavoritesScreen = () => null;
const ProfileScreen = () => null;
const VenueDetailScreen = () => null;
const BookingScreen = () => null;
const PaymentScreen = () => null;
const BookingConfirmScreen = () => null;
const BookingDetailScreen = () => null;
const ReviewFormScreen = () => null;

const Tab = createBottomTabNavigator<UserTabParamList>();
const Stack = createStackNavigator<UserStackParamList>();

const UserTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0066cc',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          // We'll add icons later
        }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen} 
        options={{
          tabBarLabel: 'Explore',
        }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsScreen} 
        options={{
          tabBarLabel: 'Bookings',
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{
          tabBarLabel: 'Favorites',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export const UserNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={UserTabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="VenueDetail" 
        component={VenueDetailScreen} 
        options={{ title: 'Venue Details' }}
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen} 
        options={{ title: 'Book Venue' }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen} 
        options={{ title: 'Payment' }}
      />
      <Stack.Screen 
        name="BookingConfirm" 
        component={BookingConfirmScreen} 
        options={{ title: 'Booking Confirmed' }}
      />
      <Stack.Screen 
        name="BookingDetail" 
        component={BookingDetailScreen} 
        options={{ title: 'Booking Details' }}
      />
      <Stack.Screen 
        name="ReviewForm" 
        component={ReviewFormScreen} 
        options={{ title: 'Write Review' }}
      />
    </Stack.Navigator>
  );
}; 