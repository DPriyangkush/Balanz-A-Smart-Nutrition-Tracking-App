import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  Keyboard,
  InteractionManager,
} from 'react-native';
import { YStack } from 'tamagui';
import { MealWrapper } from '../components/ScreenWrappers';
import { LinearGradient } from 'expo-linear-gradient';

// Import the service layer instead of local data
import { MealService } from '../src/services/MealService';

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
  const [searchError, setSearchError] = useState(null);

  // View All Mode state
  const [isViewAllMode, setIsViewAllMode] = useState(false);
  const [viewAllItems, setViewAllItems] = useState([]);
  const [viewAllTitle, setViewAllTitle] = useState('');
  const [isLoadingViewAll, setIsLoadingViewAll] = useState(false);
  const [viewAllSearchQuery, setViewAllSearchQuery] = useState(''); // Separate search for view all

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Animation values (keeping existing animation logic)
  const greetingOpacity = useRef(new Animated.Value(1)).current;
  const greetingTranslateY = useRef(new Animated.Value(0)).current;
  const greetingScale = useRef(new Animated.Value(1)).current;
  const searchContainerTranslateY = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslateY = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(1)).current;
  const searchResultsOpacity = useRef(new Animated.Value(0)).current;
  const searchResultsTranslateY = useRef(new Animated.Value(40)).current;
  const searchResultsScale = useRef(new Animated.Value(0.95)).current;
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;
  const resultCardAnimations = useRef([]).current;

  // View All animation values
  const viewAllOpacity = useRef(new Animated.Value(0)).current;
  const viewAllTranslateY = useRef(new Animated.Value(40)).current;
  const viewAllScale = useRef(new Animated.Value(0.95)).current;
  const viewAllCardAnimations = useRef([]).current;

  // Layout measurements
  const greetingRef = useRef(null);
  const [greetingHeight, setGreetingHeight] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Performance: Memoize screen dimensions
  const { width: screenWidth, height: screenHeight } = useMemo(() =>
    Dimensions.get('window'), []
  );

  // Responsive calculations - memoized for performance
  const responsiveConfig = useMemo(() => {
    const isTablet = screenWidth >= 768;
    const isLargeScreen = screenWidth >= 1024;

    return {
      isTablet,
      isLargeScreen,
      horizontalPadding: Math.min(Math.max(screenWidth * 0.04, 16), 24),
      sectionSpacing: Math.min(Math.max(screenWidth * 0.03, 16), 24),
      gradientWidth: Math.min(Math.max(screenWidth * 0.08, 30), 60),
    };
  }, [screenWidth]);

  // Measure the height of the GreetingSection component
  const onGreetingLayout = useCallback((event) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && greetingHeight === 0) {
      setGreetingHeight(height);
      setIsInitialized(true);
    }
  }, [greetingHeight]);

  // Performance: Memoize static data
  const nutritionCategories = useMemo(() => [
    { id: 1, name: 'Protein', emoji: '🥩' },
    { id: 2, name: 'Carbs', emoji: '🍞' },
    { id: 3, name: 'Vitamins', emoji: '🥬' },
    { id: 4, name: 'Fiber', emoji: '🥕' },
    { id: 5, name: 'Calcium', emoji: '🥛' },
    { id: 6, name: 'Healthy Fats', emoji: '🥑' },
  ], []);

  const mealPlans = useMemo(() => [
    {
      id: 1,
      mealName: 'High Protein Bowl',
      calories: '450 - 650 cal',
      prepTime: '15-20 Min',
      imageUri: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop',
      rating: 4.8,
      difficulty: 'Easy',
      tags: ['Protein', 'Healthy', 'Quick'],
    },
    {
      id: 2,
      mealName: 'Mediterranean Feast',
      calories: '380 - 580 cal',
      prepTime: '10-15 Min',
      imageUri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=150&fit=crop',
      rating: 4.6,
      difficulty: 'Medium',
      tags: ['Mediterranean', 'Fresh', 'Balanced'],
    },
    {
      id: 3,
      mealName: 'Green Power Salad',
      calories: '320 - 450 cal',
      prepTime: '5-10 Min',
      imageUri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop',
      rating: 4.9,
      difficulty: 'Easy',
      tags: ['Vegan', 'Low-cal', 'Fresh'],
    },
    // Additional mock data for view all
    {
      id: 4,
      mealName: 'Quinoa Power Bowl',
      calories: '420 - 580 cal',
      prepTime: '20-25 Min',
      imageUri: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=150&fit=crop',
      rating: 4.7,
      difficulty: 'Medium',
      tags: ['Quinoa', 'Protein', 'Nutritious'],
    },
    {
      id: 5,
      mealName: 'Salmon Teriyaki',
      calories: '480 - 650 cal',
      prepTime: '25-30 Min',
      imageUri: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=150&fit=crop',
      rating: 4.8,
      difficulty: 'Hard',
      tags: ['Fish', 'Japanese', 'Omega-3'],
    },
    {
      id: 6,
      mealName: 'Veggie Stir Fry',
      calories: '280 - 380 cal',
      prepTime: '15-18 Min',
      imageUri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop',
      rating: 4.5,
      difficulty: 'Easy',
      tags: ['Vegetarian', 'Quick', 'Asian'],
    },
  ], []);

  // Initialize result card animations
  const initializeResultCardAnimations = useCallback((count) => {
    resultCardAnimations.length = 0;
    for (let i = 0; i < count; i++) {
      resultCardAnimations.push({
        translateY: new Animated.Value(50),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0.9),
      });
    }
  }, [resultCardAnimations]);

  // Initialize view all card animations
  const initializeViewAllCardAnimations = useCallback((count) => {
    viewAllCardAnimations.length = 0;
    for (let i = 0; i < count; i++) {
      viewAllCardAnimations.push({
        translateY: new Animated.Value(50),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0.9),
      });
    }
  }, [viewAllCardAnimations]);

  // Animate result cards with spring physics
  const animateResultCards = useCallback((results) => {
    initializeResultCardAnimations(results.length);

    // Stagger the animations for a professional cascading effect
    results.forEach((_, index) => {
      const delay = index * 80; // 80ms stagger

      setTimeout(() => {
        Animated.parallel([
          Animated.spring(resultCardAnimations[index].translateY, {
            toValue: 0,
            tension: 120,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(resultCardAnimations[index].opacity, {
            toValue: 1,
            tension: 120,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(resultCardAnimations[index].scale, {
            toValue: 1,
            tension: 120,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    });
  }, [initializeResultCardAnimations, resultCardAnimations]);

  // Animate view all cards with spring physics
  const animateViewAllCards = useCallback((items) => {
    initializeViewAllCardAnimations(items.length);

    // Stagger the animations for a professional cascading effect
    items.forEach((_, index) => {
      const delay = index * 80; // 80ms stagger

      setTimeout(() => {
        Animated.parallel([
          Animated.spring(viewAllCardAnimations[index].translateY, {
            toValue: 0,
            tension: 120,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(viewAllCardAnimations[index].opacity, {
            toValue: 1,
            tension: 120,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(viewAllCardAnimations[index].scale, {
            toValue: 1,
            tension: 120,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    });
  }, [initializeViewAllCardAnimations, viewAllCardAnimations]);

  // Enhanced search functionality using service layer
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      if (!isViewAllMode) {
        exitSearchMode();
      }
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // Use InteractionManager for better performance
      InteractionManager.runAfterInteractions(async () => {
        try {
          // Use the service layer instead of local data
          const filteredResults = await MealService.searchMeals(query);

          // Set results and stop loading
          setSearchResults(filteredResults);
          setIsSearching(false);

          // Animation for results
          if (filteredResults.length > 0) {
            setTimeout(() => {
              animateResultCards(filteredResults);
            }, 50);
          }
        } catch (error) {
          console.error('Search error:', error);
          setSearchError('Failed to search meals. Please try again.');
          setSearchResults([]);
          setIsSearching(false);
        }
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to search meals. Please try again.');
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [animateResultCards, isViewAllMode, exitSearchMode]);

  // Filter view all items based on search query
  const filteredViewAllItems = useMemo(() => {
    if (!viewAllSearchQuery.trim()) {
      return viewAllItems;
    }
    return viewAllItems.filter(item =>
      item.mealName.toLowerCase().includes(viewAllSearchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(viewAllSearchQuery.toLowerCase()))
    );
  }, [viewAllItems, viewAllSearchQuery]);

  // Load all items for view all mode
  const loadViewAllItems = useCallback(async (sectionType) => {
    setIsLoadingViewAll(true);
    
    try {
      let allItems = [];
      let title = '';

      switch (sectionType) {
        case 'meal-plans':
          // In a real app, this would fetch from your API
          allItems = mealPlans; // Use all meal plans including the additional ones
          title = 'All Balanced Nutrition Plans';
          break;
        case 'recipe-suggestions':
          // Mock data for recipe suggestions - in real app, fetch from API
          allItems = [
            {
              id: 101,
              mealName: 'Grilled Chicken Caesar',
              calories: '420 - 580 cal',
              prepTime: '20-25 Min',
              imageUri: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=150&fit=crop',
              rating: 4.7,
              difficulty: 'Medium',
              tags: ['Chicken', 'Classic', 'Protein'],
            },
            {
              id: 102,
              mealName: 'Buddha Bowl Delight',
              calories: '380 - 520 cal',
              prepTime: '15-20 Min',
              imageUri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop',
              rating: 4.8,
              difficulty: 'Easy',
              tags: ['Vegan', 'Healthy', 'Colorful'],
            },
            {
              id: 103,
              mealName: 'Spicy Thai Curry',
              calories: '450 - 650 cal',
              prepTime: '30-35 Min',
              imageUri: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=200&h=150&fit=crop',
              rating: 4.9,
              difficulty: 'Hard',
              tags: ['Thai', 'Spicy', 'Coconut'],
            },
            // Add more recipe suggestions...
            ...mealPlans.slice(0, 3), // Include some meal plans as recipe suggestions
          ];
          title = 'All Recipe Suggestions';
          break;
        default:
          allItems = mealPlans;
          title = 'All Items';
      }

      setViewAllItems(allItems);
      setViewAllTitle(title);
      setIsLoadingViewAll(false);

      // Animate cards after loading with a delay to ensure proper rendering
      setTimeout(() => {
        animateViewAllCards(allItems);
      }, 200); // Increased delay for better visibility
      
    } catch (error) {
      console.error('Error loading view all items:', error);
      setIsLoadingViewAll(false);
    }
  }, [mealPlans, animateViewAllCards]);

  // Professional enter search mode with enhanced animations
  const enterSearchMode = useCallback(() => {
    if (!isInitialized) return;

    setIsSearchMode(true);

    // Professional timing configuration
    const fastDuration = 200;
    const mediumDuration = 350;

    // Phase 1: Quick fade out of greeting and content
    Animated.parallel([
      // Greeting animations - all native driver
      Animated.timing(greetingOpacity, {
        toValue: 0,
        duration: fastDuration,
        useNativeDriver: true,
      }),
      Animated.timing(greetingTranslateY, {
        toValue: -10,
        duration: fastDuration,
        useNativeDriver: true,
      }),
      Animated.timing(greetingScale, {
        toValue: 0.95,
        duration: fastDuration,
        useNativeDriver: true,
      }),
      // Content animations - all native driver
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: mediumDuration,
        delay: 50,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 30,
        duration: mediumDuration,
        delay: 50,
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 0.98,
        duration: mediumDuration,
        delay: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Phase 2: Move search container and background transition
    setTimeout(() => {
      Animated.parallel([
        // Search container movement - native driver
        Animated.spring(searchContainerTranslateY, {
          toValue: -greetingHeight,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        // Background color - non-native driver
        Animated.timing(backgroundColorAnim, {
          toValue: 1,
          duration: mediumDuration,
          useNativeDriver: false,
        }),
      ]).start(() => {
        // Phase 3: Fade in search results
        Animated.parallel([
          Animated.timing(searchResultsOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(searchResultsTranslateY, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(searchResultsScale, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, fastDuration);
  }, [
    isInitialized,
    greetingHeight,
    greetingOpacity,
    greetingTranslateY,
    greetingScale,
    contentOpacity,
    contentTranslateY,
    contentScale,
    searchContainerTranslateY,
    backgroundColorAnim,
    searchResultsOpacity,
    searchResultsTranslateY,
    searchResultsScale,
  ]);

  // Professional enter view all mode - FIXED
  const enterViewAllMode = useCallback(async (sectionType) => {
    if (!isInitialized) return;

    setIsViewAllMode(true);
    
    // Professional timing configuration
    const fastDuration = 200;
    const mediumDuration = 350;

    // Phase 1: Quick fade out of greeting and content
    Animated.parallel([
      // Greeting animations - all native driver
      Animated.timing(greetingOpacity, {
        toValue: 0,
        duration: fastDuration,
        useNativeDriver: true,
      }),
      Animated.timing(greetingTranslateY, {
        toValue: -10,
        duration: fastDuration,
        useNativeDriver: true,
      }),
      Animated.timing(greetingScale, {
        toValue: 0.95,
        duration: fastDuration,
        useNativeDriver: true,
      }),
      // Content animations - all native driver
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: mediumDuration,
        delay: 50,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 30,
        duration: mediumDuration,
        delay: 50,
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 0.98,
        duration: mediumDuration,
        delay: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Phase 2: Move search container and background transition - FIXED: Don't move search container in ViewAll mode
    setTimeout(() => {
      Animated.parallel([
        // Keep search container at top for ViewAll mode
        Animated.spring(searchContainerTranslateY, {
          toValue: -greetingHeight,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        // Background color - non-native driver
        Animated.timing(backgroundColorAnim, {
          toValue: 1,
          duration: mediumDuration,
          useNativeDriver: false,
        }),
      ]).start(() => {
        // Phase 3: Load data and show view all results
        loadViewAllItems(sectionType).then(() => {
          Animated.parallel([
            Animated.timing(viewAllOpacity, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(viewAllTranslateY, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(viewAllScale, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }),
          ]).start();
        });
      });
    }, fastDuration);
  }, [
    isInitialized,
    greetingHeight,
    greetingOpacity,
    greetingTranslateY,
    greetingScale,
    contentOpacity,
    contentTranslateY,
    contentScale,
    searchContainerTranslateY,
    backgroundColorAnim,
    viewAllOpacity,
    viewAllTranslateY,
    viewAllScale,
    loadViewAllItems,
  ]);

  // Professional exit search mode with smooth reverse animations
  const exitSearchMode = useCallback(() => {
    Keyboard.dismiss();

    const fastDuration = 200;
    const mediumDuration = 350;

    // Phase 1: Fade out search results
    Animated.parallel([
      Animated.timing(searchResultsOpacity, {
        toValue: 0,
        duration: fastDuration,
        useNativeDriver: true,
      }),
      Animated.timing(searchResultsTranslateY, {
        toValue: 40,
        duration: fastDuration,
        useNativeDriver: true,
      }),
      Animated.timing(searchResultsScale, {
        toValue: 0.95,
        duration: fastDuration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Phase 2: Move search container back and background transition
      Animated.parallel([
        Animated.spring(searchContainerTranslateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundColorAnim, {
          toValue: 0,
          duration: mediumDuration,
          useNativeDriver: false,
        }),
      ]).start();

      // Phase 3: Fade in main content and greeting (staggered)
      setTimeout(() => {
        Animated.parallel([
          // Content animations
          Animated.spring(contentOpacity, {
            toValue: 1,
            tension: 100,
            friction: 8,
            delay: 50,
            useNativeDriver: true,
          }),
          Animated.spring(contentTranslateY, {
            toValue: 0,
            tension: 100,
            friction: 8,
            delay: 50,
            useNativeDriver: true,
          }),
          Animated.spring(contentScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            delay: 50,
            useNativeDriver: true,
          }),
          // Greeting animations
          Animated.spring(greetingOpacity, {
            toValue: 1,
            tension: 100,
            friction: 8,
            delay: 100,
            useNativeDriver: true,
          }),
          Animated.spring(greetingTranslateY, {
            toValue: 0,
            tension: 100,
            friction: 8,
            delay: 100,
            useNativeDriver: true,
          }),
          Animated.spring(greetingScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            delay: 100,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Clean up state after animations complete
          setIsSearchMode(false);
          setSearchResults([]);
          setSearchQuery('');
          setSearchError(null);

          // Reset result card animations
          resultCardAnimations.forEach(anim => {
            anim.translateY.setValue(50);
            anim.opacity.setValue(0);
            anim.scale.setValue(0.9);
          });
        });
      }, fastDuration);
    });
  }, [
    searchResultsOpacity,
    searchResultsTranslateY,
    searchResultsScale,
    searchContainerTranslateY,
    backgroundColorAnim,
    contentOpacity,
    contentTranslateY,
    contentScale,
    greetingOpacity,
    greetingTranslateY,
    greetingScale,
    resultCardAnimations,
  ]);

  // Professional exit view all mode
  const exitViewAllMode = useCallback(() => {
    const fastDuration = 200;
    const mediumDuration = 350;

    // Phase 1: Fade out view all results
    Animated.parallel([
      Animated.timing(viewAllOpacity, {
        toValue: 0,
        duration: fastDuration,
        useNativeDriver: true,
      }),
      Animated.timing(viewAllTranslateY, {
        toValue: 40,
        duration: fastDuration,
        useNativeDriver: true,
      }),
      Animated.timing(viewAllScale, {
        toValue: 0.95,
        duration: fastDuration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Phase 2: Move search container back and background transition
      Animated.parallel([
        Animated.spring(searchContainerTranslateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundColorAnim, {
          toValue: 0,
          duration: mediumDuration,
          useNativeDriver: false,
        }),
      ]).start();

      // Phase 3: Fade in main content and greeting (staggered)
      setTimeout(() => {
        Animated.parallel([
          // Content animations
          Animated.spring(contentOpacity, {
            toValue: 1,
            tension: 100,
            friction: 8,
            delay: 50,
            useNativeDriver: true,
          }),
          Animated.spring(contentTranslateY, {
            toValue: 0,
            tension: 100,
            friction: 8,
            delay: 50,
            useNativeDriver: true,
          }),
          Animated.spring(contentScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            delay: 50,
            useNativeDriver: true,
          }),
          // Greeting animations
          Animated.spring(greetingOpacity, {
            toValue: 1,
            tension: 100,
            friction: 8,
            delay: 100,
            useNativeDriver: true,
          }),
          Animated.spring(greetingTranslateY, {
            toValue: 0,
            tension: 100,
            friction: 8,
            delay: 100,
            useNativeDriver: true,
          }),
          Animated.spring(greetingScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            delay: 100,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Clean up state after animations complete
          setIsViewAllMode(false);
          setViewAllItems([]);
          setViewAllTitle('');
          setViewAllSearchQuery(''); // Clear view all search

          // Reset view all card animations
          viewAllCardAnimations.forEach(anim => {
            anim.translateY.setValue(50);
            anim.opacity.setValue(0);
            anim.scale.setValue(0.9);
          });
        });
      }, fastDuration);
    });
  }, [
    viewAllOpacity,
    viewAllTranslateY,
    viewAllScale,
    searchContainerTranslateY,
    backgroundColorAnim,
    contentOpacity,
    contentTranslateY,
    contentScale,
    greetingOpacity,
    greetingTranslateY,
    greetingScale,
    viewAllCardAnimations,
  ]);

  // Reset to main screen without animation (for navigation focus)
  const resetToMainScreen = useCallback(() => {
    setIsSearchMode(false);
    setIsViewAllMode(false);
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
    setViewAllItems([]);
    setViewAllTitle('');
    setViewAllSearchQuery(''); // Reset view all search

    // Reset all animations instantly
    greetingOpacity.setValue(1);
    greetingTranslateY.setValue(0);
    greetingScale.setValue(1);
    searchContainerTranslateY.setValue(0);
    contentOpacity.setValue(1);
    contentTranslateY.setValue(0);
    contentScale.setValue(1);
    searchResultsOpacity.setValue(0);
    searchResultsTranslateY.setValue(40);
    searchResultsScale.setValue(0.95);
    viewAllOpacity.setValue(0);
    viewAllTranslateY.setValue(40);
    viewAllScale.setValue(0.95);
    backgroundColorAnim.setValue(0);

    // Reset result card animations
    resultCardAnimations.forEach(anim => {
      anim.translateY.setValue(50);
      anim.opacity.setValue(0);
      anim.scale.setValue(0.9);
    });

    // Reset view all card animations
    viewAllCardAnimations.forEach(anim => {
      anim.translateY.setValue(50);
      anim.opacity.setValue(0);
      anim.scale.setValue(0.9);
    });
  }, [
    greetingOpacity,
    greetingTranslateY,
    greetingScale,
    searchContainerTranslateY,
    contentOpacity,
    contentTranslateY,
    contentScale,
    searchResultsOpacity,
    searchResultsTranslateY,
    searchResultsScale,
    viewAllOpacity,
    viewAllTranslateY,
    viewAllScale,
    backgroundColorAnim,
    resultCardAnimations,
    viewAllCardAnimations,
  ]);

  // Initialize back handler for Android
  useEffect(() => {
    const backAction = () => {
      if (isViewAllMode) {
        exitViewAllMode();
        return true;
      }
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
  }, [isSearchMode, isViewAllMode, exitSearchMode, exitViewAllMode]);

  // Navigation focus effect
  useEffect(() => {
    const unsubscribe = navigation?.addListener?.('focus', () => {
      if (isSearchMode || isViewAllMode) {
        resetToMainScreen();
      }
    });

    return unsubscribe;
  }, [navigation, isSearchMode, isViewAllMode, resetToMainScreen]);

  // Handle search input submission
  const handleSearchSubmit = useCallback(() => {
    if (isViewAllMode) {
      // In view all mode, just filter the results, don't change modes
      return;
    }
    
    if (searchQuery.trim()) {
      if (!isSearchMode) {
        enterSearchMode();
      }
      performSearch(searchQuery);
    }
  }, [searchQuery, isSearchMode, isViewAllMode, enterSearchMode, performSearch]);

  // Handle search text change with improved logic - FIXED for ViewAll mode
  const handleSearchChange = useCallback((text) => {
    if (isViewAllMode) {
      // In view all mode, just update the view all search query
      setViewAllSearchQuery(text);
      return;
    }

    // Regular search mode logic
    setSearchQuery(text);

    // If user types something and we're not in search mode, enter it
    if (text.trim() && !isSearchMode) {
      enterSearchMode();
      // Perform search after entering search mode
      setTimeout(() => {
        performSearch(text);
      }, 300); // Wait for search mode animations
    } else if (text.trim() && isSearchMode) {
      // If already in search mode, search immediately
      performSearch(text);
    } else if (!text.trim() && isSearchMode) {
      // If user clears the search completely, exit search mode
      exitSearchMode();
    }
  }, [isSearchMode, isViewAllMode, exitSearchMode, enterSearchMode, performSearch]);

  // Handle back press in search mode
  const handleSearchBack = useCallback(() => {
    if (isViewAllMode) {
      exitViewAllMode();
    } else if (isSearchMode) {
      exitSearchMode();
    }
  }, [isSearchMode, isViewAllMode, exitSearchMode, exitViewAllMode]);

  // Handle section arrow press for view all
  const handleSectionArrowPress = useCallback((sectionType) => {
    enterViewAllMode(sectionType);
  }, [enterViewAllMode]);

  // Modal handlers - FIXED to prevent overlapping
  const handleRecipePress = useCallback((recipe) => {
    console.log('Recipe pressed:', recipe);
    setSelectedRecipe(recipe);
    setModalVisible(true);
  }, []);

  const handleMealPress = useCallback((meal) => {
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
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => {
      setSelectedRecipe(null);
    }, 300); // Delay clearing the recipe to prevent flickering
  }, []);

  // Enhanced search result renderer with spring animations - FIXED activeOpacity
  const renderSearchResult = useCallback(({ item, index }) => {
    const cardAnimation = resultCardAnimations[index] || {
      translateY: new Animated.Value(50),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.9),
    };

    return (
      <Animated.View
        style={[
          styles.resultCard,
          {
            transform: [
              { translateY: cardAnimation.translateY },
              { scale: cardAnimation.scale },
            ],
            opacity: cardAnimation.opacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.resultCardContent}
          onPress={() => handleMealPress(item)}
          activeOpacity={0.95} // Reduced to prevent visual overlap
        >
          <View style={styles.resultImageContainer}>
            <View style={[styles.resultImagePlaceholder, { backgroundColor: '#E8F4FD' }]} />
          </View>
          <View style={styles.resultInfo}>
            <Text style={styles.resultTitle}>{item.mealName}</Text>
            <Text style={styles.resultMeta}>{item.calories} • {item.prepTime}</Text>
            <View style={styles.tagsContainer}>
              {item.tags?.slice(0, 2).map((tag, tagIndex) => (
                <View key={tagIndex} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [resultCardAnimations, handleMealPress]);

  // View all result renderer with spring animations - FIXED activeOpacity
  const renderViewAllResult = useCallback(({ item, index }) => {
    const cardAnimation = viewAllCardAnimations[index] || {
      translateY: new Animated.Value(50),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.9),
    };

    return (
      <Animated.View
        style={[
          styles.resultCard,
          {
            transform: [
              { translateY: cardAnimation.translateY },
              { scale: cardAnimation.scale },
            ],
            opacity: cardAnimation.opacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.resultCardContent}
          onPress={() => handleMealPress(item)}
          activeOpacity={0.95} // Reduced to prevent visual overlap
        >
          <View style={styles.resultImageContainer}>
            <View style={[styles.resultImagePlaceholder, { backgroundColor: '#E8F4FD' }]} />
          </View>
          <View style={styles.resultInfo}>
            <Text style={styles.resultTitle}>{item.mealName}</Text>
            <Text style={styles.resultMeta}>{item.calories} • {item.prepTime}</Text>
            <View style={styles.tagsContainer}>
              {item.tags?.slice(0, 2).map((tag, tagIndex) => (
                <View key={tagIndex} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [viewAllCardAnimations, handleMealPress]);

  const renderSearchEmptyState = useCallback(() => (
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
  ), [searchQuery]);

  const renderViewAllEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>🍽️</Text>
      <Text style={styles.emptyStateTitle}>
        {viewAllSearchQuery ? 'No items found' : 'No items available'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {viewAllSearchQuery
          ? 'Try different keywords or clear the search'
          : 'We couldn\'t find any items in this section right now.'
        }
      </Text>
    </View>
  ), [viewAllSearchQuery]);

  const renderSearchLoadingState = useCallback(() => (
    <View style={styles.loadingSpinnerContainer}>
      <ActivityIndicator
        size="large"
        color="#FF6B35"
        style={styles.loadingSpinner}
      />
      <Text style={styles.loadingText}>Searching for meals...</Text>
    </View>
  ), []);

  const renderViewAllLoadingState = useCallback(() => (
    <View style={styles.loadingSpinnerContainer}>
      <ActivityIndicator
        size="large"
        color="#FF6B35"
        style={styles.loadingSpinner}
      />
      <Text style={styles.loadingText}>Loading all items...</Text>
    </View>
  ), []);

  const renderSearchErrorState = useCallback(() => (
    <View style={styles.errorState}>
      <Text style={styles.errorEmoji}>⚠️</Text>
      <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
      <Text style={styles.errorMessage}>{searchError}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => performSearch(searchQuery)}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  ), [searchError, searchQuery, performSearch]);

  // Memoize dynamic styles for performance - FIXED container heights
  const responsiveStyles = useMemo(() => StyleSheet.create({
    content: {
      flex: 1,
      paddingHorizontal: responsiveConfig.horizontalPadding,
      paddingTop: responsiveConfig.isTablet ? 20 : 0,
      maxWidth: responsiveConfig.isLargeScreen ? 1200 : '100%',
      alignSelf: 'center',
    },
    searchContainer: {
      paddingTop: 5,
      paddingBottom: 5,
      transform: [{ translateY: searchContainerTranslateY }],
      zIndex: (isSearchMode || isViewAllMode) ? 1000 : 20,
      elevation: (isSearchMode || isViewAllMode) ? 1000 : 20,
    },
    greetingSection: {
      opacity: greetingOpacity,
      transform: [
        { translateY: greetingTranslateY },
        { scale: greetingScale }
      ],
      pointerEvents: (isSearchMode || isViewAllMode) ? 'none' : 'auto',
      zIndex: (isSearchMode || isViewAllMode) ? -1 : 1,
    },
    mainContent: {
      flex: 1,
      opacity: contentOpacity,
      transform: [
        { translateY: contentTranslateY },
        { scale: contentScale }
      ],
      pointerEvents: (isSearchMode || isViewAllMode) ? 'none' : 'auto',
      zIndex: (isSearchMode || isViewAllMode) ? -1 : 1,
    },
    searchResults: {
      position: 'absolute',
      top: 70,
      left: responsiveConfig.horizontalPadding,
      right: responsiveConfig.horizontalPadding,
      bottom: 0,
      opacity: searchResultsOpacity,
      transform: [
        { translateY: searchResultsTranslateY },
        { scale: searchResultsScale }
      ],
      zIndex: isSearchMode ? 100 : -1,
      elevation: isSearchMode ? 100 : -1,
      pointerEvents: isSearchMode ? 'auto' : 'none',
    },
    viewAllResults: {
      position: 'absolute',
      top: 70,
      left: responsiveConfig.horizontalPadding,
      right: responsiveConfig.horizontalPadding,
      bottom: 0,
      opacity: viewAllOpacity,
      transform: [
        { translateY: viewAllTranslateY },
        { scale: viewAllScale }
      ],
      zIndex: isViewAllMode ? 100 : -1,
      elevation: isViewAllMode ? 100 : -1,
      pointerEvents: isViewAllMode ? 'auto' : 'none',
    },
    mealPlanSection: {
      marginBottom: responsiveConfig.sectionSpacing * 0.5,
    },
    nutritionTrackingSection: {
      marginBottom: responsiveConfig.sectionSpacing,
    },
    spacer: {
      height: Math.min(Math.max(screenHeight * 0.08, 60), 120),
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: responsiveConfig.gradientWidth,
      zIndex: 2,
    },
    foggyWrapper: {
      position: 'relative',
      marginHorizontal: responsiveConfig.isTablet ? 0 : -responsiveConfig.horizontalPadding * 0.5,
    },
  }), [
    responsiveConfig,
    searchContainerTranslateY,
    isSearchMode,
    isViewAllMode,
    greetingOpacity,
    greetingTranslateY,
    greetingScale,
    contentOpacity,
    contentTranslateY,
    contentScale,
    searchResultsOpacity,
    searchResultsTranslateY,
    searchResultsScale,
    viewAllOpacity,
    viewAllTranslateY,
    viewAllScale,
    screenHeight,
  ]);

  // Enhanced background color animation - using only static colors to avoid conflicts
  const animatedBackgroundStyle = useMemo(() => ({
    backgroundColor: '#FFF8E8', // Static color to avoid animation conflicts
  }), []);

  return (
    <MealWrapper>
      <View style={[styles.container, animatedBackgroundStyle]}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" />

          <View style={responsiveStyles.content}>
            {/* Enhanced Search Container */}
            <Animated.View style={responsiveStyles.searchContainer}>
              {/* Greeting Section */}
              <Animated.View
                style={responsiveStyles.greetingSection}
                onLayout={onGreetingLayout}
              >
                <GreetingSection
                  userName="Priyangkush"
                  mealCount={369}
                />
              </Animated.View>

              {/* Search Input - FIXED to use correct query based on mode */}
              <MealSearchInput
                placeholder={isViewAllMode ? "Search in this section..." : "Find your healthy meal..."}
                value={isViewAllMode ? viewAllSearchQuery : searchQuery}
                onChangeText={handleSearchChange}
                onSubmitEditing={handleSearchSubmit}
                showBackButton={isSearchMode || isViewAllMode}
                onBackPress={handleSearchBack}
                onMenuPress={() => console.log('Menu pressed')}
                autoFocus={false}
              />
            </Animated.View>

            {/* Main Content */}
            <Animated.View style={responsiveStyles.mainContent}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                scrollEventThrottle={16}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                windowSize={10}
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
                    onArrowPress={() => handleSectionArrowPress('meal-plans')}
                  />

                  <View style={responsiveStyles.foggyWrapper}>
                    <MealCardsList
                      meals={mealPlans.slice(0, 3)} // Show only first 3 items in preview
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
                    onArrowPress={() => handleSectionArrowPress('recipe-suggestions')}
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

            {/* Search Results with spring animations */}
            <Animated.View style={responsiveStyles.searchResults}>
              {searchError ? (
                renderSearchErrorState()
              ) : isSearching ? (
                renderSearchLoadingState()
              ) : searchResults.length > 0 ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.resultsContainer}
                  scrollEventThrottle={16}
                  removeClippedSubviews={true}
                  style={styles.resultsScrollView}
                >
                  {searchResults.map((item, index) => (
                    <View key={item.id.toString()}>
                      {renderSearchResult({ item, index })}
                      {index < searchResults.length - 1 && <View style={styles.separator} />}
                    </View>
                  ))}
                </ScrollView>
              ) : (
                renderSearchEmptyState()
              )}
            </Animated.View>

            {/* View All Results with spring animations - FIXED to use filtered items */}
            <Animated.View style={responsiveStyles.viewAllResults}>
              {/* View All Header */}
              {isViewAllMode && (
                <View style={styles.viewAllHeader}>
                  <Text style={styles.viewAllTitle}>{viewAllTitle}</Text>
                  <Text style={styles.viewAllCount}>
                    {filteredViewAllItems.length} {filteredViewAllItems.length === 1 ? 'item' : 'items'}
                    {viewAllSearchQuery ? ` found for "${viewAllSearchQuery}"` : ''}
                  </Text>
                </View>
              )}

              {isLoadingViewAll ? (
                renderViewAllLoadingState()
              ) : filteredViewAllItems.length > 0 ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.resultsContainer}
                  scrollEventThrottle={16}
                  removeClippedSubviews={true}
                  style={styles.resultsScrollView}
                >
                  {filteredViewAllItems.map((item, index) => (
                    <View key={item.id.toString()}>
                      {renderViewAllResult({ item, index })}
                      {index < filteredViewAllItems.length - 1 && <View style={styles.separator} />}
                    </View>
                  ))}
                </ScrollView>
              ) : (
                renderViewAllEmptyState()
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
      </View>
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
  // View All Header Styles
  viewAllHeader: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    
  },
  viewAllTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    lineHeight: 30,
    textAlign: "center"
  },
  viewAllCount: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    lineHeight: 30,
    textAlign: "center"
  },
  // Enhanced search result styles with professional polish - FIXED padding
  resultsContainer: {
    paddingBottom: 120, // Increased bottom padding to prevent cut-off
    
  },
  resultCard: {
    marginBottom: 10,
  },
  resultCardContent: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  resultImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: "center"
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
    lineHeight: 22,
  },
  resultMeta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  resultsScrollView: {
    flex: 1, // FIXED: Changed from flexGrow to flex for proper scrolling
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
    borderWidth: 0.5,
    borderColor: 'rgba(0,102,204,0.1)',
  },
  tagText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '500',
  },
  rating: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
    marginHorizontal: 16,
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
    lineHeight: 26,
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
    fontWeight: '500',
  },
  // Error state styles
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 26,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MealScreen;