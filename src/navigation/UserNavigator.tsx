import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserStackParamList, UserTabParamList } from '../types/navigation';

// Import the screens
import HomeScreen from '../screens/HomeScreen';

// Placeholder screens for now - these would be implemented properly
const ExploreScreen = () => <View style={styles.placeholder}><Text>Explore Screen</Text></View>;
const BookingsScreen = () => <View style={styles.placeholder}><Text>Bookings Screen</Text></View>;
const FavoritesScreen = () => <View style={styles.placeholder}><Text>Favorites Screen</Text></View>;
const ProfileScreen = () => <View style={styles.placeholder}><Text>Profile Screen</Text></View>;
const VenueDetailsScreen = () => <View style={styles.placeholder}><Text>Venue Details Screen</Text></View>;
const BookingConfirmationScreen = () => <View style={styles.placeholder}><Text>Booking Confirmation Screen</Text></View>;
const EditProfileScreen = () => <View style={styles.placeholder}><Text>Edit Profile Screen</Text></View>;
const SettingsScreen = () => <View style={styles.placeholder}><Text>Settings Screen</Text></View>;

import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

const Tab = createBottomTabNavigator<UserTabParamList>();
const Stack = createStackNavigator<UserStackParamList>();

const UserTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary.main,
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
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
      initialRouteName="Tabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Tabs" component={UserTabNavigator} />
      <Stack.Screen name="VenueDetails" component={VenueDetailsScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
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