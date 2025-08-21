import React from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
import MealCard from './MealCard';

const { width: screenWidth } = Dimensions.get('window');

const MealCardsList = ({ meals, onMealPress }) => {
  const defaultMeals = [
    {
      id: 1,
      mealName: 'High Protein Bowl',
      calories: '450 - 650 cal',
      prepTime: '15-20 Min',
      imageUri: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop',
      rating: 4.8,
    },
    {
      id: 2,
      mealName: 'Mediterranean Feast',
      calories: '380 - 580 cal',
      prepTime: '10-15 Min',
      imageUri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=150&fit=crop',
      rating: 4.6,
    },
    {
      id: 3,
      mealName: 'Green Power Salad',
      calories: '320 - 450 cal',
      prepTime: '5-10 Min',
      imageUri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop',
      rating: 4.9,
    },
    {
      id: 4,
      mealName: 'Grilled Salmon',
      calories: '400 - 550 cal',
      prepTime: '20-25 Min',
      imageUri: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=150&fit=crop',
      rating: 4.7,
    },
  ];

  const mealsList = meals || defaultMeals;

  // Responsive breakpoints
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 768;
  const isLargeScreen = screenWidth >= 768 && screenWidth < 1024;
  const isTablet = screenWidth >= 768;
  const isLargeTablet = screenWidth >= 1024;

  // Dynamic spacing and sizing functions
  const getContainerMarginBottom = () => {
    if (isSmallScreen) return 8;
    if (isMediumScreen) return 0;
    if (isLargeScreen) return 15;
    if (isLargeTablet) return 20;
    return 10;
  };

  const getHorizontalPadding = () => {
    if (isSmallScreen) return 12;
    if (isMediumScreen) return 16;
    if (isLargeScreen) return 20;
    if (isLargeTablet) return 24;
    return 16;
  };

  const getContentPaddingRight = () => {
    const basePadding = getHorizontalPadding();
    return basePadding + 4; // Slightly more padding on the right
  };

  const getContentPaddingLeft = () => {
    return getHorizontalPadding();
  };

  // ScrollView performance optimizations
  const getScrollViewProps = () => {
    const baseProps = {
      horizontal: true,
      showsHorizontalScrollIndicator: false,
      decelerationRate: 'fast',
      removeClippedSubviews: true,
      initialNumToRender: isSmallScreen ? 2 : isTablet ? 4 : 3,
      maxToRenderPerBatch: isSmallScreen ? 2 : 3,
      windowSize: isTablet ? 10 : 5,
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

  // Create dynamic styles
  const responsiveStyles = StyleSheet.create({
    mealCardsContainer: {
      marginBottom: getContainerMarginBottom(),
      
      // Add subtle background on larger screens
      ...(isTablet && {
        backgroundColor: 'transparent',
        
      }),
    },
    mealCardsContent: {
      paddingLeft: getContentPaddingLeft(),
      paddingRight: getContentPaddingRight(),
      // Add extra padding on large tablets
      ...(isLargeTablet && {
        paddingLeft: getContentPaddingLeft() + 8,
        paddingRight: getContentPaddingRight() + 8,
      }),
      // Ensure proper spacing between cards
      gap: isSmallScreen ? 12 : isMediumScreen ? 10 : 20,
    },
  });

  return (
    <ScrollView
      {...getScrollViewProps()}
      style={responsiveStyles.mealCardsContainer}
      contentContainerStyle={responsiveStyles.mealCardsContent}
    >
      {mealsList.map((meal, index) => (
        <MealCard
          key={meal.id}
          mealName={meal.mealName}
          calories={meal.calories}
          prepTime={meal.prepTime}
          rating={meal.rating}
          imageUri={meal.imageUri}
          onPress={() => onMealPress && onMealPress(meal)}
          // Pass responsive props to MealCard
          isSmallScreen={isSmallScreen}
          isMediumScreen={isMediumScreen}
          isTablet={isTablet}
          isLargeTablet={isLargeTablet}
          // Pass index for potential styling variations
          index={index}
          isFirst={index === 0}
          isLast={index === mealsList.length - 1}
        />
      ))}
    </ScrollView>
  );
};

export default MealCardsList;