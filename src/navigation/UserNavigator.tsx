import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

// Import types (will need to be fixed by TypeScript refresh)
import { UserStackParamList, UserTabParamList } from '../types/navigation';

// Import the screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import icons
import { Ionicons } from '@expo/vector-icons';

// Placeholder screens for now - these would be implemented properly
const ExploreScreen = () => <View style={styles.placeholder}><Text>Explore Screen</Text></View>;
const BookingsScreen = () => <View style={styles.placeholder}><Text>Bookings Screen</Text></View>;
const FavoritesScreen = () => <View style={styles.placeholder}><Text>Favorites Screen</Text></View>;
const VenueDetailsScreen = () => <View style={styles.placeholder}><Text>Venue Details Screen</Text></View>;
const BookingConfirmationScreen = () => <View style={styles.placeholder}><Text>Booking Confirmation Screen</Text></View>;
const EditProfileScreen = () => <View style={styles.placeholder}><Text>Edit Profile Screen</Text></View>;
const SettingsScreen = () => <View style={styles.placeholder}><Text>Settings Screen</Text></View>;

const Tab = createBottomTabNavigator<UserTabParamList>();
const Stack = createStackNavigator<UserStackParamList>();

const UserTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // You can return any component here!
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 5,
        }
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen} 
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsScreen} 
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
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