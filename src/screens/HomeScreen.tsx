import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../components/ui/Text';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../constants/theme';

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { currentUser, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const phoneNumber = currentUser?.phoneNumber || 'User';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <Text variant="h2">Welcome!</Text>
      <Text variant="body1" style={styles.subtitle}>
        {phoneNumber}
      </Text>
      <Text variant="body1" style={styles.subtitle}>
        You are signed in successfully
      </Text>
      <View style={styles.buttonContainer}>
        <Button 
          variant="secondary"
          onPress={handleSignOut}
        >
          Sign Out
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing.lg,
  },
});

export default HomeScreen; 