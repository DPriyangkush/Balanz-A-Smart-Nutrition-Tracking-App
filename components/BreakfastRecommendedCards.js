// FoodCardsGrid.js - Grid layout for food cards with image, name, kcal, and recommended tag
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const FoodCardsGrid = ({ onItemPress }) => {
  const defaultFoodItems = [
    {
      id: 1,
      name: 'Flavorful Fried Rice Fiesta',
      kcal: '420 kcal',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop',
      recommended: true,
      category: 'Rice Dish'
    },
    {
      id: 2,
      name: 'Flavorful Fried Noodles',
      kcal: '385 kcal',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
      recommended: false,
      category: 'Noodles'
    },
    {
      id: 3,
      name: 'Healthy Buddha Bowl',
      kcal: '280 kcal',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
      recommended: true,
      category: 'Healthy'
    },
    {
      id: 4,
      name: 'Protein Packed Salad',
      kcal: '320 kcal',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
      recommended: false,
      category: 'Salad'
    },
    {
      id: 5,
      name: 'Spicy Taco Bowl',
      kcal: '450 kcal',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      recommended: true,
      category: 'Mexican'
    },
    {
      id: 6,
      name: 'Mediterranean Wrap',
      kcal: '365 kcal',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
      recommended: false,
      category: 'Mediterranean'
    }
  ];

  const foodItems = defaultFoodItems;

  // Responsive breakpoints
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 768;
  const isLargeScreen = screenWidth >= 768 && screenWidth < 1024;
  const isTablet = screenWidth >= 768;
  const isLargeTablet = screenWidth >= 1024;

  // Get screen dimensions and calculate responsive dimensions
  const containerPadding = 10;
  const gridGap = isSmallScreen ? 12 : isMediumScreen ? 10 : isTablet ? 18 : 15;
  const availableWidth = screenWidth - (containerPadding * 3);
  const cardWidth = (availableWidth - gridGap) / 2;

  // Dynamic sizing functions
  const getCardHeight = () => {
    // Maintain aspect ratio but adjust for content
    const baseHeight = cardWidth * 1.4; // Taller to accommodate image + content
    if (isSmallScreen) return Math.min(Math.max(baseHeight, 280), 320);
    if (isMediumScreen) return Math.min(Math.max(baseHeight, 300), 340);
    if (isLargeScreen) return Math.min(Math.max(baseHeight, 320), 380);
    if (isLargeTablet) return Math.min(Math.max(baseHeight, 340), 400);
    return 300;
  };

  const getImageHeight = () => {
    const cardHeight = getCardHeight();
    return cardHeight * 0.5; // Image takes 50% of card height
  };

  const getTitleFontSize = () => {
    if (isSmallScreen) return 14;
    if (isMediumScreen) return 15;
    if (isLargeScreen) return 16;
    if (isLargeTablet) return 17;
    return 15;
  };

  const getKcalFontSize = () => {
    if (isSmallScreen) return 13;
    if (isMediumScreen) return 14;
    if (isLargeScreen) return 15;
    if (isLargeTablet) return 16;
    return 14;
  };

  const getTagFontSize = () => {
    if (isSmallScreen) return 10;
    if (isMediumScreen) return 11;
    if (isLargeScreen) return 12;
    if (isLargeTablet) return 13;
    return 11;
  };

  const getContentPadding = () => {
    if (isSmallScreen) return 12;
    if (isMediumScreen) return 14;
    if (isLargeScreen) return 16;
    if (isLargeTablet) return 18;
    return 14;
  };

  const cardHeight = getCardHeight();
  const imageHeight = getImageHeight();

  // Create dynamic styles
  const responsiveStyles = StyleSheet.create({
    container: {
      marginHorizontal: -20, // Negative margin to counteract parent padding
      paddingHorizontal: 25, // Add back the padding for content
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: isTablet ? 22 : 18,
      fontWeight: 'thin',
      color: '#2D2419',
      paddingHorizontal: 10,
      textAlign: "center"
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: gridGap,
    },
    foodCardItem: {
      width: cardWidth,
      marginBottom: gridGap,
    },
    foodCard: {
      width: '100%',
      height: cardHeight,
      backgroundColor: 'white',
      borderRadius: 16,
      overflow: 'hidden',
      // Enhanced shadow for tablets
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
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: imageHeight,
    },
    cardImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    recommendedTag: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: '#FF6B6B',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    recommendedText: {
      fontSize: getTagFontSize(),
      color: 'white',
      fontWeight: '600',
      marginLeft: 2,
    },
    cardContent: {
      flex: 1,
      padding: getContentPadding(),
      justifyContent: 'space-between',
    },
    cardTitle: {
      fontSize: getTitleFontSize(),
      fontWeight: isTablet ? '600' : 'bold',
      color: '#333',
      marginBottom: 8,
      lineHeight: getTitleFontSize() * 1.3,
      numberOfLines: 2,
      // Add subtle shadow on larger screens
      ...(isTablet && {
        textShadowColor: 'rgba(0, 0, 0, 0.05)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
      }),
    },
    kcalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(139, 69, 19, 0.1)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'center',
      minWidth: '80%',
    },
    kcalText: {
      fontSize: getKcalFontSize(),
      color: '#8B4513',
      fontWeight: '600',
      marginLeft: 4,
    },
    sectionTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 40,
      marginTop: 10,
      marginHorizontal: 10,
    },
    sectionTitleLine: {
      flex: 1,
      height: 1,
      backgroundColor: "#1e1e1e",
      opacity: 0.5
    }
    
  });

  return (
    <View style={responsiveStyles.container}>
      {/* Section Heading with Lines */}
      <View style={responsiveStyles.sectionTitleContainer}>
        <View style={responsiveStyles.sectionTitleLine} />
        <Text style={responsiveStyles.sectionTitle}>Recommended for You</Text>
        <View style={responsiveStyles.sectionTitleLine} />
      </View>
      
      {/* Grid Container */}
      <View style={responsiveStyles.gridContainer}>
        {foodItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={responsiveStyles.foodCardItem}
            onPress={() => onItemPress && onItemPress(item)}
            activeOpacity={0.8}
          >
            <View style={responsiveStyles.foodCard}>
              {/* Image Container with Recommended Tag */}
              <View style={responsiveStyles.imageContainer}>
                <Image source={{ uri: item.image }} style={responsiveStyles.cardImage} />
                
                {/* Recommended Tag */}
                {item.recommended && (
                  <View style={responsiveStyles.recommendedTag}>
                    <Ionicons name="star" size={12} color="white" />
                    <Text style={responsiveStyles.recommendedText}>Recommended</Text>
                  </View>
                )}
              </View>
              
              {/* Card Content */}
              <View style={responsiveStyles.cardContent}>
                <Text style={responsiveStyles.cardTitle} numberOfLines={2}>
                  {item.name}
                </Text>
                
                {/* Kcal Container */}
                <View style={responsiveStyles.kcalContainer}>
                  <Ionicons name="flash-outline" size={16} color="#8B4513" />
                  <Text style={responsiveStyles.kcalText}>{item.kcal}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default FoodCardsGrid;