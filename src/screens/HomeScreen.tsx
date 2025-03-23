import React from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import Text from '../components/ui/Text';
import Button from '../components/ui/Button';
import { colors, spacing } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

const HomeScreen: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text variant="h1">Welcome to PlayOn</Text>
          <Text variant="body1" style={styles.subtitle}>Your one-stop platform for sports and games</Text>
        </View>

        <View style={styles.userInfoContainer}>
          <Text variant="h2" style={styles.sectionTitle}>Your Profile</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text variant="body2" style={styles.infoLabel}>Name:</Text>
              <Text variant="body1">{currentUser?.name || 'Not provided'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="body2" style={styles.infoLabel}>Phone:</Text>
              <Text variant="body1">{currentUser?.phoneNumber}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="body2" style={styles.infoLabel}>Email:</Text>
              <Text variant="body1">{currentUser?.email || 'Not provided'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="body2" style={styles.infoLabel}>Account created:</Text>
              <Text variant="body1">
                {currentUser?.createdAt 
                  ? new Date(currentUser.createdAt).toLocaleDateString() 
                  : 'Unknown'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          

          <Button
            style={styles.logoutButton}
            variant="text"
            onPress={handleLogout}
          >
            Log out
          </Button>
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
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl * 1.5,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  userInfoContainer: {
    marginBottom: spacing.xl * 1.5,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.background.grey,
    borderRadius: 12,
    padding: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  infoLabel: {
    color: colors.text.secondary,
    width: 120,
  },
  actionsContainer: {
    marginTop: 'auto',
    marginBottom: spacing.lg,
  },
  button: {
    marginBottom: spacing.md,
  },
  logoutButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});

export default HomeScreen; 