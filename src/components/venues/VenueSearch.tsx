import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleProp,
  ViewStyle
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Icon from '../ui/Icon';

export interface VenueSearchProps {
  /**
   * Current search query
   */
  value: string;
  
  /**
   * Handler for search query changes
   */
  onChangeText: (text: string) => void;
  
  /**
   * Handler for search submission
   */
  onSubmit?: () => void;
  
  /**
   * Handler for clearing the search
   */
  onClear?: () => void;
  
  /**
   * Style for the container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Whether search is currently loading
   * @default false
   */
  loading?: boolean;
  
  /**
   * Placeholder text for the search input
   * @default "Search venues..."
   */
  placeholder?: string;
  
  /**
   * Whether to auto-focus the search input
   * @default false
   */
  autoFocus?: boolean;
}

/**
 * Search component for venue search functionality
 */
const VenueSearch: React.FC<VenueSearchProps> = ({
  value,
  onChangeText,
  onSubmit,
  onClear,
  style,
  loading = false,
  placeholder = "Search venues...",
  autoFocus = false
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  
  // Track if the search has input to toggle the clear button visibility
  const [hasInput, setHasInput] = useState(value.length > 0);
  
  useEffect(() => {
    setHasInput(value.length > 0);
  }, [value]);
  
  const handleClear = () => {
    onChangeText('');
    if (onClear) {
      onClear();
    }
  };
  
  const renderRightAccessory = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={colors.primary.main} 
          style={styles.loadingIndicator}
        />
      );
    }
    
    if (hasInput) {
      return (
        <TouchableOpacity 
          onPress={handleClear}
          style={styles.clearButton}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Icon 
            name="x" 
            size={16} 
            color={colors.grey[500]}
          />
        </TouchableOpacity>
      );
    }
    
    return null;
  };
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <Icon 
          name="search" 
          size={20} 
          color={colors.grey[500]} 
          style={styles.searchIcon}
        />
        
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.grey[400]}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={onSubmit}
          autoFocus={autoFocus}
        />
        
        {renderRightAccessory()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#212121',
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default VenueSearch; 