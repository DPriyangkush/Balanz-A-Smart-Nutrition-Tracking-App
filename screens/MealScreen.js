import React, { useState, useRef } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  View, 
  Dimensions,
  Animated
} from 'react-native';
import { YStack } from 'tamagui';
import { MealWrapper } from '../components/ScreenWrappers';
import { LinearGradient } from 'expo-linear-gradient';

// Import custom components
import GreetingSection from '../components/GreetingSection';
import MealSearchInput from '../components/MealSearchInput';
import NutritionCategories from '../components/NutritionCategories';
import MealSectionHeader from '../components/MealSectionHeader';
import MealCardsList from '../components/MealCardsList';
import RecipeSuggestionCards from 'components/RecipeSuggestionCards';
import MealCategoryGrid from '../components/MealCategoryGrid';
import RandomQuoteCard from 'Cards/RandomQuoteCard';
import RecipeDetailModal from '../components/RecipeDetailsModal';

const MealScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const searchInputAnimation = useRef(new Animated.Value(1)).current;
  const contentAnimation = useRef(new Animated.Value(1)).current;
  
  // Get screen dimensions for responsive design
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Responsive calculations
  const isTablet = screenWidth >= 768;
  const isLargeScreen = screenWidth >= 1024;
  
  // Dynamic padding and spacing
  const horizontalPadding = Math.min(Math.max(screenWidth * 0.04, 16), 24);
  const sectionSpacing = Math.min(Math.max(screenWidth * 0.03, 16), 24);
  const gradientWidth = Math.min(Math.max(screenWidth * 0.08, 30), 60);

  // Sample data
  const nutritionCategories = [
    { id: 1, name: 'Protein', emoji: '🥩' },
    { id: 2, name: 'Carbs', emoji: '🍞' },
    { id: 3, name: 'Vitamins', emoji: '🥬' },
    { id: 4, name: 'Fiber', emoji: '🥕' },
    { id: 5, name: 'Calcium', emoji: '🥛' },
    { id: 6, name: 'Healthy Fats', emoji: '🥑' },
  ];

  const mealPlans = [
    {
      id: 1,
      mealName: 'High Protein Bowl',
      calories: '450 - 650 cal',
      prepTime: '15-20 Min',
      imageUri: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop',
      rating: 4.8,
      difficulty: 'Easy',
    },
    {
      id: 2,
      mealName: 'Mediterranean Feast',
      calories: '380 - 580 cal',
      prepTime: '10-15 Min',
      imageUri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=150&fit=crop',
      rating: 4.6,
      difficulty: 'Medium',
    },
    {
      id: 3,
      mealName: 'Green Power Salad',
      calories: '320 - 450 cal',
      prepTime: '5-10 Min',
      imageUri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop',
      rating: 4.9,
      difficulty: 'Easy',
    },
  ];

  // Handle search navigation with animation
  const handleSearchNavigation = (query = searchQuery) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Start animation - slide search input up and fade content more aggressively
    Animated.parallel([
      Animated.timing(searchInputAnimation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnimation, {
        toValue: 0,
        duration: 300, // Even faster fade to eliminate shadow artifacts
        delay: 30,     // Minimal delay
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate to search screen with the query
      navigation.navigate('MealSearchScreen', {
        initialSearchQuery: query.trim(),
        animationDuration: 500,
      });
      
      // Reset animations for when user comes back
      setTimeout(() => {
        searchInputAnimation.setValue(1);
        contentAnimation.setValue(1);
        setIsAnimating(false);
      }, 100);
    });
  };

  // Handle search input submission
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      handleSearchNavigation(searchQuery);
    }
  };

  // Handle search text change
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    
    // If user types and presses enter quickly, trigger search
    if (text.endsWith('\n')) {
      handleSearchNavigation(text.trim());
    }
  };

  // Modal handlers
  const handleRecipePress = (recipe) => {
    console.log('Recipe pressed:', recipe);
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const handleMealPress = (meal) => {
    console.log('Meal pressed:', meal);
    // Transform meal data to recipe format for consistency
    const recipeData = {
      id: meal.id,
      title: meal.mealName,
      imageUri: meal.imageUri,
      calories: meal.calories,
      cookTime: meal.prepTime,
      prepTime: meal.prepTime,
      rating: meal.rating,
      difficulty: meal.difficulty || 'Medium',
      chef: 'Chef Nutrition',
    };
    setSelectedRecipe(recipeData);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

  // Dynamic styles based on screen size
  const responsiveStyles = StyleSheet.create({
    content: {
      flex: 1,
      paddingHorizontal: horizontalPadding,
      paddingTop: isTablet ? 20 : 10,
      maxWidth: isLargeScreen ? 1200 : '100%',
      alignSelf: 'center',
      transform: [{
        translateY: contentAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0], // Even more aggressive slide
        })
      }],
      opacity: contentAnimation.interpolate({
        inputRange: [0, 0, 1], // Fade out almost immediately
        outputRange: [0, 0.9, 1],   // Stay at 0 opacity until 15%, then jump to 1
      }),
    },
    searchContainer: {
      transform: [{
        translateY: searchInputAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [-screenHeight * 0.4, 0],
        })
      }],
      opacity: searchInputAnimation.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [0, 0.3, 1], // Fade in more gradually
      }),
    },
    mealPlanSection: {
      marginBottom: sectionSpacing * 0.5,
    },
    nutritionTrackingSection: {
      marginBottom: sectionSpacing,
    },
    spacer: {
      height: Math.min(Math.max(screenHeight * 0.08, 60), 120),
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: gradientWidth,
      zIndex: 2,
    },
    foggyWrapper: {
      position: 'relative',
      marginHorizontal: isTablet ? 0 : -horizontalPadding * 0.5,
    },
  });

  return (
    <MealWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <Animated.View style={responsiveStyles.content}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Greeting Section */}
            <GreetingSection
              userName="Priyangkush"
              mealCount={369}
            />

            {/* Animated Search Input */}
            <Animated.View style={responsiveStyles.searchContainer}>
              <MealSearchInput
                placeholder="Find your healthy meal..."
                value={searchQuery}
                onChangeText={handleSearchChange}
                onSubmitEditing={handleSearchSubmit}
              />
            </Animated.View>

            {/* Nutrition Categories with Responsive Wrapper */}
            <View style={responsiveStyles.foggyWrapper}>
              <NutritionCategories
                categories={nutritionCategories}
                onCategoryPress={(category) => console.log('Category pressed:', category.name)}
              />

              {/* Left gradient - smooth fade */}
              <LinearGradient
                colors={[
                  '#FFF8E8',
                  'rgba(255,248,232,0.8)',
                  'rgba(255,248,232,0.4)',
                  'transparent'
                ]}
                locations={[0, 0.3, 0.7, 1]}
                style={[responsiveStyles.gradientOverlay, styles.leftGradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                pointerEvents="none"
              />

              {/* Right gradient - smooth fade */}
              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(255,248,232,0.4)',
                  'rgba(255,248,232,0.8)',
                  '#FFF8E8'
                ]}
                locations={[0, 0.3, 0.7, 1]}
                style={[responsiveStyles.gradientOverlay, styles.rightGradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                pointerEvents="none"
              />
            </View>

            {/* Meal Plan Section */}
            <YStack style={responsiveStyles.mealPlanSection} space="$3">
              <MealSectionHeader
                title="Balanced Nutrition Plan"
                badgeText="Recommended"
                badgeIcon="🔥"
                onArrowPress={() => console.log('Section arrow pressed')}
              />

              {/* Foggy fade effect wrapper */}
              <View style={responsiveStyles.foggyWrapper}>
                <MealCardsList
                  meals={mealPlans}
                  onMealPress={handleMealPress}
                />

                {/* Left gradient - smooth fade */}
                <LinearGradient
                  colors={[
                    '#FFF8E8',
                    'rgba(255,248,232,0.8)',
                    'rgba(255,248,232,0.4)',
                    'transparent'
                  ]}
                  locations={[0, 0.3, 0.7, 1]}
                  style={[responsiveStyles.gradientOverlay, styles.leftGradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  pointerEvents="none"
                />

                {/* Right gradient - smooth fade */}
                <LinearGradient
                  colors={[
                    'transparent',
                    'rgba(255,248,232,0.4)',
                    'rgba(255,248,232,0.8)',
                    '#FFF8E8'
                  ]}
                  locations={[0, 0.3, 0.7, 1]}
                  style={[responsiveStyles.gradientOverlay, styles.rightGradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  pointerEvents="none"
                />
              </View>
            </YStack>

            {/* Meal Category Grid */}
            <View style={styles.categoryGridContainer}>
              <MealCategoryGrid onCategoryPress={(c) => console.log('Meal category pressed:', c.title)} />
            </View>

            {/* Recipe Suggestions Section */}
            <YStack style={responsiveStyles.nutritionTrackingSection}>
              <MealSectionHeader
                title="Recipe Suggestions"
                showBadge={false}
                onArrowPress={() => console.log('Recipe suggestions section pressed')}
              />
              <View style={responsiveStyles.foggyWrapper}>
                <RecipeSuggestionCards onRecipePress={handleRecipePress} />
                
                {/* Left gradient - smooth fade */}
                <LinearGradient
                  colors={[
                    '#FFF8E8',
                    'rgba(255,248,232,0.8)',
                    'rgba(255,248,232,0.4)',
                    'transparent'
                  ]}
                  locations={[0, 0.3, 0.7, 1]}
                  style={[responsiveStyles.gradientOverlay, styles.leftGradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  pointerEvents="none"
                />

                {/* Right gradient - smooth fade */}
                <LinearGradient
                  colors={[
                    'transparent',
                    'rgba(255,248,232,0.4)',
                    'rgba(255,248,232,0.8)',
                    '#FFF8E8'
                  ]}
                  locations={[0, 0.3, 0.7, 1]}
                  style={[responsiveStyles.gradientOverlay, styles.rightGradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  pointerEvents="none"
                />
              </View>
            </YStack>

            {/* Random Quote Card */}
            <View style={styles.quoteContainer}>
              <RandomQuoteCard />
            </View>

            {/* Bottom Spacer */}
            <YStack style={responsiveStyles.spacer} />
          </ScrollView>
        </Animated.View>

        {/* Recipe Detail Modal */}
        <RecipeDetailModal
          visible={modalVisible}
          recipe={selectedRecipe}
          onClose={closeModal}
        />
      </SafeAreaView>
    </MealWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E8',
  },
  scrollContent: {
    flexGrow: 1,
  },
  leftGradient: {
    left: 0,
  },
  rightGradient: {
    right: 0,
  },
  categoryGridContainer: {
    alignItems: 'center',
    width: '100%',
  },
  quoteContainer: {
    alignItems: 'center',
    width: '100%',
  },
});

export default MealScreen;