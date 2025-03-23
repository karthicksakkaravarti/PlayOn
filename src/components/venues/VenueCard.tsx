import React from 'react';
import { 
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  ImageSourcePropType
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserStackParamList } from '../../types/navigation';
import { Venue } from '../../types/venue';
import { useTheme } from '../../hooks/useTheme';
import Text from '../ui/Text';
import { Card } from '../ui/Card';
import Icon from '../ui/Icon';

export interface VenueCardProps {
  /**
   * Venue data to display
   */
  venue: Venue;
  
  /**
   * Style for the card container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Whether to show compact version of the card
   * @default false
   */
  compact?: boolean;
  
  /**
   * Optional onPress handler for when the card is pressed
   * (if not provided, will navigate to venue detail screen)
   */
  onPress?: () => void;
}

type VenueScreenNavigationProp = StackNavigationProp<UserStackParamList, 'VenueDetail'>;

/**
 * Card component to display venue information
 */
const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  style,
  compact = false,
  onPress
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation<VenueScreenNavigationProp>();
  const { colors, spacing, radius } = theme;
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('VenueDetail', { venueId: venue.id });
    }
  };
  
  // Format price to display correctly
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'INR') {
      return `₹${price}`;
    }
    return `${currency} ${price}`;
  };
  
  const renderRating = () => (
    <View style={styles.ratingContainer}>
      <Icon name="star" color={colors.accent.main} size={14} />
      <Text variant="body2" style={styles.ratingText}>
        {venue.ratings.average} ({venue.ratings.count})
      </Text>
    </View>
  );

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.8}
      style={[styles.container, style]}
    >
      <View style={styles.card}>
        <Image 
          source={{ uri: venue.primaryImage }} 
          style={[
            styles.image,
            compact ? styles.compactImage : styles.fullImage
          ]}
          resizeMode="cover"
        />
        
        {venue.featured && (
          <View style={styles.featuredBadge}>
            <Text variant="caption" style={styles.featuredText}>Featured</Text>
          </View>
        )}
        
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text 
              variant={compact ? "body1" : "h3"} 
              style={styles.title}
              numberOfLines={1}
            >
              {venue.name}
            </Text>
            {renderRating()}
          </View>
          
          <View style={styles.detailsRow}>
            <View style={styles.locationContainer}>
              <Icon name="map-pin" size={14} color={colors.text.secondary} />
              <Text 
                variant="body2" 
                style={styles.locationText}
                numberOfLines={1}
              >
                {venue.address.city}
              </Text>
            </View>
            
            <Text variant="body1" style={styles.priceText}>
              {formatPrice(venue.pricing.basePrice, venue.pricing.currency)}/hr
            </Text>
          </View>
          
          {!compact && (
            <View style={styles.sportsRow}>
              {venue.sports.slice(0, 3).map((sport, index) => (
                <View key={sport.id} style={styles.sportTag}>
                  <Text variant="caption" style={styles.sportText}>
                    {sport.name}
                  </Text>
                </View>
              ))}
              {venue.sports.length > 3 && (
                <Text variant="caption" style={styles.moreSportsText}>
                  +{venue.sports.length - 3} more
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    backgroundColor: '#E1E1E1',
  },
  compactImage: {
    height: 120,
  },
  fullImage: {
    height: 180,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredText: {
    color: '#000',
    fontWeight: '600',
  },
  contentContainer: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 4,
    color: '#757575',
  },
  priceText: {
    fontWeight: '600',
  },
  sportsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
  },
  sportTag: {
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  sportText: {
    color: '#424242',
  },
  moreSportsText: {
    color: '#757575',
    marginLeft: 4,
  },
});

export default VenueCard; 