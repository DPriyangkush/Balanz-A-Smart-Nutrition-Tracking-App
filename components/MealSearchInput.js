import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Input, XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const MealSearchInput = ({ 
  placeholder = "Find your healthy meal...", 
  onChangeText, 
  value,
  onMenuPress,
  onSubmitEditing,
  onBackPress,
  showBackButton = false,
  autoFocus = false
}) => {
  // Responsive breakpoints
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 768;
  const isLargeScreen = screenWidth >= 768 && screenWidth < 1024;
  const isTablet = screenWidth >= 768;
  const isLargeTablet = screenWidth >= 1024;

  // Dynamic sizing functions with min/max constraints
  const getContainerMarginBottom = () => {
    if (isSmallScreen) return 16;
    if (isMediumScreen) return 20;
    if (isLargeScreen) return 24;
    if (isLargeTablet) return 28;
    return 20;
  };

  const getHorizontalPadding = () => {
    if (isSmallScreen) return 12;
    if (isMediumScreen) return 15;
    if (isLargeScreen) return 18;
    if (isLargeTablet) return 22;
    return 15;
  };

  const getBorderRadius = () => {
    if (isSmallScreen) return 25;
    if (isMediumScreen) return 30;
    if (isLargeScreen) return 35;
    if (isLargeTablet) return 40;
    return 30;
  };

  const getIconSize = () => {
    if (isSmallScreen) return 20;
    if (isMediumScreen) return 24;
    if (isLargeScreen) return 28;
    if (isLargeTablet) return 32;
    return 24;
  };

  const getInputFontSize = () => {
    if (isSmallScreen) return 14;
    if (isMediumScreen) return 16;
    if (isLargeScreen) return 18;
    if (isLargeTablet) return 20;
    return 16;
  };

  const getInputSize = () => {
    if (isSmallScreen) return '$4';
    if (isMediumScreen) return '$5';
    if (isLargeScreen) return '$6';
    if (isLargeTablet) return '$7';
    return '$5';
  };

  const getMenuButtonPadding = () => {
    if (isSmallScreen) return { horizontal: 12, vertical: 13 };
    if (isMediumScreen) return { horizontal: 16, vertical: 15 };
    if (isLargeScreen) return { horizontal: 20, vertical: 21 };
    if (isLargeTablet) return { horizontal: 24, vertical: 25 };
    return { horizontal: 20, vertical: 15 };
  };

  const getContainerGap = () => {
    if (isSmallScreen) return '$2';
    if (isMediumScreen) return '$2';
    if (isLargeScreen) return '$3';
    if (isLargeTablet) return '$4';
    return '$2';
  };

  const getShadowProps = () => {
    if (isSmallScreen) {
      return {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      };
    }
    if (isMediumScreen) {
      return {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
      };
    }
    if (isTablet) {
      return {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
      };
    }
    return {
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6,
    };
  };

  const getBorderWidth = () => {
    if (isSmallScreen) return 0.3;
    if (isMediumScreen) return 0.5;
    if (isTablet) return 0.8;
    return 0.5;
  };

  // Calculate dynamic values
  const horizontalPadding = getHorizontalPadding();
  const borderRadius = getBorderRadius();
  const iconSize = getIconSize();
  const menuButtonPadding = getMenuButtonPadding();
  const shadowProps = getShadowProps();
  const borderWidth = getBorderWidth();

  // Get responsive placeholder based on screen size
  const getResponsivePlaceholder = () => {
    if (isSmallScreen) return "Find meal...";
    if (isMediumScreen) return "Find your meal...";
    return placeholder;
  };

  // Handle search icon press or search submission
  const handleSearchAction = () => {
    if (onSubmitEditing) {
      onSubmitEditing();
    }
  };

  // Create dynamic styles
  const responsiveStyles = StyleSheet.create({
    searchContainer: {
      marginBottom: getContainerMarginBottom(),
      paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 0 : 24,
    },
    searchInputContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderRadius: borderRadius,
      paddingHorizontal: horizontalPadding,
      borderWidth: borderWidth,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      shadowColor: '#000',
      ...shadowProps,
      // Enhanced glass effects for tablets
      ...(isTablet && {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.4)',
      }),
      // iOS liquid glass effects
      backdropFilter: 'blur(20px)',
      overflow: 'hidden',
      // Minimum height for touch accessibility
      minHeight: isSmallScreen ? 44 : isMediumScreen ? 48 : 52,
    },
    searchIcon: {
      fontSize: iconSize,
      color: '#666',
      marginRight: isSmallScreen ? -8 : -10,
    },
    inputStyle: {
      fontSize: getInputFontSize(),
      color: '#333',
      // Adjust padding for different screen sizes
      paddingVertical: isSmallScreen ? 8 : isMediumScreen ? 12 : 16,
    },
    actionButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderRadius: borderRadius,
      paddingHorizontal: menuButtonPadding.horizontal,
      paddingVertical: menuButtonPadding.vertical,
      borderWidth: borderWidth,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      shadowColor: '#000',
      ...shadowProps,
      // Enhanced glass effects for tablets
      ...(isTablet && {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.4)',
      }),
      // iOS liquid glass effects
      backdropFilter: 'blur(20px)',
      overflow: 'hidden',
      // Ensure square aspect ratio for buttons
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // Minimum touch target
      minWidth: isSmallScreen ? 44 : isMediumScreen ? 48 : 52,
      minHeight: isSmallScreen ? 44 : isMediumScreen ? 48 : 52,
    },
    searchIconButton: {
      marginRight: isSmallScreen ? -4 : -6,
    },
  });

  return (
    <XStack 
      style={responsiveStyles.searchContainer} 
      space={getContainerGap()} 
      alignItems="center"
    >
      {/* Back Button (conditionally rendered) */}
      {showBackButton && (
        <TouchableOpacity 
          style={responsiveStyles.actionButton}
          onPress={onBackPress}
          activeOpacity={0.8}
          accessibilityLabel="Go back"
          accessibilityHint="Tap to go back to the previous screen"
          accessibilityRole="button"
        >
          <Ionicons 
            name="arrow-back" 
            size={iconSize} 
            color="#333" 
          />
        </TouchableOpacity>
      )}

      <XStack 
        style={responsiveStyles.searchInputContainer} 
        flex={1} 
        alignItems="center"
      >
        {/* Search Icon - now clickable */}
        <TouchableOpacity 
          onPress={handleSearchAction}
          style={responsiveStyles.searchIconButton}
          accessibilityLabel="Perform search"
          accessibilityHint="Tap to search for meals"
          accessibilityRole="button"
        >
          <Ionicons 
            name="search" 
            size={iconSize} 
            color="#666" 
            style={responsiveStyles.searchIcon} 
          />
        </TouchableOpacity>
        
        <Input
          flex={1}
          placeholder={getResponsivePlaceholder()}
          placeholderTextColor="#999"
          size={getInputSize()}
          backgroundColor="transparent"
          borderWidth={0}
          fontSize={getInputFontSize()}
          color="#333"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSearchAction}
          style={responsiveStyles.inputStyle}
          autoFocus={autoFocus}
          // Accessibility improvements
          accessibilityLabel="Search for meals"
          accessibilityHint="Enter keywords to find healthy meals"
          returnKeyType="search"
          // Keyboard optimizations
          autoCapitalize="none"
          autoCorrect={true}
          clearButtonMode="while-editing"
        />
      </XStack>

      {/* Menu Button (only show when not in search mode) */}
      {!showBackButton && (
        <TouchableOpacity 
          style={responsiveStyles.actionButton}
          onPress={onMenuPress}
          activeOpacity={0.8}
          accessibilityLabel="Open menu"
          accessibilityHint="Tap to open the main menu"
          accessibilityRole="button"
        >
          <Ionicons 
            name="menu" 
            size={iconSize} 
            color="#333" 
          />
        </TouchableOpacity>
      )}
    </XStack>
  );
};

export default MealSearchInput;