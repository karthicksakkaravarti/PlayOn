import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../constants/theme';

// Import types (will need to be fixed by TypeScript refresh)
import { UserStackParamList, UserTabParamList } from '../types/navigation';

// Import the screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

// Import icons
import { Ionicons } from '@expo/vector-icons';

// Placeholder screens for now - these would be implemented properly
const ExploreScreen = () => <View style={styles.placeholder}><Text>Explore Screen</Text></View>;
const BookingsScreen = () => <View style={styles.placeholder}><Text>Bookings Screen</Text></View>;
const FavoritesScreen = () => <View style={styles.placeholder}><Text>Favorites Screen</Text></View>;
const VenueDetailsScreen = () => <View style={styles.placeholder}><Text>Venue Details Screen</Text></View>;
const BookingConfirmationScreen = () => <View style={styles.placeholder}><Text>Booking Confirmation Screen</Text></View>;
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
          paddingBottom: Platform.OS === 'ios' ? 10 : 5,
          height: Platform.OS === 'ios' ? 80 : 60,
          backgroundColor: colors.background.light,
          borderTopWidth: 1,
          borderTopColor: colors.border.light,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          paddingBottom: Platform.OS === 'ios' ? 5 : 0,
        },
        tabBarItemStyle: {
          paddingTop: 5,
        },
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen} 
        options={{
          tabBarLabel: 'Explore'
        }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsScreen} 
        options={{
          tabBarLabel: 'Bookings'
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{
          tabBarLabel: 'Favorites'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile'
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
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{
          headerShown: true,
          headerTitle: 'Edit Profile',
          headerTintColor: colors.primary.main,
          headerStyle: {
            backgroundColor: colors.background.light,
          }
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Settings',
          headerTintColor: colors.primary.main,
          headerStyle: {
            backgroundColor: colors.background.light,
          }
        }}
      />
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