import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  StyleProp, 
  ViewStyle,
  Platform,
  Linking,
  Alert
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../../hooks/useTheme';
import { Venue } from '../../types/venue';
import Text from '../ui/Text';
import Icon from '../ui/Icon';

export interface VenueMapProps {
  /**
   * List of venues to display on the map
   */
  venues: Venue[];
  
  /**
   * Initial region for the map
   */
  initialRegion?: Region;
  
  /**
   * Handler for when a venue marker is pressed
   */
  onVenuePress?: (venue: Venue) => void;
  
  /**
   * Style for the container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Whether the map is in compact mode
   * @default false
   */
  compact?: boolean;
  
  /**
   * Whether to show user location on the map
   * @default true
   */
  showUserLocation?: boolean;
  
  /**
   * Whether to initially center map on user location
   * @default true
   */
  centerOnUser?: boolean;
}

/**
 * Map component for displaying venues
 */
const VenueMap: React.FC<VenueMapProps> = ({
  venues,
  initialRegion,
  onVenuePress,
  style,
  compact = false,
  showUserLocation = true,
  centerOnUser = true
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const mapRef = useRef<MapView>(null);
  
  // Default region (India)
  const defaultRegion: Region = {
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 20,
    longitudeDelta: 20
  };
  
  const [region, setRegion] = useState<Region>(initialRegion || defaultRegion);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  
  useEffect(() => {
    if (showUserLocation || centerOnUser) {
      requestLocationPermission();
    }
  }, []);
  
  useEffect(() => {
    if (initialRegion) {
      setRegion(initialRegion);
      if (mapRef.current) {
        mapRef.current.animateToRegion(initialRegion, 500);
      }
    }
  }, [initialRegion]);
  
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationPermissionDenied(true);
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      
      setUserLocation(location);
      
      if (centerOnUser) {
        const userRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        };
        
        setRegion(userRegion);
        
        if (mapRef.current) {
          mapRef.current.animateToRegion(userRegion, 500);
        }
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };
  
  const handleMarkerPress = (venue: Venue) => {
    if (onVenuePress) {
      onVenuePress(venue);
    }
  };
  
  const handleMapPress = (e: any) => {
    // Do nothing when map is pressed outside markers
  };
  
  const handleRecenterPress = () => {
    if (userLocation && mapRef.current) {
      const userRegion = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      };
      
      mapRef.current.animateToRegion(userRegion, 500);
    } else if (!locationPermissionDenied) {
      requestLocationPermission();
    } else {
      Alert.alert(
        'Location Permission',
        'Please enable location permissions in your device settings to use this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openSettings }
        ]
      );
    }
  };
  
  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };
  
  const renderMap = () => (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
      showsUserLocation={showUserLocation && !locationPermissionDenied}
      showsMyLocationButton={false}
      showsCompass={true}
      showsScale={true}
      showsBuildings={true}
      showsTraffic={false}
      showsIndoors={true}
      onPress={handleMapPress}
    >
      {venues.map(venue => (
        <Marker
          key={venue.id}
          coordinate={{
            latitude: venue.address.coordinates?.latitude || 0,
            longitude: venue.address.coordinates?.longitude || 0
          }}
          title={venue.name}
          description={`${venue.pricing.basePrice} ${venue.pricing.currency}/hr`}
          onPress={() => handleMarkerPress(venue)}
        />
      ))}
    </MapView>
  );
  
  const renderRecenterButton = () => (
    <TouchableOpacity
      style={styles.recenterButton}
      onPress={handleRecenterPress}
    >
      <Icon name="navigation" size={20} color={colors.primary.main} />
    </TouchableOpacity>
  );
  
  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        {renderMap()}
        {renderRecenterButton()}
      </View>
    );
  }
  
  return (
    <View style={[styles.container, style]}>
      {renderMap()}
      {renderRecenterButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  compactContainer: {
    height: 200,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 30,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default VenueMap; 