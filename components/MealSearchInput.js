import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, View, TextInput } from 'react-native';
import { XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const MealSearchInput = ({ 
  placeholder = "Find your healthy meal...", 
  onChangeText, 
  value,
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

  const getBackButtonPadding = () => {
    if (isSmallScreen) return { horizontal: 12, vertical: 13 };
    if (isMediumScreen) return { horizontal: 16, vertical: 15 };
    if (isLargeScreen) return { horizontal: 20, vertical: 21 };
    if (isLargeTablet) return { horizontal: 24, vertical: 25 };
    return { horizontal: 20, vertical: 15 };
  };

  const getContainerGap = () => {
    if (isSmallScreen) return 8;
    if (isMediumScreen) return 8;
    if (isLargeScreen) return 12;
    if (isLargeTablet) return 16;
    return 8;
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
  const backButtonPadding = getBackButtonPadding();
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

  // Handle back button press - ensure it's properly called
  const handleBackPress = () => {
    console.log('Back button pressed - calling onBackPress');
    if (onBackPress) {
      onBackPress();
    } else {
      console.warn('onBackPress is not defined');
    }
  };

  // Create dynamic styles
  const responsiveStyles = StyleSheet.create({
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: "flex-start",
      marginBottom: getContainerMarginBottom(),
      paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 0 : 24,
      gap: getContainerGap(),
      zIndex: 999999,
      elevation: 999999,
    },
    
    searchInputContainer: {
      flex: 1,
      flexShrink: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderRadius: borderRadius,
      paddingHorizontal: horizontalPadding,
      paddingVertical: isSmallScreen ? 8 : isMediumScreen ? 5 : 16,
      borderWidth: borderWidth,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      shadowColor: '#000',
      ...shadowProps,
      ...(isTablet && {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.4)',
      }),
      minHeight: isSmallScreen ? 44 : isMediumScreen ? 48 : 52,
    },
    
    searchIconButton: {
      padding: 8,
      marginRight: 4,
      borderRadius: 20,
      minWidth: 32,
      minHeight: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    textInput: {
      flex: 1,
      fontSize: getInputFontSize(),
      color: '#333',
      paddingVertical: 0,
      paddingHorizontal: 8,
      backgroundColor: 'transparent',
      borderWidth: 0,
      outline: 'none',
      minHeight: isSmallScreen ? 28 : isMediumScreen ? 32 : 36,
    },

    // Enhanced back button with guaranteed touch response
    enhancedBackButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: borderRadius,
      paddingHorizontal: backButtonPadding.horizontal,
      paddingVertical: backButtonPadding.vertical,
      borderWidth: borderWidth,
      borderColor: 'rgba(255, 255, 255, 0.5)',
      shadowColor: '#000',
      ...shadowProps,
      ...(isTablet && {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.4)',
      }),
      justifyContent: 'center',
      alignItems: 'center',
      width: isSmallScreen ? 48 : isMediumScreen ? 52 : 56,
      height: isSmallScreen ? 48 : isMediumScreen ? 52 : 56,
      zIndex: 999999,
      elevation: 999999,
      position: 'relative',
    },
  });

  return (
    <View style={responsiveStyles.searchContainer}>
      {showBackButton && (
        <View style={{ zIndex: 9999999, elevation: 9999999, position: 'relative' }}>
          <TouchableOpacity 
            style={responsiveStyles.enhancedBackButton}
            onPress={() => {
              console.log('Back button touch detected');
              handleBackPress();
            }}
            onPressIn={() => console.log('Back button press in')}
            onPressOut={() => console.log('Back button press out')}
            activeOpacity={0.6}
            accessibilityLabel="Go back"
            accessibilityHint="Tap to go back to the previous screen"
            accessibilityRole="button"
            hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }}
            delayPressIn={0}
            delayPressOut={0}
            disabled={false}
            testID="back-button"
          >
            <Ionicons 
              name="arrow-back" 
              size={iconSize} 
              color="#333"
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={responsiveStyles.searchInputContainer}>
        <TouchableOpacity 
          onPress={handleSearchAction}
          style={responsiveStyles.searchIconButton}
          activeOpacity={0.7}
          accessibilityLabel="Perform search"
          accessibilityHint="Tap to search for meals"
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name="search" 
            size={iconSize} 
            color="#666"
          />
        </TouchableOpacity>
        
        <TextInput
          style={responsiveStyles.textInput}
          placeholder={getResponsivePlaceholder()}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSearchAction}
          autoFocus={autoFocus}
          accessibilityLabel="Search for meals"
          accessibilityHint="Enter keywords to find healthy meals"
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={true}
          editable={true}
          selectTextOnFocus={true}
          clearButtonMode="while-editing"
          blurOnSubmit={false}
          underlineColorAndroid="transparent"
          textAlignVertical="center"
        />
      </View>
    </View>
  );
};

export default MealSearchInput;