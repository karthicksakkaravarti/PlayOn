import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  StyleProp,
  ViewStyle
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Text from '../ui/Text';
import Icon from '../ui/Icon';
import { Sport, VenueType } from '../../types/venue';

export interface FilterOptions {
  sports?: string[]; // Sport IDs
  priceRange?: {
    min?: number;
    max?: number;
  };
  venueTypes?: VenueType[];
  rating?: number; // Minimum rating
  amenities?: string[]; // Amenity IDs
}

export interface VenueFilterProps {
  /**
   * Current filter options
   */
  filters: FilterOptions;
  
  /**
   * Handler for filter changes
   */
  onFilterChange: (filters: FilterOptions) => void;
  
  /**
   * Available sports for filtering
   */
  availableSports: Sport[];
  
  /**
   * Available amenities for filtering
   */
  availableAmenities: { id: string; name: string; icon?: string }[];
  
  /**
   * Style for the container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Whether the filters are in compact mode
   * @default false
   */
  compact?: boolean;
}

/**
 * Component for filtering venue listings
 */
const VenueFilter: React.FC<VenueFilterProps> = ({
  filters,
  onFilterChange,
  availableSports,
  availableAmenities,
  style,
  compact = false
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  
  // Local state to track filter changes before applying
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  
  const handleSportToggle = (sportId: string) => {
    const newSports = localFilters.sports ? [...localFilters.sports] : [];
    
    if (newSports.includes(sportId)) {
      const index = newSports.indexOf(sportId);
      newSports.splice(index, 1);
    } else {
      newSports.push(sportId);
    }
    
    const updatedFilters = {
      ...localFilters,
      sports: newSports
    };
    
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const handleVenueTypeToggle = (type: VenueType) => {
    const newTypes = localFilters.venueTypes ? [...localFilters.venueTypes] : [];
    
    if (newTypes.includes(type)) {
      const index = newTypes.indexOf(type);
      newTypes.splice(index, 1);
    } else {
      newTypes.push(type);
    }
    
    const updatedFilters = {
      ...localFilters,
      venueTypes: newTypes
    };
    
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const handleAmenityToggle = (amenityId: string) => {
    const newAmenities = localFilters.amenities ? [...localFilters.amenities] : [];
    
    if (newAmenities.includes(amenityId)) {
      const index = newAmenities.indexOf(amenityId);
      newAmenities.splice(index, 1);
    } else {
      newAmenities.push(amenityId);
    }
    
    const updatedFilters = {
      ...localFilters,
      amenities: newAmenities
    };
    
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const handleRatingChange = (rating: number) => {
    const updatedFilters = {
      ...localFilters,
      rating
    };
    
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {};
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };
  
  // Sports filter section
  const renderSportsFilter = () => (
    <View style={styles.filterSection}>
      <Text variant="h3" style={styles.sectionTitle}>Sports</Text>
      <ScrollView 
        horizontal={compact}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={compact ? styles.chipScrollContainer : styles.chipContainer}
      >
        {availableSports.map(sport => {
          const isSelected = localFilters.sports?.includes(sport.id);
          return (
            <TouchableOpacity
              key={sport.id}
              style={[
                styles.chip,
                isSelected && styles.selectedChip
              ]}
              onPress={() => handleSportToggle(sport.id)}
            >
              <Text 
                variant="body2" 
                style={[
                  styles.chipText,
                  isSelected && styles.selectedChipText
                ]}
              >
                {sport.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
  
  // Venue type filter section
  const renderVenueTypeFilter = () => (
    <View style={styles.filterSection}>
      <Text variant="h3" style={styles.sectionTitle}>Venue Type</Text>
      <View style={styles.chipContainer}>
        {Object.values(VenueType).map(type => {
          const isSelected = localFilters.venueTypes?.includes(type);
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.chip,
                isSelected && styles.selectedChip
              ]}
              onPress={() => handleVenueTypeToggle(type)}
            >
              <Text 
                variant="body2" 
                style={[
                  styles.chipText,
                  isSelected && styles.selectedChipText
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
  
  // Rating filter section
  const renderRatingFilter = () => (
    <View style={styles.filterSection}>
      <Text variant="h3" style={styles.sectionTitle}>Minimum Rating</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map(rating => (
          <TouchableOpacity
            key={rating}
            onPress={() => handleRatingChange(rating)}
            style={styles.starContainer}
          >
            <Icon 
              name="star" 
              size={24} 
              color={localFilters.rating && rating <= localFilters.rating 
                ? colors.accent.main 
                : colors.grey[300]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  
  // Clear filters button
  const renderClearButton = () => {
    const hasActiveFilters = Object.keys(localFilters).some(key => 
      Array.isArray(localFilters[key as keyof FilterOptions]) 
        ? (localFilters[key as keyof FilterOptions] as any[]).length > 0
        : !!localFilters[key as keyof FilterOptions]
    );
    
    if (!hasActiveFilters) return null;
    
    return (
      <TouchableOpacity
        style={styles.clearButton}
        onPress={handleClearFilters}
      >
        <Text variant="body2" style={styles.clearButtonText}>
          Clear All Filters
        </Text>
      </TouchableOpacity>
    );
  };
  
  if (compact) {
    return (
      <View style={[styles.containerCompact, style]}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.compactScrollContent}
        >
          {renderSportsFilter()}
          {renderVenueTypeFilter()}
          {renderRatingFilter()}
        </ScrollView>
        {renderClearButton()}
      </View>
    );
  }
  
  return (
    <View style={[styles.container, style]}>
      {renderSportsFilter()}
      {renderVenueTypeFilter()}
      {renderRatingFilter()}
      {renderClearButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  containerCompact: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  compactScrollContent: {
    paddingRight: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipScrollContainer: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  chip: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: '#0066CC',
  },
  chipText: {
    color: '#424242',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    marginRight: 8,
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  clearButtonText: {
    color: '#0066CC',
  },
});

export default VenueFilter; 