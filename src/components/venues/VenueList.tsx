import React from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  ListRenderItemInfo,
  StyleProp,
  ViewStyle
} from 'react-native';
import { Venue } from '../../types/venue';
import { useTheme } from '../../hooks/useTheme';
import Text from '../ui/Text';
import VenueCard from './VenueCard';

export interface VenueListProps {
  /**
   * List of venues to display
   */
  venues: Venue[];
  
  /**
   * Whether venues are currently loading
   * @default false
   */
  loading?: boolean;
  
  /**
   * Text to display when no venues are available
   * @default "No venues found"
   */
  emptyText?: string;
  
  /**
   * Layout orientation of the list
   * @default "vertical"
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Whether to show venues in compact mode
   * @default false
   */
  compact?: boolean;
  
  /**
   * Handler for when a venue is pressed
   */
  onVenuePress?: (venue: Venue) => void;
  
  /**
   * Style for the container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Style for the content container
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Callback for when the end of the list is reached
   */
  onEndReached?: () => void;
  
  /**
   * Title for the venue list section
   */
  title?: string;
}

/**
 * Component for rendering a list of venues
 */
const VenueList: React.FC<VenueListProps> = ({
  venues,
  loading = false,
  emptyText = 'No venues found',
  orientation = 'vertical',
  compact = false,
  onVenuePress,
  style,
  contentContainerStyle,
  onEndReached,
  title
}) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  
  const isHorizontal = orientation === 'horizontal';
  
  const renderItem = ({ item }: ListRenderItemInfo<Venue>) => (
    <VenueCard
      venue={item}
      compact={compact}
      style={isHorizontal ? styles.horizontalCard : styles.verticalCard}
      onPress={onVenuePress ? () => onVenuePress(item) : undefined}
    />
  );
  
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      );
    }
    
    if (!venues.length) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="body1">{emptyText}</Text>
        </View>
      );
    }
    
    return (
      <FlatList
        data={venues}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal={isHorizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          isHorizontal ? styles.horizontalList : styles.verticalList,
          contentContainerStyle
        ]}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
      />
    );
  };
  
  return (
    <View style={[styles.container, style]}>
      {title && <Text variant="h2" style={styles.title}>{title}</Text>}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 16,
  },
  horizontalList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  verticalList: {
    padding: 16,
  },
  horizontalCard: {
    width: 280,
    marginRight: 16,
  },
  verticalCard: {
    marginBottom: 16,
  }
});

export default VenueList; 