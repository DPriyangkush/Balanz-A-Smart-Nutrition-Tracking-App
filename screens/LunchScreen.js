// LunchScreen.js - Updated with PromoCarousel integration
import React, { 
    memo, 
    useMemo, 
    useState, 
    useRef, 
    useCallback, 
    useEffect,
    useLayoutEffect 
} from "react";
import {
    View,
    StyleSheet,
    StatusBar,
    Dimensions,
    Alert,
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    BackHandler,
    Keyboard,
    InteractionManager,
    Platform,
    UIManager,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { BreakfastWrapper, LunchWrapper } from "../components/ScreenWrappers";
import HeaderSection from "../components/HeaderSection";
import PromoCard from "../components/PromoCard";
import NutritionCategories from "../components/NutritionCategories";
import SunriseSunLensUltra from "../animatedScenes/SunriseScene";
import MealSearchInput from "../components/MealSearchInput";
import FoodCardsGrid from "components/BreakfastRecommendedCards";
import { MealService } from '../src/services/MealService';
import AfternoonScene from "../animatedScenes/AfternoonScene";

// Import the new promo components
import PromoCarousel from '../components/PromoCarousel';
import { promoManager, SAMPLE_USER_PROFILES, createUserProfile } from '../src/services/PromoDataManager';

// Enable layout animations on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Memoize screen dimensions outside component to prevent recalculation
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const SEARCH_DEBOUNCE_MS = 300;
const ANIMATION_STAGGER_MS = 60; // Reduced for smoother feel
const MAX_RESULT_ANIMATIONS = 20; // Limit for memory optimization

// Animation configuration for production-level smoothness
const ANIMATION_CONFIG = {
    // Use higher tension/friction for snappier, more responsive animations
    SPRING: {
        tension: 150,
        friction: 12,
        useNativeDriver: true,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
    },
    // Optimized timing for UI transitions
    TIMING_FAST: {
        duration: 200,
        useNativeDriver: true,
    },
    TIMING_MEDIUM: {
        duration: 300,
        useNativeDriver: true,
    },
    // For search overlay transitions
    SEARCH_TRANSITION: {
        duration: 250,
        useNativeDriver: true,
    },
};

// Memoized components for performance
const MemoizedHeaderSection = memo(HeaderSection);
const MemoizedPromoCard = memo(PromoCard);
const MemoizedNutritionCategories = memo(NutritionCategories);
const MemoizedFoodCardsGrid = memo(FoodCardsGrid);
const MemoizedMealSearchInput = memo(MealSearchInput);
const MemoizedPromoCarousel = memo(PromoCarousel);

// Main component
const LunchScreen = memo(({ navigation, route }) => {
    // Get user profile from route params or create default
    const userProfile = useMemo(() => {
        if (route?.params?.userProfile) {
            return route.params.userProfile;
        }
        
        // Create a default user profile for lunch lovers
        return createUserProfile({
            audience: ['busy-professionals', 'health-conscious'],
            dietaryRestrictions: [],
            budgetRange: [300, 900],
            favoriteCategories: ['power', 'light', 'express'],
            mealPreferences: { preferQuickMeals: true, energyBoost: true },
        });
    }, [route?.params?.userProfile]);

    // Search state with better organization
    const [searchState, setSearchState] = useState({
        query: '',
        isSearchMode: false,
        results: [],
        isSearching: false,
        error: null,
    });

    // Promo state
    const [promoState, setPromoState] = useState({
        showPromoCarousel: true,
        promoError: null,
    });

    // Animation refs organized and optimized
    const animationRefs = useRef({
        contentOpacity: new Animated.Value(1),
        searchResultsOpacity: new Animated.Value(0),
        searchResultsTranslateY: new Animated.Value(30), // Reduced for subtlety
        searchResultsScale: new Animated.Value(0.98), // Closer to 1 for smoother feel
        resultCards: [], // Will be populated dynamically
    }).current;

    // Debounced search ref
    const searchTimeoutRef = useRef(null);
    const isMountedRef = useRef(true);

    // Memoize StatusBar props
    const statusBarProps = useMemo(() => ({
        barStyle: "light-content",
        backgroundColor: "transparent",
        translucent: true,
    }), []);
    
    // Enhanced responsive configuration with better calculations
    const responsiveConfig = useMemo(() => {
        const isTablet = screenWidth >= 768;
        const isLargeScreen = screenWidth >= 1024;
        const safeHorizontalPadding = Math.min(Math.max(screenWidth * 0.04, 10), 10);

        return {
            isTablet,
            isLargeScreen,
            horizontalPadding: safeHorizontalPadding,
            sectionSpacing: Math.min(Math.max(screenWidth * 0.03, 16), 20),
            gradientWidth: Math.min(Math.max(screenWidth * 0.08, 30), 60),
            searchResultsTop: isTablet ? 450 : 500,
        };
    }, []);

    // Promo event handlers
    const handlePromoPress = useCallback((promo, index) => {
        console.log('Promo pressed:', promo.title, 'at index:', index);
        
        // Show detailed promo information
        Alert.alert(
            promo.title,
            `${promo.subtitle}\n\n${promo.specialOffer || 'Special lunch offer available!'}`,
            [
                { text: 'Maybe Later', style: 'cancel' },
                { 
                    text: promo.buttonText, 
                    onPress: () => {
                        // Navigate to a specific lunch category or items
                        // You can customize this based on the promo category
                        if (promo.category === 'power') {
                            // Navigate to power lunch options
                            console.log('Navigating to power lunch options');
                        } else if (promo.category === 'light') {
                            // Navigate to light lunch options
                            console.log('Navigating to light lunch options');
                        } else if (promo.category === 'express') {
                            // Navigate to express lunch options
                            console.log('Navigating to express lunch options');
                        } else {
                            // Default navigation
                            console.log('Default promo action');
                        }
                    }
                }
            ]
        );
    }, []);

    // Handle promo carousel errors
    const handlePromoError = useCallback((error) => {
        console.warn('Promo carousel error:', error);
        setPromoState(prev => ({
            ...prev,
            promoError: error,
            showPromoCarousel: false,
        }));
    }, []);

    // Toggle promo carousel visibility
    const togglePromoCarousel = useCallback(() => {
        setPromoState(prev => ({
            ...prev,
            showPromoCarousel: !prev.showPromoCarousel,
            promoError: null,
        }));
    }, []);

    // Optimized result card animation initialization
    const initializeResultCardAnimations = useCallback((count) => {
        const actualCount = Math.min(count, MAX_RESULT_ANIMATIONS);
        
        // Only create new animations if needed
        while (animationRefs.resultCards.length < actualCount) {
            animationRefs.resultCards.push({
                translateY: new Animated.Value(40), // Reduced for subtlety
                opacity: new Animated.Value(0),
                scale: new Animated.Value(0.95),
            });
        }
        
        // Reset only the animations we'll use
        for (let i = 0; i < actualCount; i++) {
            const cardAnim = animationRefs.resultCards[i];
            cardAnim.translateY.setValue(40);
            cardAnim.opacity.setValue(0);
            cardAnim.scale.setValue(0.95);
        }
    }, [animationRefs.resultCards]);

    // Enhanced card animation with better performance
    const animateResultCards = useCallback((results) => {
        const actualCount = Math.min(results.length, MAX_RESULT_ANIMATIONS);
        initializeResultCardAnimations(actualCount);

        // Use InteractionManager for better performance
        InteractionManager.runAfterInteractions(() => {
            // Create all animations first, then start them together for better performance
            const animations = [];
            
            for (let i = 0; i < actualCount; i++) {
                const delay = i * ANIMATION_STAGGER_MS;
                const cardAnim = animationRefs.resultCards[i];
                
                animations.push(
                    Animated.sequence([
                        Animated.delay(delay),
                        Animated.parallel([
                            Animated.spring(cardAnim.translateY, {
                                toValue: 0,
                                ...ANIMATION_CONFIG.SPRING,
                            }),
                            Animated.spring(cardAnim.opacity, {
                                toValue: 1,
                                ...ANIMATION_CONFIG.SPRING,
                            }),
                            Animated.spring(cardAnim.scale, {
                                toValue: 1,
                                ...ANIMATION_CONFIG.SPRING,
                            }),
                        ]),
                    ])
                );
            }
            
            // Start all animations
            Animated.parallel(animations).start();
        });
    }, [initializeResultCardAnimations, animationRefs.resultCards]);

    // Optimized search function with proper error handling and debouncing
    const performSearch = useCallback(async (query) => {
        if (!query.trim()) {
            exitSearchMode();
            return;
        }

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        setSearchState(prev => ({ ...prev, isSearching: true, error: null }));

        try {
            const filteredResults = await MealService.searchMeals(query);
            
            if (!isMountedRef.current) return;
            
            setSearchState(prev => ({ 
                ...prev, 
                results: filteredResults, 
                isSearching: false 
            }));

            // Animate results
            if (filteredResults.length > 0) {
                requestAnimationFrame(() => {
                    animateResultCards(filteredResults);
                });
            }
        } catch (error) {
            if (!isMountedRef.current) return;
            
            console.error('Search error:', error);
            setSearchState(prev => ({
                ...prev,
                error: 'Failed to search meals. Please try again.',
                results: [],
                isSearching: false,
            }));
        }
    }, [animateResultCards]);

    // Debounced search wrapper
    const debouncedSearch = useCallback((query) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(query);
        }, SEARCH_DEBOUNCE_MS);
    }, [performSearch]);

    // Enhanced search mode transitions
    const enterSearchMode = useCallback(() => {
        setSearchState(prev => ({ ...prev, isSearchMode: true }));

        // Parallel animations for smoother transition
        Animated.parallel([
            Animated.timing(animationRefs.contentOpacity, {
                toValue: 0,
                ...ANIMATION_CONFIG.TIMING_MEDIUM,
            }),
            Animated.sequence([
                Animated.delay(150), // Start search results animation midway
                Animated.parallel([
                    Animated.timing(animationRefs.searchResultsOpacity, {
                        toValue: 1,
                        ...ANIMATION_CONFIG.SEARCH_TRANSITION,
                    }),
                    Animated.spring(animationRefs.searchResultsTranslateY, {
                        toValue: 0,
                        ...ANIMATION_CONFIG.SPRING,
                    }),
                    Animated.spring(animationRefs.searchResultsScale, {
                        toValue: 1,
                        ...ANIMATION_CONFIG.SPRING,
                    }),
                ]),
            ]),
        ]).start();
    }, [animationRefs]);

    const exitSearchMode = useCallback(() => {
        Keyboard.dismiss();

        // Reverse animation sequence
        Animated.parallel([
            Animated.timing(animationRefs.searchResultsOpacity, {
                toValue: 0,
                ...ANIMATION_CONFIG.TIMING_FAST,
            }),
            Animated.timing(animationRefs.searchResultsTranslateY, {
                toValue: 30,
                ...ANIMATION_CONFIG.TIMING_FAST,
            }),
            Animated.timing(animationRefs.searchResultsScale, {
                toValue: 0.98,
                ...ANIMATION_CONFIG.TIMING_FAST,
            }),
        ]).start(() => {
            // Fade in main content
            Animated.timing(animationRefs.contentOpacity, {
                toValue: 1,
                ...ANIMATION_CONFIG.TIMING_MEDIUM,
            }).start(() => {
                // Clean up state
                setSearchState({
                    query: '',
                    isSearchMode: false,
                    results: [],
                    isSearching: false,
                    error: null,
                });

                // Reset card animations
                animationRefs.resultCards.forEach(anim => {
                    anim.translateY.setValue(40);
                    anim.opacity.setValue(0);
                    anim.scale.setValue(0.95);
                });
            });
        });
    }, [animationRefs]);

    // Instant reset for navigation
    const resetToMainScreen = useCallback(() => {
        setSearchState({
            query: '',
            isSearchMode: false,
            results: [],
            isSearching: false,
            error: null,
        });

        // Reset all animations instantly
        animationRefs.contentOpacity.setValue(1);
        animationRefs.searchResultsOpacity.setValue(0);
        animationRefs.searchResultsTranslateY.setValue(30);
        animationRefs.searchResultsScale.setValue(0.98);

        animationRefs.resultCards.forEach(anim => {
            anim.translateY.setValue(40);
            anim.opacity.setValue(0);
            anim.scale.setValue(0.95);
        });
    }, [animationRefs]);

    // Enhanced event handlers
    const handleSearchSubmit = useCallback(() => {
        if (searchState.query.trim()) {
            if (!searchState.isSearchMode) {
                enterSearchMode();
            }
            performSearch(searchState.query);
        }
    }, [searchState.query, searchState.isSearchMode, enterSearchMode, performSearch]);

    const handleSearchChange = useCallback((text) => {
        setSearchState(prev => ({ ...prev, query: text }));

        if (text.trim() && !searchState.isSearchMode) {
            enterSearchMode();
            debouncedSearch(text);
        } else if (text.trim() && searchState.isSearchMode) {
            debouncedSearch(text);
        } else if (!text.trim() && searchState.isSearchMode) {
            exitSearchMode();
        }
    }, [searchState.isSearchMode, enterSearchMode, exitSearchMode, debouncedSearch]);

    // Memoized handlers to prevent unnecessary re-renders
    const handlers = useMemo(() => ({
        categoryPress: (category) => Alert.alert("Category", `Selected: ${category.name}`),
        categorySeeAll: () => Alert.alert("Categories", "View all categories"),
        foodCardsSeeAll: () => Alert.alert("Popular Recipes", "View all popular recipes"),
        itemPress: (item) => Alert.alert("Food Item", `Selected: ${item.name}`),
        recommendedSeeAll: () => Alert.alert("Recommended", "View all recommended items"),
        // Legacy promo press handler for the old promo card
        promoPress: () => Alert.alert("Promo", "New recipe promotion activated!"),
    }), []);

    const handleFoodItemPress = useCallback((item) => {
        navigation.navigate('MealDetails', {
            mealData: {
                id: item.id,
                name: item.name,
                category: item.category || 'Lunch',
                prepTime: '15 min',
                kcal: item.kcal,
                protein: item.protein,
                carbs: item.carbs,
                fats: item.fats,
                servings: 2,
                image: item.image,
                ingredients: [
                    { quantity: '200g', item: 'Grilled chicken breast' },
                    { quantity: '1 cup', item: 'Mixed vegetables' },
                    { quantity: '1/2 cup', item: 'Brown rice' },
                    { quantity: '2 tbsp', item: 'Olive oil' },
                    { quantity: '1 tbsp', item: 'Herbs and spices' },
                ],
                instructions: [
                    'Season chicken breast with herbs and spices.',
                    'Grill chicken until cooked through, about 6-8 minutes per side.',
                    'Steam mixed vegetables until tender.',
                    'Cook brown rice according to package instructions.',
                    'Serve chicken over rice with steamed vegetables.',
                    'Drizzle with olive oil and enjoy your power lunch!'
                ]
            }
        });
    }, [navigation]);

    const handleMealPress = useCallback((meal) => {
        navigation.navigate('MealDetails', {
            mealData: {
                id: meal.id,
                name: meal.mealName,
                category: 'Lunch',
                prepTime: meal.prepTime,
                kcal: meal.calories,
                protein: '25g',
                carbs: '30g', 
                fats: '15g',
                servings: 2,
                image: meal.imageUri,
                ingredients: [
                    { quantity: '1 cup', item: 'Main ingredient' },
                    { quantity: '2 tbsp', item: 'Seasoning' },
                    { quantity: '1/2 cup', item: 'Additional ingredients' },
                ],
                instructions: [
                    'Prepare all ingredients as specified.',
                    'Follow cooking instructions carefully.',
                    'Serve hot and enjoy your healthy meal.',
                ]
            }
        });
    }, [navigation]);

    // Optimized search result renderer
    const renderSearchResult = useCallback(({ item, index }) => {
        // Only render up to max limit
        if (index >= MAX_RESULT_ANIMATIONS) return null;
        
        const cardAnimation = animationRefs.resultCards[index];
        if (!cardAnimation) return null;

        return (
            <Animated.View
                key={item.id}
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
                    activeOpacity={0.85} // Slightly higher for better feedback
                >
                    <View style={styles.resultImageContainer}>
                        <View style={styles.resultImagePlaceholder} />
                    </View>
                    <View style={styles.resultInfo}>
                        <Text style={styles.resultTitle} numberOfLines={2}>
                            {item.mealName}
                        </Text>
                        <Text style={styles.resultMeta}>
                            {item.calories} • {item.prepTime}
                        </Text>
                        {item.tags && item.tags.length > 0 && (
                            <View style={styles.tagsContainer}>
                                {item.tags.slice(0, 2).map((tag, tagIndex) => (
                                    <View key={tagIndex} style={styles.tag}>
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        <Text style={styles.rating}>⭐ {item.rating}</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }, [animationRefs.resultCards, handleMealPress]);

    // Memoized render functions for better performance
    const renderEmptyState = useMemo(() => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🔍</Text>
            <Text style={styles.emptyStateTitle}>
                {searchState.query ? 'No lunch items found' : 'Start searching for lunch'}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
                {searchState.query
                    ? 'Try different keywords or browse our lunch categories'
                    : 'Type in the search box above to find delicious lunch meals'
                }
            </Text>
        </View>
    ), [searchState.query]);

    const renderLoadingState = useMemo(() => (
        <View style={styles.loadingSpinnerContainer}>
            <ActivityIndicator size="large" color="#FF6B35" />
            <Text style={styles.loadingText}>Searching for lunch...</Text>
        </View>
    ), []);

    const renderErrorState = useMemo(() => (
        <View style={styles.errorState}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorMessage}>{searchState.error}</Text>
            <TouchableOpacity
                style={styles.retryButton}
                onPress={() => performSearch(searchState.query)}
            >
                <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    ), [searchState.error, searchState.query, performSearch]);

    // Enhanced responsive styles with better organization
    const responsiveStyles = useMemo(() => ({
        contentSection: {
            backgroundColor: '#EDFDEE',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            paddingTop: 20,
            marginTop: -25,
            paddingBottom: 20,
            paddingHorizontal: responsiveConfig.horizontalPadding,
            flex: 1,
        },
        searchResults: {
            position: 'absolute',
            top: responsiveConfig.searchResultsTop,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: animationRefs.searchResultsOpacity,
            transform: [
                { translateY: animationRefs.searchResultsTranslateY },
                { scale: animationRefs.searchResultsScale }
            ],
            zIndex: searchState.isSearchMode ? 100 : -1,
            elevation: searchState.isSearchMode ? 100 : -1,
            pointerEvents: searchState.isSearchMode ? 'auto' : 'none',
            backgroundColor: '#EDFDEE',
        },
        mainContent: {
            opacity: animationRefs.contentOpacity,
            pointerEvents: searchState.isSearchMode ? 'none' : 'auto',
        },
    }), [responsiveConfig, animationRefs, searchState.isSearchMode]);

    // Lifecycle management
    useLayoutEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (searchState.isSearchMode) {
                exitSearchMode();
                return true;
            }
            return false;
        });

        return () => {
            backHandler.remove();
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchState.isSearchMode, exitSearchMode]);

    useEffect(() => {
        const unsubscribe = navigation?.addListener?.('focus', () => {
            const routes = navigation.getState()?.routes || [];
            const previousRoute = routes[routes.length - 2];
            
            if (previousRoute?.name !== 'MealDetails' && searchState.isSearchMode) {
                resetToMainScreen();
            }
        });

        return unsubscribe;
    }, [navigation, searchState.isSearchMode, resetToMainScreen]);

    return (
        <LunchWrapper>
            <StatusBar {...statusBarProps} />
            
            <View style={styles.backgroundSection}>
                <AfternoonScene />
            </View>
            
            <View style={responsiveStyles.contentSection}>
                <MemoizedHeaderSection />

                {/* Enhanced Promo Section with Toggle */}
                <View style={styles.promoSection}>
                    {promoState.showPromoCarousel ? (
                        <View style={styles.promoCarouselContainer}>
                            <MemoizedPromoCarousel
                                mealType="lunch" // Force lunch promos
                                userProfile={userProfile}
                                autoRotate={true}
                                rotationInterval={5000}
                                showControls={true}
                                showMealTypeSelector={false} // Hide meal type selector for focused lunch experience
                                onPromoPress={handlePromoPress}
                                onError={handlePromoError}
                                maxPromos={3} // Limit to 3 promos for better performance
                                style={styles.promoCarouselStyle}
                            />
                        </View>
                    ) : (
                        <View style={styles.promoFallbackContainer}>
                            {promoState.promoError ? (
                                <View style={styles.promoErrorContainer}>
                                    <Text style={styles.promoErrorText}>
                                        Promotions temporarily unavailable
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.promoToggleButton}
                                        onPress={togglePromoCarousel}
                                    >
                                        <Text style={styles.promoToggleText}>Try Again</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.promoSimpleContainer}>
                                    {/* Fallback to your original promo card */}
                                    <MemoizedPromoCard 
                                        title="Power Lunch"
                                        subtitle="High-energy meals for productive afternoons!"
                                        buttonText="Power Up"
                                        onPress={handlers.promoPress}
                                        imageSource="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=150&fit=crop"
                                    />
                                    
                                    <TouchableOpacity
                                        style={styles.promoToggleButton}
                                        onPress={togglePromoCarousel}
                                    >
                                        <Text style={styles.promoToggleText}>Show Smart Promos</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                </View>
                
                <View style={styles.inputSection}>
                    <MemoizedMealSearchInput 
                        placeholder="Search lunch, power meals, etc..."
                        value={searchState.query}
                        onChangeText={handleSearchChange}
                        onSubmitEditing={handleSearchSubmit}
                        autoFocus={false}
                    />
                </View>

                <Animated.View style={responsiveStyles.mainContent}>
                    <View style={styles.categoriesWrapper}>
                        <MemoizedNutritionCategories 
                            categories={[
                                { id: 1, name: 'Power', emoji: '⚡' },
                                { id: 2, name: 'Light', emoji: '🥗' },
                                { id: 3, name: 'Express', emoji: '🚀' },
                                { id: 4, name: 'Healthy', emoji: '🥬' },
                                { id: 5, name: 'Comfort', emoji: '🍲' },
                                { id: 6, name: 'Protein', emoji: '🥩' },
                            ]}
                            onCategoryPress={handlers.categoryPress}
                            onSeeAllPress={handlers.categorySeeAll}
                        />

                        <LinearGradient
                            colors={['#EDFDEE', 'rgba(237, 253, 238, 0.8)', 'rgba(237, 253, 238, 0.4)', 'transparent']}
                            locations={[0, 0.3, 0.7, 1]}
                            style={[styles.gradientOverlay, styles.leftGradient]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            pointerEvents="none"
                        />
                        
                        <LinearGradient
                            colors={['transparent', 'rgba(237, 253, 238, 0.4)', 'rgba(237, 253, 238, 0.8)', '#EDFDEE']}
                            locations={[0, 0.3, 0.7, 1]}
                            style={[styles.gradientOverlay, styles.rightGradient]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            pointerEvents="none"
                        />
                    </View>

                    <MemoizedFoodCardsGrid
                        onItemPress={handleFoodItemPress}
                        onSeeAllPress={handlers.foodCardsSeeAll}
                    />
                </Animated.View>

                <Animated.View style={responsiveStyles.searchResults}>
                    <View style={styles.searchContentContainer}>
                        {searchState.error ? (
                            renderErrorState
                        ) : searchState.isSearching ? (
                            renderLoadingState
                        ) : searchState.results.length > 0 ? (
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.resultsContainer}
                                scrollEventThrottle={16}
                                removeClippedSubviews
                                windowSize={10}
                                initialNumToRender={5}
                                maxToRenderPerBatch={5}
                                updateCellsBatchingPeriod={50}
                                getItemLayout={null}
                            >
                                {searchState.results.slice(0, MAX_RESULT_ANIMATIONS).map((item, index) => (
                                    <View key={item.id}>
                                        {renderSearchResult({ item, index })}
                                        {index < Math.min(searchState.results.length, MAX_RESULT_ANIMATIONS) - 1 && (
                                            <View style={styles.separator} />
                                        )}
                                    </View>
                                ))}
                            </ScrollView>
                        ) : (
                            renderEmptyState
                        )}
                    </View>
                </Animated.View>
            </View>
        </LunchWrapper>
    );
});

LunchScreen.displayName = 'LunchScreen';

export default LunchScreen;

// Optimized styles for maximum performance
const styles = StyleSheet.create({
    backgroundSection: {
        height: 200,
        width: '100%',
        overflow: 'hidden',
    },
    
    promoSection: {
        marginTop: 10,
        marginBottom: 5,
    },
    
    promoCarouselContainer: {
        position: 'relative',
    },
    promoCarouselStyle: {
        minHeight: 100,
        maxHeight: 200,
        marginHorizontal: -10,
    },
    promoToggleButton: {
        alignSelf: 'center',
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    promoToggleText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    promoFallbackContainer: {
        minHeight: 120,
    },
    promoErrorContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF8F0',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FFE4B5',
    },
    promoErrorText: {
        fontSize: 14,
        color: '#CC6600',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '500',
    },
    promoSimpleContainer: {
        position: 'relative',
    },
    inputSection: {
        paddingHorizontal: 5,
        marginBottom: 10,
    },
    categoriesWrapper: {
        position: 'relative',
        marginHorizontal: -12,
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 30,
        width: 60,
        zIndex: 10,
        pointerEvents: 'none',
    },
    leftGradient: {
        left: 0,
    },
    rightGradient: {
        right: 0,
    },
    searchContentContainer: {
        paddingHorizontal: 20,
        flex: 1,
    },
    resultsContainer: {
        paddingBottom: 100,
        paddingTop: 20,
    },
    resultCard: {
        marginBottom: 8,
    },
    resultCardContent: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.04)',
    },
    resultImageContainer: {
        width: 110,
        height: 110,
        borderRadius: 15,
        overflow: 'hidden',
        marginRight: 16,
        alignSelf: 'center',
        backgroundColor: '#F8F8F8',
    },
    resultImagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#E8F4FD',
    },
    resultInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
        lineHeight: 24,
    },
    resultMeta: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 8,
        fontWeight: '500',
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
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 26,
    },
    emptyStateSubtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 22,
    },
    loadingSpinnerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    loadingText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginTop: 16,
        fontWeight: '500',
    },
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
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 26,
    },
    errorMessage: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: '#FF6B35',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});