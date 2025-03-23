import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export type IconType = 'feather' | 'fontAwesome' | 'material' | 'materialCommunity' | 'ionicons';

export interface IconProps {
  /**
   * Name of the icon
   */
  name: string;
  
  /**
   * Size of the icon
   * @default 24
   */
  size?: number;
  
  /**
   * Color of the icon
   * @default #000
   */
  color?: string;
  
  /**
   * Icon set to use
   * @default feather
   */
  type?: IconType;
  
  /**
   * Style for the icon
   */
  style?: StyleProp<TextStyle>;
}

/**
 * Icon component that supports multiple icon sets
 */
const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000',
  type = 'feather',
  style
}) => {
  switch (type) {
    case 'fontAwesome':
      return (
        <FontAwesome 
          name={name} 
          size={size} 
          color={color} 
          style={style} 
        />
      );
    case 'material':
      return (
        <MaterialIcons 
          name={name} 
          size={size} 
          color={color} 
          style={style} 
        />
      );
    case 'materialCommunity':
      return (
        <MaterialCommunityIcons 
          name={name} 
          size={size} 
          color={color} 
          style={style} 
        />
      );
    case 'ionicons':
      return (
        <Ionicons 
          name={name} 
          size={size} 
          color={color} 
          style={style} 
        />
      );
    case 'feather':
    default:
      return (
        <Feather 
          name={name} 
          size={size} 
          color={color} 
          style={style} 
        />
      );
  }
};

export default Icon; 