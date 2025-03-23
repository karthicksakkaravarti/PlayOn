import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../constants/theme';

const ProfileScreen = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
              <Text style={styles.profileValue}>{currentUser?.phoneNumber}</Text>
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
            onPress={() => console.log('Edit profile')}
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