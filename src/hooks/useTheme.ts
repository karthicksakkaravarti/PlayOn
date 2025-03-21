import { useCallback, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';
import theme, { Theme } from '../constants/theme';

// Define the light and dark theme objects
const lightTheme: Theme = {
  ...theme,
  isDark: false,
};

const darkTheme: Theme = {
  ...theme,
  isDark: true,
  colors: {
    ...theme.colors,
    background: {
      light: '#121212',
      dark: '#000000',
      grey: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      disabled: '#757575',
      light: '#FFFFFF',
    },
    border: {
      light: '#2C2C2C',
      dark: '#3E3E3E',
    },
  },
};

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UseThemeResult {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

/**
 * Hook for managing theme state and preferences
 * @returns Theme object and theme control functions
 */
export const useTheme = (): UseThemeResult => {
  // Get system color scheme
  const systemColorScheme = useColorScheme() as ColorSchemeName;
  
  // Initialize theme mode state (default to system)
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  
  // Determine if dark mode should be active based on theme mode
  const isDark = 
    themeMode === 'system' 
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

  // Get the appropriate theme based on dark mode state
  const currentTheme = isDark ? darkTheme : lightTheme;

  // Toggle between light and dark mode
  const toggleTheme = useCallback(() => {
    setThemeMode(prev => {
      if (prev === 'system') {
        return systemColorScheme === 'dark' ? 'light' : 'dark';
      }
      return prev === 'dark' ? 'light' : 'dark';
    });
  }, [systemColorScheme]);

  // Listen for system appearance changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only update if theme mode is set to 'system'
      if (themeMode === 'system') {
        // Force re-render by setting the same theme mode
        setThemeMode('system');
      }
    });

    return () => {
      subscription.remove();
    };
  }, [themeMode]);

  return {
    theme: currentTheme,
    themeMode,
    isDark,
    setThemeMode,
    toggleTheme,
  };
};

export default useTheme; 