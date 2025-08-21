import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View, Dimensions } from 'react-native';
import { Card, XStack, YStack } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const MealCard = ({
  mealName,
  calories,
  prepTime,
  imageUri,
  onPress,
  rating,
  // Responsive props from MealCardsList
  isSmallScreen,
  isMediumScreen,
  isTablet,
  isLargeTablet,
  index,
  isFirst,
  isLast,
}) => {
  // Determine screen size if props not provided
  const smallScreen = isSmallScreen ?? screenWidth < 375;
  const mediumScreen = isMediumScreen ?? (screenWidth >= 375 && screenWidth < 768);
  const tablet = isTablet ?? screenWidth >= 768;
  const largeTablet = isLargeTablet ?? screenWidth >= 1024;

  // Dynamic card width calculation
  const getCardWidth = () => {
    if (smallScreen) return Math.min(screenWidth * 0.7, 140);
    if (mediumScreen) return Math.min(screenWidth * 0.65, 200);
    if (tablet) return Math.min(screenWidth * 0.35, 200);
    if (largeTablet) return Math.min(screenWidth * 0.25, 220);
    return 160;
  };

  // Dynamic image height
  const getImageHeight = () => {
    if (smallScreen) return 100;
    if (mediumScreen) return 120;
    if (tablet) return 140;
    if (largeTablet) return 160;
    return 120;
  };

  // Dynamic spacing and sizing
  const getCardPadding = () => {
    if (smallScreen) return 10;
    if (mediumScreen) return 12;
    if (tablet) return 16;
    if (largeTablet) return 20;
    return 12;
  };

  const getTitleFontSize = () => {
    if (smallScreen) return 12;
    if (mediumScreen) return 14;
    if (tablet) return 16;
    if (largeTablet) return 18;
    return 14;
  };

  const getCaloriesFontSize = () => {
    if (smallScreen) return 11;
    if (mediumScreen) return 12;
    if (tablet) return 14;
    if (largeTablet) return 15;
    return 12;
  };

  const getTimeFontSize = () => {
    if (smallScreen) return 10;
    if (mediumScreen) return 12;
    if (tablet) return 13;
    if (largeTablet) return 14;
    return 12;
  };

  const getBorderRadius = () => {
    if (smallScreen) return 16;
    if (mediumScreen) return 20;
    if (tablet) return 24;
    if (largeTablet) return 28;
    return 20;
  };

  const getHeartSize = () => {
    if (smallScreen) return { container: 26, icon: 14 };
    if (mediumScreen) return { container: 30, icon: 16 };
    if (tablet) return { container: 36, icon: 20 };
    if (largeTablet) return { container: 40, icon: 22 };
    return { container: 30, icon: 16 };
  };

  const getGradientHeight = () => {
    if (smallScreen) return 40;
    if (mediumScreen) return 50;
    if (tablet) return 60;
    if (largeTablet) return 70;
    return 50;
  };

  const getMargins = () => {
    const marginRight = smallScreen ? 12 : mediumScreen ? 15 : tablet ? 20 : 24;
    const marginBottom = smallScreen ? 16 : mediumScreen ? 20 : tablet ? 24 : 28;
    const marginTop = smallScreen ? 6 : 8;
    
    return { marginRight, marginBottom, marginTop };
  };

  // Calculate all dynamic values
  const cardWidth = getCardWidth();
  const imageHeight = getImageHeight();
  const cardPadding = getCardPadding();
  const heartSize = getHeartSize();
  const gradientHeight = getGradientHeight();
  const margins = getMargins();

  // Create dynamic styles
  const responsiveStyles = StyleSheet.create({
    mealCard: {
      backgroundColor: '#FFF',
      width: cardWidth,
      marginTop: margins.marginTop,
      marginBottom: margins.marginBottom,
      marginRight: isLast ? 0 : margins.marginRight,
      // Add subtle shadow scaling with screen size
      shadowColor: '#000',
      shadowOffset: { 
        width: 0, 
        height: smallScreen ? 2 : mediumScreen ? 3 : 4 
      },
      shadowOpacity: smallScreen ? 0.08 : 0.12,
      shadowRadius: smallScreen ? 4 : mediumScreen ? 6 : 8,
      elevation: smallScreen ? 3 : mediumScreen ? 4 : 6,
    },
    imageWrapper: {
      position: 'relative',
      width: '100%',
      height: imageHeight,
    },
    mealImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    gradientOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: gradientHeight,
    },
    heartContainer: {
      position: 'absolute',
      top: smallScreen ? 8 : mediumScreen ? 10 : 12,
      right: smallScreen ? 8 : mediumScreen ? 10 : 12,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: heartSize.container / 2,
      width: heartSize.container,
      height: heartSize.container,
      justifyContent: 'center',
      alignItems: 'center',
      // Add subtle shadow for heart button
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
    cardInfo: {
      padding: cardPadding,
      paddingTop: cardPadding * 0.8, // Slightly less top padding due to gradient
    },
    mealName: {
      fontSize: getTitleFontSize(),
      fontWeight: 'bold',
      color: '#333',
      lineHeight: getTitleFontSize() * 1.3,
      marginBottom: 4,
    },
    caloriesText: {
      fontSize: getCaloriesFontSize(),
      color: '#666',
      marginBottom: 6,
      fontWeight: '500',
    },
    ratingTimeContainer: {
      marginTop: 2,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tablet ? 'rgba(0,0,0,0.05)' : 'transparent',
      paddingHorizontal: tablet ? 8 : 4,
      paddingVertical: tablet ? 4 : 2,
      borderRadius: tablet ? 8 : 4,
    },
    timeText: {
      fontSize: getTimeFontSize(),
      color: '#666',
      fontWeight: '500',
      marginLeft: 4,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: getTimeFontSize(),
      color: '#333',
      fontWeight: '600',
      marginLeft: 2,
    },
  });

  return (
    <Card
      style={responsiveStyles.mealCard}
      borderRadius={getBorderRadius()}
      overflow="hidden"
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <YStack>
          {/* Image with gradient fade */}
          <View style={responsiveStyles.imageWrapper}>
            <Image source={{ uri: imageUri }} style={responsiveStyles.mealImage} />
            
            {/* Gradient that fades image into info */}
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)']}
              style={responsiveStyles.gradientOverlay}
              locations={[0, 0.7, 1]}
            />
            
            {/* Heart button with icon */}
            <TouchableOpacity 
              style={responsiveStyles.heartContainer}
              activeOpacity={0.7}
            >
              <Ionicons
                name="heart-outline"
                size={heartSize.icon}
                color="#FF6B6B"
              />
            </TouchableOpacity>
          </View>
          
          {/* Info section */}
          <YStack style={responsiveStyles.cardInfo}>
            <Text style={responsiveStyles.mealName} numberOfLines={2}>
              {mealName}
            </Text>
            <Text style={responsiveStyles.caloriesText} numberOfLines={1}>
              {calories}
            </Text>
            
            <XStack style={responsiveStyles.ratingTimeContainer}>
              {/* Rating (if provided) */}
              {rating && (
                <XStack style={responsiveStyles.ratingContainer}>
                  <Ionicons
                    name="star"
                    size={getTimeFontSize()}
                    color="#FFD700"
                  />
                  <Text style={responsiveStyles.ratingText}>{rating}</Text>
                </XStack>
              )}
              
              {/* Time with icon */}
              <XStack style={responsiveStyles.timeContainer}>
                <Ionicons
                  name="time-outline"
                  size={getTimeFontSize()}
                  color="#666"
                />
                <Text style={responsiveStyles.timeText}>{prepTime}</Text>
              </XStack>
            </XStack>
          </YStack>
        </YStack>
      </TouchableOpacity>
    </Card>
  );
};

export default MealCard;