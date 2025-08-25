import React, { useState, useRef, useEffect } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  View, 
  Dimensions,
  Animated,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
  Keyboard
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
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // Enhanced animation references with better initial values
  const greetingAnimation = useRef(new Animated.Value(1)).current;
  const searchContainerAnimation = useRef(new Animated.Value(0)).current; // For search container positioning
  const contentAnimation = useRef(new Animated.Value(1)).current;
  const searchResultsAnimation = useRef(new Animated.Value(0)).current;
  const backgroundAnimation = useRef(new Animated.Value(0)).current; // For background transition
  
  // Ref to measure greeting section height
  const greetingRef = useRef(null);
  const [greetingHeight, setGreetingHeight] = useState(0);

  // Measure the height of the GreetingSection component
  const onGreetingLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && greetingHeight === 0) {
      setGreetingHeight(height);
    }
  };

  // Initialize back handler for Android
  useEffect(() => {
    const backAction = () => {
      if (isSearchMode) {
        exitSearchMode();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isSearchMode]);

  // Navigation focus effect
  useEffect(() => {
    const unsubscribe = navigation?.addListener?.('focus', () => {
      if (isSearchMode) {
        resetToMainScreen();
      }
    });

    return unsubscribe;
  }, [navigation, isSearchMode]);

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Responsive calculations
  const isTablet = screenWidth >= 768;
  const isLargeScreen = screenWidth >= 1024;
  
  // Dynamic padding and spacing
  const horizontalPadding = Math.min(Math.max(screenWidth * 0.04, 16), 24);
  const sectionSpacing = Math.min(Math.max(screenWidth * 0.03, 16), 24);
  const gradientWidth = Math.min(Math.max(screenWidth * 0.08, 30), 60);

  // Sample data (keeping your existing data)
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

  const sampleSearchResults = [
    {
      id: 1,
      mealName: 'Grilled Chicken Salad',
      calories: '350 cal',
      prepTime: '15 min',
      imageUri: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=150&fit=crop',
      rating: 4.7,
      tags: ['protein', 'low-carb', 'healthy']
    },
    {
      id: 2,
      mealName: 'Quinoa Buddha Bowl',
      calories: '420 cal',
      prepTime: '20 min',
      imageUri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop',
      rating: 4.8,
      tags: ['vegan', 'protein', 'fiber']
    },
    {
      id: 3,
      mealName: 'Salmon Teriyaki',
      calories: '480 cal',
      prepTime: '25 min',
      imageUri: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&h=150&fit=crop',
      rating: 4.6,
      tags: ['omega-3', 'protein', 'japanese']
    },
  ];

  // Enhanced search functionality
  const performSearch = async (query) => {
    if (!query.trim()) {
      exitSearchMode();
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      const filteredResults = sampleSearchResults.filter(meal =>
        meal.mealName.toLowerCase().includes(query.toLowerCase()) ||
        meal.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 600);
  };

  // Enhanced enter search mode with smooth animations
  const enterSearchMode = () => {
    setIsSearchMode(true);
    
    // Create a smooth, coordinated animation sequence
    Animated.parallel([
      // Fade out greeting section quickly
      Animated.timing(greetingAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      // Move search container up smoothly to top
      Animated.timing(searchContainerAnimation, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true, // Back to native driver for transform only
      }),
      // Fade out main content with slight delay
      Animated.timing(contentAnimation, {
        toValue: 0,
        duration: 350,
        delay: 50,
        useNativeDriver: true,
      }),
      // Background transition for better visual feedback
      Animated.timing(backgroundAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // After animations complete, fade in search results
      Animated.timing(searchResultsAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Enhanced exit search mode with smooth reverse animations
  const exitSearchMode = () => {
    Keyboard.dismiss();
    // First, fade out search results
    Animated.timing(searchResultsAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Then animate everything back to normal state
      Animated.parallel([
        // Move search container back down from top
        Animated.timing(searchContainerAnimation, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true, // Back to native driver for transform only
        }),
        // Fade in main content
        Animated.timing(contentAnimation, {
          toValue: 1,
          duration: 400,
          delay: 100,
          useNativeDriver: true,
        }),
        // Fade in greeting section
        Animated.timing(greetingAnimation, {
          toValue: 1,
          duration: 350,
          delay: 150,
          useNativeDriver: true,
        }),
        // Reset background
        Animated.timing(backgroundAnimation, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start(() => {
        // Clean up state after animations complete
        setIsSearchMode(false);
        setSearchResults([]);
        setSearchQuery('');
      });
    });
  };

  // Reset to main screen without animation (for navigation focus)
  const resetToMainScreen = () => {
    setIsSearchMode(false);
    setSearchQuery('');
    setSearchResults([]);
    
    // Reset all animations instantly
    greetingAnimation.setValue(1);
    searchContainerAnimation.setValue(0);
    contentAnimation.setValue(1);
    searchResultsAnimation.setValue(0);
    backgroundAnimation.setValue(0);
  };

  // Handle search input submission
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      if (!isSearchMode) {
        enterSearchMode();
      }
      performSearch(searchQuery);
    }
  };

  // Handle search text change with improved logic
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    
    // If user clears the search completely, exit search mode
    if (!text.trim() && isSearchMode) {
      exitSearchMode();
    }
  };

  // Handle back press in search mode
  const handleSearchBack = () => {
    exitSearchMode();
  };

  // Modal handlers (keeping your existing logic)
  const handleRecipePress = (recipe) => {
    console.log('Recipe pressed:', recipe);
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const handleMealPress = (meal) => {
    console.log('Meal pressed:', meal);
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

  // Search result renderers (keeping your existing implementations)
  const renderSearchResult = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultCard}
      onPress={() => handleMealPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.resultImageContainer}>
        <View style={[styles.resultImagePlaceholder, { backgroundColor: '#E8F4FD' }]} />
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.mealName}</Text>
        <Text style={styles.resultMeta}>{item.calories} • {item.prepTime}</Text>
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 2).map((tag, tagIndex) => (
            <View key={tagIndex} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSearchEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>🔍</Text>
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'No meals found' : 'Start searching for meals'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery 
          ? 'Try different keywords or browse our categories' 
          : 'Type in the search box above to find delicious meals'
        }
      </Text>
    </View>
  );

  const renderSearchLoadingState = () => (
    <View style={styles.loadingSpinnerContainer}>
      <ActivityIndicator 
        size="large" 
        color="#FF6B35" 
        style={styles.loadingSpinner}
      />
      <Text style={styles.loadingText}>Searching for meals...</Text>
    </View>
  );

  // Enhanced dynamic styles with smooth animations
  const responsiveStyles = StyleSheet.create({
    content: {
      flex: 1,
      paddingHorizontal: horizontalPadding,
      paddingTop: isTablet ? 20 : 10,
      maxWidth: isLargeScreen ? 1200 : '100%',
      alignSelf: 'center',
    },
    // Enhanced search container with smooth positioning to top
    searchContainer: {
      paddingTop: 5,
      paddingBottom: 5,
      transform: [{
        translateY: searchContainerAnimation.interpolate({
          inputRange: [0, 1],
          // Dynamically calculate the vertical movement based on greetingHeight
          outputRange: [0, -greetingHeight], 
          
        })
      }],
      zIndex: 20, // Increased zIndex to ensure it stays on top of everything
    },
    // Enhanced greeting section animation
    greetingSection: {
      opacity: greetingAnimation,
      transform: [{
        translateY: greetingAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [-10, 0],
        })
      }, {
        scale: greetingAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        })
      }],
    },
    // Enhanced main content animation
    mainContent: {
      flex: 1,
      transform: [{
        translateY: contentAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0],
        })
      }, {
        scale: contentAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.98, 1],
        })
      }],
      opacity: contentAnimation,
    },
    // Enhanced search results animation with proper positioning
    searchResults: {
      position: 'absolute',
      // Offset the search results to start just below the search bar
      top: 100, 
      left: horizontalPadding,
      right: horizontalPadding,
      bottom: 0,
      transform: [{
        translateY: searchResultsAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [40, 0],
        })
      }, {
        scale: searchResultsAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        })
      }],
      opacity: searchResultsAnimation,
      zIndex: 10, // Lower zIndex than search container
      // Add pointerEvents to control touch handling
      pointerEvents: isSearchMode ? 'auto' : 'none',
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

  // Enhanced background color animation
  const animatedBackgroundColor = backgroundAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFF8E8', '#FFF8E8'], // Subtle background change during search
  });

  return (
    <MealWrapper>
      <Animated.View style={[styles.container, { backgroundColor: animatedBackgroundColor }]}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" />

          <View style={responsiveStyles.content}>
            {/* Enhanced Search Container with smooth animations */}
            <Animated.View style={responsiveStyles.searchContainer}>
              {/* Greeting Section with enhanced animation */}
              <Animated.View 
                style={responsiveStyles.greetingSection}
                // Use onLayout to get the dynamic height
                onLayout={onGreetingLayout}
                pointerEvents={isSearchMode ? 'none' : 'auto'} // Disable touch when hidden
              >
                <GreetingSection
                  userName="Priyangkush"
                  mealCount={369}
                />
              </Animated.View>

              <MealSearchInput
                placeholder="Find your healthy meal..."
                value={searchQuery}
                onChangeText={handleSearchChange}
                onSubmitEditing={handleSearchSubmit}
                showBackButton={isSearchMode}
                onBackPress={handleSearchBack}
                onMenuPress={() => console.log('Menu pressed')}
                autoFocus={false}
                
              />
            </Animated.View>

            {/* Enhanced Main Content with smooth animations */}
            <Animated.View 
              style={responsiveStyles.mainContent}
              pointerEvents={isSearchMode ? 'none' : 'auto'} // Disable touch in search mode
            >
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                scrollEventThrottle={16}
              >
                {/* Nutrition Categories */}
                <View style={responsiveStyles.foggyWrapper}>
                  <NutritionCategories
                    categories={nutritionCategories}
                    onCategoryPress={(category) => console.log('Category pressed:', category.name)}
                  />

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

                  <View style={responsiveStyles.foggyWrapper}>
                    <MealCardsList
                      meals={mealPlans}
                      onMealPress={handleMealPress}
                    />

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

            {/* Enhanced Search Results with smooth animations */}
            <Animated.View style={responsiveStyles.searchResults}>
              {isSearching ? (
                renderSearchLoadingState()
              ) : searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  renderItem={renderSearchResult}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.resultsContainer}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              ) : (
                renderSearchEmptyState()
              )}
            </Animated.View>
          </View>

          {/* Recipe Detail Modal */}
          <RecipeDetailModal
            visible={modalVisible}
            recipe={selectedRecipe}
            onClose={closeModal}
          />
        </SafeAreaView>
      </Animated.View>
    </MealWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
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
  // Search result styles (keeping your existing styles)
  resultsContainer: {
    paddingBottom: 80,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  resultImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  resultInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  resultMeta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '500',
  },
  rating: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingSpinnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default MealScreen;