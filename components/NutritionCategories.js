import React from 'react';
import { TouchableOpacity, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Circle } from 'tamagui';
import { BlurView } from 'expo-blur';

const { width: screenWidth } = Dimensions.get('window');

const NutritionCategories = ({ categories, onCategoryPress }) => {
  const defaultCategories = [
    { id: 1, name: 'Protein', emoji: '🥩' },
    { id: 2, name: 'Carbs', emoji: '🍞' },
    { id: 3, name: 'Vitamins', emoji: '🥬' },
    { id: 4, name: 'Fiber', emoji: '🥕' },
    { id: 5, name: 'Calcium', emoji: '🥛' },
    { id: 6, name: 'Healthy Fats', emoji: '🥑' },
  ];

  const nutritionCategories = categories || defaultCategories;

  // Responsive breakpoints
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 768;
  const isLargeScreen = screenWidth >= 768 && screenWidth < 1024;
  const isTablet = screenWidth >= 768;
  const isLargeTablet = screenWidth >= 1024;

  // Dynamic sizing functions with min/max constraints
  const getCircleSize = () => {
    const baseSize = screenWidth * 0.18; // Percentage-based scaling
    if (isSmallScreen) return Math.min(Math.max(baseSize, 60), 60);
    if (isMediumScreen) return Math.min(Math.max(baseSize, 70), 70);
    if (isLargeScreen) return Math.min(Math.max(baseSize, 80), 80);
    if (isLargeTablet) return Math.min(Math.max(baseSize, 90), 90);
    return 70;
  };

  const getEmojiSize = () => {
    const circleSize = getCircleSize();
    return Math.round(circleSize * 0.48); // Emoji size as percentage of circle
  };

  const getCategoryNameSize = () => {
    if (isSmallScreen) return 12;
    if (isMediumScreen) return 14;
    if (isLargeScreen) return 16;
    if (isLargeTablet) return 18;
    return 14;
  };

  const getItemSpacing = () => {
    if (isSmallScreen) return 18;
    if (isMediumScreen) return 25;
    if (isLargeScreen) return 30;
    if (isLargeTablet) return 35;
    return 25;
  };

  const getContainerMarginBottom = () => {
    if (isSmallScreen) return 24;
    if (isMediumScreen) return 30;
    if (isLargeScreen) return 36;
    if (isLargeTablet) return 42;
    return 30;
  };

  const getHorizontalPadding = () => {
    if (isSmallScreen) return 16;
    if (isMediumScreen) return 20;
    if (isLargeScreen) return 24;
    if (isLargeTablet) return 28;
    return 20;
  };

  const getContentPaddingRight = () => {
    const basePadding = getHorizontalPadding();
    return basePadding + 4;
  };

  const getCircleMarginBottom = () => {
    if (isSmallScreen) return 6;
    if (isMediumScreen) return 8;
    if (isLargeScreen) return 10;
    if (isLargeTablet) return 12;
    return 8;
  };

  const getBorderWidth = () => {
    if (isSmallScreen) return 0.8;
    if (isMediumScreen) return 1;
    if (isLargeScreen) return 1.2;
    if (isLargeTablet) return 1.5;
    return 1;
  };

  // ScrollView performance optimizations
  const getScrollViewProps = () => {
    const baseProps = {
      horizontal: true,
      showsHorizontalScrollIndicator: false,
      decelerationRate: 'fast',
      removeClippedSubviews: true,
      initialNumToRender: isSmallScreen ? 4 : isTablet ? 8 : 6,
      maxToRenderPerBatch: isSmallScreen ? 3 : 4,
      windowSize: isTablet ? 12 : 8,
    };

    // Add snap behavior for better UX on larger screens
    if (isTablet) {
      return {
        ...baseProps,
        snapToAlignment: 'start',
        pagingEnabled: false,
      };
    }

    return baseProps;
  };

  const circleSize = getCircleSize();
  const emojiSize = getEmojiSize();
  const itemSpacing = getItemSpacing();
  const circleMarginBottom = getCircleMarginBottom();

  // Create dynamic styles
  const responsiveStyles = StyleSheet.create({
    categoriesContainer: {
      marginBottom: getContainerMarginBottom(),
    },
    categoriesContent: {
      paddingLeft: getHorizontalPadding(),
      paddingRight: getContentPaddingRight(),
      // Add extra spacing on large tablets
      ...(isLargeTablet && {
        paddingLeft: getHorizontalPadding() + 8,
        paddingRight: getContentPaddingRight() + 8,
      }),
    },
    categoryItem: {
      alignItems: 'center',
      marginRight: itemSpacing,
      // Add subtle background on tablets for better definition
      ...(isTablet && {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: (circleSize + 20) / 2,
        paddingVertical: 8,
        paddingHorizontal: 8,
      }),
    },
    glassCircle: {
      backgroundColor: 'rgba(255, 255, 255, 0.43)',
      borderRadius: circleSize / 2,
      overflow: 'hidden',
      borderWidth: getBorderWidth(),
      borderColor: 'rgba(255, 255, 255, 0.35)',
      marginBottom: circleMarginBottom,
      // Enhanced shadow for larger screens
      ...(isTablet && {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
      }),
      // Subtle shadow for smaller screens
      ...(!isTablet && {
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
      }),
    },
    blurView: {
      ...StyleSheet.absoluteFillObject,
    },
    categoryEmoji: {
      fontSize: emojiSize,
      zIndex: 1,
      textAlign: 'center',
      lineHeight: emojiSize * 1.1,
      backgroundColor: 'transparent',
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
    categoryName: {
      fontSize: getCategoryNameSize(),
      color: '#333',
      fontWeight: isTablet ? '600' : '500',
      textAlign: 'center',
      lineHeight: getCategoryNameSize() * 1.2,
      // Add subtle shadow on larger screens
      ...(isTablet && {
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      }),
      // Prevent text from being too wide
      maxWidth: circleSize + 20,
      numberOfLines: 2,
    },
  });

  return (
    <ScrollView
      {...getScrollViewProps()}
      style={responsiveStyles.categoriesContainer}
      contentContainerStyle={responsiveStyles.categoriesContent}
    >
      {nutritionCategories.map((category, index) => (
        <TouchableOpacity
          key={category.id}
          style={[
            responsiveStyles.categoryItem,
            // Remove margin on last item
            index === nutritionCategories.length - 1 && { marginRight: 0 }
          ]}
          onPress={() => onCategoryPress && onCategoryPress(category)}
          activeOpacity={0.8}
        >
          <Circle
            size={circleSize}
            style={responsiveStyles.glassCircle}
            justifyContent="center"
            alignItems="center"
          >
            <BlurView
              style={responsiveStyles.blurView}
              blurType="light"
              blurAmount={isTablet ? 100 : 80}
              reducedTransparencyFallbackColor="rgba(255, 255, 255, 0.1)"
              tint="systemMaterialLight"
            />
            <Text 
              style={[
                responsiveStyles.categoryEmoji,
                {
                  backgroundColor: 'transparent',
                  includeFontPadding: false,
                }
              ]}
            >
              {category.emoji}
            </Text>
          </Circle>
          <Text style={responsiveStyles.categoryName} numberOfLines={2}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default NutritionCategories;