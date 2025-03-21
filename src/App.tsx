import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet, View, ScrollView } from 'react-native';
import Text from './components/ui/Text';
import Button from './components/ui/Button';
import { theme, colors, spacing } from './constants/theme';

// Import the Navigation component when we're ready to use it
// import { Navigation } from './navigation';

// Temporary Home screen to test our UI components
const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="h1" style={styles.title}>PlayOn</Text>
        <Text variant="h3" color={colors.secondary.main}>Sports Venue Booking</Text>
        
        <View style={styles.section}>
          <Text variant="h2">Typography</Text>
          <Text variant="display">Display</Text>
          <Text variant="h1">Heading 1</Text>
          <Text variant="h2">Heading 2</Text>
          <Text variant="h3">Heading 3</Text>
          <Text variant="h4">Heading 4</Text>
          <Text variant="h5">Heading 5</Text>
          <Text variant="body1">Body 1: This is the standard text size for the app.</Text>
          <Text variant="body2">Body 2: Smaller text for secondary information.</Text>
          <Text variant="caption">Caption: Small text for labels and captions.</Text>
          <Text variant="button">Button</Text>
        </View>
        
        <View style={styles.section}>
          <Text variant="h2">Buttons</Text>
          <View style={styles.buttonRow}>
            <Button>Primary</Button>
          </View>
          <View style={styles.buttonRow}>
            <Button variant="secondary">Secondary</Button>
          </View>
          <View style={styles.buttonRow}>
            <Button variant="outlined">Outlined</Button>
          </View>
          <View style={styles.buttonRow}>
            <Button variant="text">Text</Button>
          </View>
          <View style={styles.buttonRow}>
            <Button fullWidth>Full Width</Button>
          </View>
          <View style={styles.buttonRow}>
            <Button loading>Loading</Button>
          </View>
          <View style={styles.buttonRow}>
            <Button disabled>Disabled</Button>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text variant="h2">Coming Soon</Text>
          <Text variant="body1">
            PlayOn will be your go-to platform for booking sports venues, making payments, and discovering new places to play.
          </Text>
          <Button style={styles.startButton} size="large" fullWidth>
            Get Started
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.light} />
      <HomeScreen />
      {/* <Navigation /> */}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  section: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  buttonRow: {
    marginVertical: spacing.sm,
  },
  startButton: {
    marginTop: spacing.lg,
  },
});

