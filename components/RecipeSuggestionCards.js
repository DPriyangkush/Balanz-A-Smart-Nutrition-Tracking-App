import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View, ScrollView } from 'react-native';
import { Card, XStack, YStack } from 'tamagui';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Ionicons key={i} name="star" size={12} color="#FFD700" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Ionicons key={i} name="star-half" size={12} color="#FFD700" />);
      } else {
        stars.push(<Ionicons key={i} name="star-outline" size={12} color="#DDD" />);
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

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
        snapToInterval={320} // Width of card + margin
        snapToAlignment="start"
      >
        {recipesList.map((recipe, index) => (
          <Card
            key={recipe.id}
            style={[styles.recipeCard, index === recipesList.length - 1 && styles.lastCard]}
            backgroundColor="$background"
            borderRadius={20}
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.12}
            shadowRadius={12}
            elevation={6}
          >
            <TouchableOpacity 
              onPress={() => onRecipePress && onRecipePress(recipe)}
              activeOpacity={0.95}
            >
              <YStack>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                  <Image source={{ uri: recipe.imageUri }} style={styles.recipeImage} />
                  
                  {/* Overlay Badges */}
                  <View style={styles.overlayBadges}>
                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(recipe.difficulty) }]}>
                      <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
                    </View>
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Ionicons name="heart-outline" size={20} color="#FFF" />
                    </TouchableOpacity>
                  </View>

                  {/* Time Badge */}
                  <View style={styles.timeBadge}>
                    <Ionicons name="time-outline" size={14} color="#FFF" />
                    <Text style={styles.timeText}>{recipe.cookTime}</Text>
                  </View>
                </View>

                {/* Content Section */}
                <YStack style={styles.contentSection} space="$2">
                  {/* Header */}
                  <YStack space="$1">
                    <Text style={styles.recipeTitle} numberOfLines={2}>{recipe.title}</Text>
                    <Text style={styles.chefName}>by {recipe.chef}</Text>
                  </YStack>

                  {/* Description */}
                  <Text style={styles.recipeDescription} numberOfLines={3}>{recipe.description}</Text>

                  {/* Tags */}
                  <XStack style={styles.tagsContainer} space="$2">
                    {recipe.tags.slice(0, 2).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </XStack>

                  {/* Stats Row */}
                  <YStack space="$2" style={styles.statsSection}>
                    {/* Top row - Rating and Calories */}
                    <XStack justifyContent="space-between" alignItems="center">
                      {/* Rating */}
                      <XStack alignItems="center" space="$1">
                        <XStack space="$0.5">
                          {renderStars(recipe.rating)}
                        </XStack>
                        <Text style={styles.ratingText}>{recipe.rating}</Text>
                      </XStack>

                      {/* Calories */}
                      <XStack alignItems="center" space="$1">
                        <MaterialCommunityIcons name="fire" size={16} color="#E74C3C" />
                        <Text style={styles.caloriesText}>{recipe.calories}</Text>
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingRight: 40, // Extra padding for the last item
  },
  recipeCard: {
    backgroundColor: '#FFF',
    overflow: 'hidden',
    width: 350,
    marginRight: 40,
    marginLeft: -20,
    marginBottom: 20,
  },
  lastCard: {
    marginRight: 0,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayBadges: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  difficultyText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
  },
  timeBadge: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  contentSection: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D2419',
    lineHeight: 24,
  },
  chefName: {
    fontSize: 13,
    color: '#8B7355',
    fontWeight: '500',
  },
  recipeDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  tagsContainer: {
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F0F8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  tagText: {
    fontSize: 11,
    color: '#27AE60',
    fontWeight: '500',
  },
  statsSection: {
    marginTop: 4,
  },
  ratingText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  caloriesText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  servingsText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  cookButton: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cookButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default RecipeSuggestionCards;