import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { XStack, YStack } from 'tamagui';

const { width: screenWidth } = Dimensions.get('window');

const MealSectionHeader = ({
  title,
  badgeText,
  badgeIcon,
  showBadge = true,
  onArrowPress
}) => {
  // Responsive breakpoints
  const isSmallScreen = screenWidth < 380;
  const isMediumScreen = screenWidth >= 380 && screenWidth < 768;
  const isLargeScreen = screenWidth >= 768;
  const isTablet = screenWidth >= 768;

  // Dynamic spacing and sizing functions
  const getTitleFontSize = () => {
    if (isSmallScreen) return 18;
    if (isMediumScreen) return 20;
    if (isTablet) return 24;
    return 20;
  };

  const getArrowFontSize = () => {
    if (isSmallScreen) return 14;
    if (isMediumScreen) return 16;
    if (isTablet) return 18;
    return 16;
  };

  const getBadgeIconSize = () => {
    if (isSmallScreen) return 14;
    if (isMediumScreen) return 16;
    if (isTablet) return 18;
    return 16;
  };

  const getBadgeTextSize = () => {
    if (isSmallScreen) return 12;
    if (isMediumScreen) return 14;
    if (isTablet) return 16;
    return 14;
  };

  const getTitleMarginBottom = () => {
    if (isSmallScreen) return 16;
    if (isMediumScreen) return 20;
    if (isTablet) return 24;
    return 20;
  };

  const getBadgeMarginTop = () => {
    if (isSmallScreen) return -16;
    if (isMediumScreen) return -20;
    if (isTablet) return -24;
    return -20;
  };

  const getBadgePadding = () => {
    if (isSmallScreen) return { horizontal: 12, vertical: 6 };
    if (isMediumScreen) return { horizontal: 16, vertical: 8 };
    if (isTablet) return { horizontal: 20, vertical: 10 };
    return { horizontal: 16, vertical: 8 };
  };

  const getBadgeRadius = () => {
    if (isSmallScreen) return 16;
    if (isMediumScreen) return 20;
    if (isTablet) return 24;
    return 20;
  };

  const getContainerSpacing = () => {
    if (isSmallScreen) return "$2.5";
    if (isMediumScreen) return "$3";
    if (isTablet) return "$4";
    return "$3";
  };

  const getBadgeGap = () => {
    if (isSmallScreen) return "$1.5";
    if (isMediumScreen) return "$2";
    if (isTablet) return "$2.5";
    return "$2";
  };

  const badgePadding = getBadgePadding();

  const responsiveStyles = StyleSheet.create({
    sectionTitle: {
      fontSize: getTitleFontSize(),
      fontWeight: 'bold',
      color: '#333',
      marginBottom: getTitleMarginBottom(),
      lineHeight: getTitleFontSize() * 1.3, // Dynamic line height
    },
    arrow: {
      fontSize: getArrowFontSize(),
      color: '#333',
      marginBottom: getTitleMarginBottom(),
      fontWeight: '500',
      // Add touch target padding for better accessibility
      paddingHorizontal: isSmallScreen ? 8 : 12,
      paddingVertical: isSmallScreen ? 4 : 6,
    },
    badge: {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      borderRadius: getBadgeRadius(),
      marginTop: getBadgeMarginTop(),
      paddingHorizontal: badgePadding.horizontal,
      paddingVertical: badgePadding.vertical,
      // Add subtle border for better definition
      borderWidth: 1,
      borderColor: 'rgba(76, 175, 80, 0.2)',
      // Add shadow for depth on larger screens
      ...(isTablet && {
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }),
    },
    badgeIcon: {
      fontSize: getBadgeIconSize(),
      color: '#4CAF50',
    },
    badgeText: {
      fontSize: getBadgeTextSize(),
      color: '#4CAF50',
      fontWeight: '500',
      lineHeight: getBadgeTextSize() * 1.2,
    },
    // Container styles for consistent spacing
    headerContainer: {
      paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 0 : 24,
    },
    titleRow: {
      minHeight: isSmallScreen ? 40 : isMediumScreen ? 44 : 48, // Ensure consistent touch targets
    },
  });

  return (
    <YStack space={getContainerSpacing()} style={responsiveStyles.headerContainer}>
      {/* Section Title with Arrow */}
      <XStack 
        justifyContent="space-between" 
        alignItems="center"
        style={responsiveStyles.titleRow}
      >
        <Text style={responsiveStyles.sectionTitle} numberOfLines={2}>
          {title}
        </Text>
        {onArrowPress && (
          <TouchableOpacity 
            onPress={onArrowPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Better touch target
          >
            <Text style={responsiveStyles.arrow}>More</Text>
          </TouchableOpacity>
        )}
      </XStack>

      {/* Badge */}
      {showBadge && badgeText && (
        <XStack
          style={responsiveStyles.badge}
          alignItems="center"
          space={getBadgeGap()}
          alignSelf="flex-start"
        >
          {badgeIcon && (
            <Text style={responsiveStyles.badgeIcon}>{badgeIcon}</Text>
          )}
          <Text style={responsiveStyles.badgeText} numberOfLines={1}>
            {badgeText}
          </Text>
        </XStack>
      )}
    </YStack>
  );
};

export default MealSectionHeader;