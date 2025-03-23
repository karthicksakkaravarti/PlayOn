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