import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { currentUser, logout } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  // Handler for the refresh control
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh - in a real app, you might fetch updated user data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Log Out',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleDateString();
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    // For now just log the action since we haven't implemented the edit screen yet
    console.log('Edit profile button pressed');
    Alert.alert(
      'Edit Profile',
      'This feature will be available soon!',
      [{ text: 'OK' }]
    );
  };

  if (!currentUser) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to PlayOn</Text>
          <Text style={styles.subtitle}>Your one-stop platform for sports and games</Text>
        </View>

        <View style={styles.profileContainer}>
          <Text style={styles.sectionTitle}>Your Profile</Text>
          
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Name:</Text>
              <Text style={styles.profileValue}>{currentUser?.name || 'Not provided'}</Text>
            </View>
            
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Phone:</Text>
              <Text style={styles.profileValue}>{currentUser?.phoneNumber || 'Not provided'}</Text>
            </View>
            
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Email:</Text>
              <Text style={styles.profileValue}>{currentUser?.email || 'Not provided'}</Text>
            </View>
            
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Account created:</Text>
              <Text style={styles.profileValue}>{formatDate(currentUser?.createdAt || 0)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>LOG OUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.text.secondary,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  profileContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 15,
  },
  profileCard: {
    backgroundColor: colors.background.grey,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  profileLabel: {
    width: 120,
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  profileValue: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  actionsContainer: {
    padding: 20,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  editButtonText: {
    color: colors.primary.contrast,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  logoutButtonText: {
    color: colors.system.error,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen; 