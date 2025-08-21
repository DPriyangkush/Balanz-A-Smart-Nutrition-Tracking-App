import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { Card, XStack, YStack } from 'tamagui';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const RecipeSuggestionCards = ({ recipes, onRecipePress }) => {
  const defaultRecipes = [
    {
      id: 1,
      title: 'Mediterranean Quinoa Bowl',
      description: 'Fresh quinoa with grilled vegetables, feta cheese, and olive oil dressing',
      cookTime: '25 min',
      difficulty: 'Easy',
      calories: '420 cal',
      rating: 4.8,
      servings: 2,
      imageUri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop',
      tags: ['Vegetarian', 'High Protein', 'Gluten-Free'],
      chef: 'Chef Maria',
    },
    {
      id: 2,
      title: 'Grilled Salmon with Asparagus',
      description: 'Pan-seared salmon fillet with roasted asparagus and lemon herb butter',
      cookTime: '20 min',
      difficulty: 'Medium',
      calories: '380 cal',
      rating: 4.9,
      servings: 1,
      imageUri: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=250&fit=crop',
      tags: ['Low Carb', 'Omega-3', 'Keto'],
      chef: 'Chef Alex',
    },
    {
      id: 3,
      title: 'Avocado Toast with Poached Egg',
      description: 'Whole grain bread topped with smashed avocado, poached egg, and everything seasoning',
      cookTime: '15 min',
      difficulty: 'Easy',
      calories: '340 cal',
      rating: 4.6,
      servings: 1,
      imageUri: 'https://images.unsplash.com/photo-1571197119282-7c4ddc39b8ca?w=400&h=250&fit=crop',
      tags: ['Breakfast', 'Healthy Fats', 'Protein'],
      chef: 'Chef Sarah',
    },
  ];

  const recipesList = recipes || defaultRecipes;

  // Responsive calculations
  const isSmallScreen = screenWidth < 380;
  const isMediumScreen = screenWidth >= 380 && screenWidth < 768;
  const isLargeScreen = screenWidth >= 768;
  const isTablet = screenWidth >= 768;

  // Card dimensions based on screen size
  const getCardWidth = () => {
    if (isSmallScreen) return screenWidth * 0.85; // 85% of screen width
    if (isMediumScreen) return screenWidth * 0.8;  // 80% of screen width
    if (isLargeScreen) return Math.min(350, screenWidth * 0.6); // Max 350px or 60% of screen
    return 350;
  };

  const getImageHeight = () => {
    if (isSmallScreen) return 160;
    if (isMediumScreen) return 180;
    return 200;
  };

  const getHorizontalPadding = () => {
    if (isSmallScreen) return 16;
    if (isMediumScreen) return 20;
    return 24;
  };

  const getCardMargin = () => {
    if (isSmallScreen) return 12;
    if (isMediumScreen) return 16;
    return 20;
  };

  const getHeartSize = () => {
    if (isSmallScreen) return { container: 26, icon: 14 };
    if (isMediumScreen) return { container: 30, icon: 16 };
    return { container: 36, icon: 20 };
  };

  const cardWidth = getCardWidth();
  const imageHeight = getImageHeight();
  const horizontalPadding = getHorizontalPadding();
  const cardMargin = getCardMargin();
  const heartSize = getHeartSize();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const starSize = isSmallScreen ? 10 : 12;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Ionicons key={i} name="star" size={starSize} color="#FFD700" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Ionicons key={i} name="star-half" size={starSize} color="#FFD700" />);
      } else {
        stars.push(<Ionicons key={i} name="star-outline" size={starSize} color="#DDD" />);
      }
    }
    return stars;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '#27AE60';
      case 'medium': return '#F39C12';
      case 'hard': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  const responsiveStyles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    scrollContainer: {
      paddingHorizontal: horizontalPadding,
      paddingRight: horizontalPadding + cardMargin,
    },
    recipeCard: {
      backgroundColor: '#FFF',
      width: cardWidth,
      marginRight: cardMargin,
      marginBottom: 10,
    },
    lastCard: {
      marginRight: horizontalPadding,
    },
    imageContainer: {
      position: 'relative',
      height: imageHeight,
    },
    recipeImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    gradientOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: isSmallScreen ? 60 : 80,
    },
    overlayBadges: {
      position: 'absolute',
      top: isSmallScreen ? 10 : 15,
      left: isSmallScreen ? 10 : 15,
      right: isSmallScreen ? 10 : 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    difficultyBadge: {
      paddingHorizontal: isSmallScreen ? 8 : 12,
      paddingVertical: isSmallScreen ? 4 : 6,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    difficultyText: {
      color: '#FFF',
      fontSize: isSmallScreen ? 10 : 12,
      fontWeight: '600',
    },
    favoriteButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: heartSize.container / 2,
      width: heartSize.container,
      height: heartSize.container,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
    timeBadge: {
      position: 'absolute',
      bottom: isSmallScreen ? 15 : 25,
      right: isSmallScreen ? 10 : 15,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: isSmallScreen ? 8 : 12,
      paddingVertical: isSmallScreen ? 4 : 6,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    timeText: {
      color: '#FFF',
      fontSize: isSmallScreen ? 10 : 12,
      fontWeight: '500',
    },
    contentSection: {
      padding: isSmallScreen ? 12 : 16,
      paddingTop: isSmallScreen ? 6 : 8,
    },
    recipeTitle: {
      fontSize: isSmallScreen ? 16 : isTablet ? 20 : 18,
      fontWeight: 'bold',
      color: '#2D2419',
      lineHeight: isSmallScreen ? 20 : isTablet ? 26 : 24,
    },
    chefName: {
      fontSize: isSmallScreen ? 11 : 13,
      color: '#8B7355',
      fontWeight: '500',
    },
    recipeDescription: {
      fontSize: isSmallScreen ? 11 : 13,
      color: '#666',
      lineHeight: isSmallScreen ? 16 : 18,
    },
    tagsContainer: {
      flexWrap: 'wrap',
      gap: isSmallScreen ? 4 : 6,
    },
    tag: {
      backgroundColor: '#F0F8F0',
      paddingHorizontal: isSmallScreen ? 8 : 10,
      paddingVertical: isSmallScreen ? 3 : 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E8F5E8',
    },
    tagText: {
      fontSize: isSmallScreen ? 10 : 11,
      color: '#27AE60',
      fontWeight: '500',
    },
    statsSection: {
      marginTop: 4,
    },
    ratingText: {
      fontSize: isSmallScreen ? 11 : 13,
      color: '#333',
      fontWeight: '600',
    },
    caloriesText: {
      fontSize: isSmallScreen ? 11 : 13,
      color: '#666',
      fontWeight: '500',
    },
    favoriteIcon: {
      size: heartSize.icon,
    },
    timeIcon: {
      size: isSmallScreen ? 12 : 14,
    },
    fireIcon: {
      size: isSmallScreen ? 14 : 16,
    },
  });

  return (
    <View style={responsiveStyles.container}>
      <ScrollView 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={responsiveStyles.scrollContainer}
        decelerationRate="fast"
        snapToInterval={cardWidth + cardMargin}
        snapToAlignment="start"
        pagingEnabled={false}
        removeClippedSubviews={true}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
      >
        {recipesList.map((recipe, index) => (
          <Card
            key={recipe.id}
            style={[
              responsiveStyles.recipeCard, 
              index === recipesList.length - 1 && responsiveStyles.lastCard
            ]}
            backgroundColor="$background"
            borderRadius={isSmallScreen ? 16 : 20}
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.12}
            shadowRadius={12}
            elevation={6}
            overflow="hidden"
          >
            <TouchableOpacity 
              onPress={() => onRecipePress && onRecipePress(recipe)}
              activeOpacity={0.95}
            >
              <YStack>
                {/* Image Section with Gradient */}
                <View style={responsiveStyles.imageContainer}>
                  <Image source={{ uri: recipe.imageUri }} style={responsiveStyles.recipeImage} />
                  
                  {/* Smooth gradient overlay that fades image into content */}
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,1)']}
                    style={responsiveStyles.gradientOverlay}
                    locations={[0, 0.3, 0.8, 1]}
                  />

                  {/* Overlay Badges */}
                  <View style={responsiveStyles.overlayBadges}>
                    <View style={[responsiveStyles.difficultyBadge, { backgroundColor: getDifficultyColor(recipe.difficulty) }]}>
                      <Text style={responsiveStyles.difficultyText}>{recipe.difficulty}</Text>
                    </View>
                    <TouchableOpacity 
                      style={responsiveStyles.favoriteButton}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="heart-outline" size={responsiveStyles.favoriteIcon.size} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>

                  {/* Time Badge */}
                  <View style={responsiveStyles.timeBadge}>
                    <Ionicons name="time-outline" size={responsiveStyles.timeIcon.size} color="#FFF" />
                    <Text style={responsiveStyles.timeText}>{recipe.cookTime}</Text>
                  </View>
                </View>

                {/* Content Section */}
                <YStack style={responsiveStyles.contentSection} space={isSmallScreen ? "$1.5" : "$2"}>
                  {/* Header */}
                  <YStack space="$1">
                    <Text style={responsiveStyles.recipeTitle} numberOfLines={2}>{recipe.title}</Text>
                    <Text style={responsiveStyles.chefName}>by {recipe.chef}</Text>
                  </YStack>

                  {/* Description */}
                  <Text style={responsiveStyles.recipeDescription} numberOfLines={isSmallScreen ? 2 : 3}>
                    {recipe.description}
                  </Text>

                  {/* Tags */}
                  <XStack style={responsiveStyles.tagsContainer} space={isSmallScreen ? "$1" : "$2"}>
                    {recipe.tags.slice(0, isSmallScreen ? 1 : 2).map((tag, index) => (
                      <View key={index} style={responsiveStyles.tag}>
                        <Text style={responsiveStyles.tagText}>{tag}</Text>
                      </View>
                    ))}
                    {recipe.tags.length > (isSmallScreen ? 1 : 2) && (
                      <View style={[responsiveStyles.tag, { backgroundColor: '#F5F5F5' }]}>
                        <Text style={[responsiveStyles.tagText, { color: '#666' }]}>
                          +{recipe.tags.length - (isSmallScreen ? 1 : 2)}
                        </Text>
                      </View>
                    )}
                  </XStack>

                  {/* Stats Row */}
                  <YStack space={isSmallScreen ? "$1.5" : "$2"} style={responsiveStyles.statsSection}>
                    <XStack justifyContent="space-between" alignItems="center">
                      {/* Rating */}
                      <XStack alignItems="center" space="$1">
                        <XStack space="$0.5">
                          {renderStars(recipe.rating)}
                        </XStack>
                        <Text style={responsiveStyles.ratingText}>{recipe.rating}</Text>
                      </XStack>

                      {/* Calories */}
                      <XStack alignItems="center" space="$1">
                        <MaterialCommunityIcons 
                          name="fire" 
                          size={responsiveStyles.fireIcon.size} 
                          color="#E74C3C" 
                        />
                        <Text style={responsiveStyles.caloriesText}>{recipe.calories}</Text>
                      </XStack>
                    </XStack>
                  </YStack>
                </YStack>
              </YStack>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

export default RecipeSuggestionCards;