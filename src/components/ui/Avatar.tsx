import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface AvatarProps {
  /**
   * Avatar size
   * @default "medium"
   */
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
  
  /**
   * Source for the avatar image
   */
  source?: ImageSourcePropType;
  
  /**
   * Name to display as initials when no image is available
   */
  name?: string;
  
  /**
   * Whether the avatar should have a border
   * @default false
   */
  bordered?: boolean;
  
  /**
   * Background color for the avatar (when showing initials)
   */
  backgroundColor?: string;
  
  /**
   * Text color for initials
   */
  textColor?: string;
  
  /**
   * Whether the avatar is pressable
   * @default false
   */
  pressable?: boolean;
  
  /**
   * Function to call when the avatar is pressed
   */
  onPress?: () => void;
  
  /**
   * Custom style for the avatar container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Custom style for the avatar image
   */
  imageStyle?: StyleProp<ImageStyle>;
  
  /**
   * Custom style for the avatar text
   */
  textStyle?: StyleProp<TextStyle>;
  
  /**
   * Whether to show a busy indicator
   * @default false
   */
  busy?: boolean;
  
  /**
   * Color of the busy indicator
   */
  busyColor?: string;
  
  /**
   * Whether to show a badge
   * @default false
   */
  showBadge?: boolean;
  
  /**
   * Badge content
   */
  badgeContent?: React.ReactNode;
  
  /**
   * Color of the badge
   */
  badgeColor?: string;
}

/**
 * Avatar component for displaying user profile images or initials
 */
export const Avatar: React.FC<AvatarProps> = ({
  size = 'medium',
  source,
  name,
  bordered = false,
  backgroundColor,
  textColor,
  pressable = false,
  onPress,
  style,
  imageStyle,
  textStyle,
  busy = false,
  busyColor,
  showBadge = false,
  badgeContent,
  badgeColor,
}) => {
  const { theme } = useTheme();
  const { colors, typography } = theme;
  
  // Get initials from name
  const getInitials = (name?: string): string => {
    if (!name) return '';
    
    const nameParts = name.trim().split(' ');
    
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };
  
  // Get size dimensions
  const getSizeDimensions = (sizeType: string): number => {
    switch (sizeType) {
      case 'tiny': return 24;
      case 'small': return 32;
      case 'large': return 64;
      case 'xlarge': return 96;
      case 'medium':
      default: return 48;
    }
  };
  
  // Get font size for initials
  const getFontSize = (sizeType: string): number => {
    switch (sizeType) {
      case 'tiny': return typography.fontSize.xs;
      case 'small': return typography.fontSize.sm;
      case 'large': return typography.fontSize.xl;
      case 'xlarge': return typography.fontSize.xxl;
      case 'medium':
      default: return typography.fontSize.md;
    }
  };
  
  // Get badge size
  const getBadgeSize = (sizeType: string): number => {
    switch (sizeType) {
      case 'tiny': return 8;
      case 'small': return 10;
      case 'large': return 16;
      case 'xlarge': return 20;
      case 'medium':
      default: return 12;
    }
  };
  
  // Set dimensions
  const sizeDimension = getSizeDimensions(size);
  const fontSize = getFontSize(size);
  const badgeSize = getBadgeSize(size);
  
  // Set default colors
  const bgColor = backgroundColor || colors.primary.main;
  const txtColor = textColor || colors.primary.contrast;
  const bdgColor = badgeColor || colors.system.success;
  const bsyColor = busyColor || colors.primary.light;
  
  // Create styles
  const avatarStyles = StyleSheet.create({
    container: {
      width: sizeDimension,
      height: sizeDimension,
      borderRadius: sizeDimension / 2,
      backgroundColor: bgColor,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      ...(bordered ? {
        borderWidth: size === 'tiny' || size === 'small' ? 1 : 2,
        borderColor: colors.background.light,
      } : {}),
    },
    image: {
      width: '100%',
      height: '100%',
    },
    text: {
      fontSize,
      color: txtColor,
      fontFamily: typography.fontFamily.medium,
    },
    busyIndicator: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '100%',
      height: '30%',
      backgroundColor: bsyColor,
      opacity: 0.8,
    },
    busyText: {
      color: colors.text.light,
      fontSize: typography.fontSize.xs,
      textAlign: 'center',
    },
    badge: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: badgeSize,
      height: badgeSize,
      borderRadius: badgeSize / 2,
      backgroundColor: bdgColor,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.background.light,
    },
  });
  
  // Create the avatar content
  const renderAvatarContent = () => {
    if (source) {
      return <Image source={source} style={[avatarStyles.image, imageStyle]} />;
    }
    
    if (name) {
      return (
        <Text style={[avatarStyles.text, textStyle]}>
          {getInitials(name)}
        </Text>
      );
    }
    
    return null;
  };
  
  // Create the avatar component
  const AvatarComponent = (
    <View style={[avatarStyles.container, style]}>
      {renderAvatarContent()}
      
      {busy && (
        <View style={avatarStyles.busyIndicator}>
          <Text style={avatarStyles.busyText}>Busy</Text>
        </View>
      )}
      
      {showBadge && (
        <View style={avatarStyles.badge}>
          {badgeContent}
        </View>
      )}
    </View>
  );
  
  // Return the avatar
  if (pressable && onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {AvatarComponent}
      </TouchableOpacity>
    );
  }
  
  return AvatarComponent;
}; 