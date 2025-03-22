import React, { useEffect } from 'react';
import {
  View,
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  Platform,
  BackHandler,
  KeyboardAvoidingView,
  DimensionValue,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface ModalProps {
  /**
   * Whether the modal is visible
   * @default false
   */
  visible: boolean;
  
  /**
   * Title of the modal
   */
  title?: string;
  
  /**
   * Content to display in the modal
   */
  children: React.ReactNode;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  
  /**
   * Whether to close the modal when clicked outside
   * @default true
   */
  closeOnBackdropPress?: boolean;
  
  /**
   * Whether to show a close button in the top-right corner
   * @default true
   */
  showCloseButton?: boolean;
  
  /**
   * Custom style for the modal container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Custom style for the content container
   */
  contentStyle?: StyleProp<ViewStyle>;
  
  /**
   * Animation type for the modal
   * @default "fade"
   */
  animationType?: 'fade' | 'slide' | 'none';
  
  /**
   * Whether to show a backdrop behind the modal
   * @default true
   */
  hasBackdrop?: boolean;
  
  /**
   * Custom style for the backdrop
   */
  backdropStyle?: StyleProp<ViewStyle>;
  
  /**
   * Whether the modal takes up the full screen
   * @default false
   */
  fullScreen?: boolean;
  
  /**
   * Content to display in the footer
   */
  footer?: React.ReactNode;
  
  /**
   * Content to display in the header (overrides title)
   */
  header?: React.ReactNode;
  
  /**
   * Position of the modal
   * @default "center"
   */
  position?: 'center' | 'top' | 'bottom';
  
  /**
   * Width of the modal
   * @default "85%"
   */
  width?: DimensionValue;
  
  /**
   * Height of the modal
   */
  height?: DimensionValue;
  
  /**
   * Whether to avoid keyboard
   * @default true
   */
  avoidKeyboard?: boolean;
}

/**
 * Modal component for displaying content in an overlay
 */
export const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  children,
  onClose,
  closeOnBackdropPress = true,
  showCloseButton = true,
  style,
  contentStyle,
  animationType = 'fade',
  hasBackdrop = true,
  backdropStyle,
  fullScreen = false,
  footer,
  header,
  position = 'center',
  width = '85%',
  height,
  avoidKeyboard = true,
}) => {
  const { theme } = useTheme();
  const { colors, typography, radius, spacing } = theme;
  
  // Handle back button press
  useEffect(() => {
    const handleBackPress = () => {
      if (visible) {
        onClose();
        return true;
      }
      return false;
    };
    
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );
    
    return () => backHandler.remove();
  }, [visible, onClose]);
  
  // Get position style
  const getPositionStyle = (): ViewStyle => {
    switch (position) {
      case 'top':
        return {
          justifyContent: 'flex-start',
          paddingTop: 50,
        };
      case 'bottom':
        return {
          justifyContent: 'flex-end',
          paddingBottom: 50,
        };
      case 'center':
      default:
        return {
          justifyContent: 'center',
        };
    }
  };
  
  // Create modal styles
  const modalStyles = StyleSheet.create({
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      ...getPositionStyle(),
    },
    content: {
      width: fullScreen ? '100%' : width,
      height: fullScreen ? '100%' : height,
      backgroundColor: colors.background.light,
      borderRadius: fullScreen ? 0 : radius.md,
      overflow: 'hidden',
      maxHeight: fullScreen ? '100%' : '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
      padding: spacing.md,
    },
    title: {
      flex: 1,
    },
    closeButton: {
      padding: spacing.sm,
      marginLeft: spacing.md,
    },
    closeIcon: {
      fontSize: 20,
      color: colors.text.secondary,
    },
    body: {
      padding: spacing.md,
      flex: 1,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
      padding: spacing.md,
    },
    fullScreenContent: {
      width: '100%',
      height: '100%',
      borderRadius: 0,
    },
  });
  
  return (
    <RNModal
      transparent={true}
      visible={visible}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled={avoidKeyboard}
      >
        <View style={modalStyles.container}>
          {/* Backdrop */}
          {hasBackdrop && (
            <TouchableWithoutFeedback
              onPress={closeOnBackdropPress ? onClose : undefined}
            >
              <View style={[modalStyles.backdrop, backdropStyle]} />
            </TouchableWithoutFeedback>
          )}
          
          {/* Content */}
          <View
            style={[
              modalStyles.content,
              fullScreen && modalStyles.fullScreenContent,
              style,
            ]}
          >
            {/* Header */}
            {(title || header || showCloseButton) && (
              <View style={modalStyles.header}>
                {header || (
                  <View style={modalStyles.title}>
                    {title && (
                      <Text variant="h5" weight="bold">
                        {title}
                      </Text>
                    )}
                  </View>
                )}
                
                {showCloseButton && (
                  <TouchableOpacity
                    style={modalStyles.closeButton}
                    onPress={onClose}
                  >
                    <Text style={modalStyles.closeIcon}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            {/* Body */}
            <View style={[modalStyles.body, contentStyle]}>
              {children}
            </View>
            
            {/* Footer */}
            {footer && (
              <View style={modalStyles.footer}>
                {footer}
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}; 