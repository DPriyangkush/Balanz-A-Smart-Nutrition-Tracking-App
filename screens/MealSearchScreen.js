import React, { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { YStack } from 'tamagui';
import { MealWrapper } from '../components/ScreenWrappers';
import MealSearchInput from '../components/MealSearchInput';

const MealSearchScreen = ({ route, navigation }) => {
  const { initialSearchQuery = '', animationDuration = 500 } = route?.params || {};
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  
  // Get screen dimensions
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isTablet = screenWidth >= 768;
  const isLargeScreen = screenWidth >= 1024;
  
  // Dynamic padding
  const horizontalPadding = Math.min(Math.max(screenWidth * 0.04, 16), 24);

  // Sample search results data
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

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: animationDuration * 0.8,
        delay: animationDuration * 0.2,
        useNativeDriver: true,
      }),
    ]).start();

    // If there's an initial search query, perform search
    if (initialSearchQuery) {
      performSearch(initialSearchQuery);
    }
  }, []);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const filteredResults = sampleSearchResults.filter(meal =>
        meal.mealName.toLowerCase().includes(query.toLowerCase()) ||
        meal.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filteredResults);
      setIsLoading(false);
    }, 800);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    
    // Debounced search
    clearTimeout(searchTimeout);
    const searchTimeout = setTimeout(() => {
      performSearch(text);
    }, 300);
  };

  const handleSearchSubmit = () => {
    performSearch(searchQuery);
  };

  const handleBackPress = () => {
    // Animate out before navigation
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: animationDuration * 0.7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: animationDuration * 0.5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.goBack();
    });
  };

  const renderSearchResult = ({ item, index }) => (
    <Animated.View 
      style={[
        styles.resultCard,
        {
          transform: [{
            translateY: fadeAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            })
          }],
          opacity: fadeAnimation,
        }
      ]}
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
    </Animated.View>
  );

  const renderEmptyState = () => (
    <Animated.View 
      style={[
        styles.emptyState,
        {
          opacity: fadeAnimation,
          transform: [{
            translateY: fadeAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })
          }]
        }
      ]}
    >
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
    </Animated.View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingSpinnerContainer}>
      <ActivityIndicator 
        size="large" 
        color="#FF6B35" 
        style={styles.loadingSpinner}
      />
      <Text style={styles.loadingText}>Searching for meals...</Text>
    </View>
  );

  // Dynamic styles
  const responsiveStyles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: horizontalPadding,
      maxWidth: isLargeScreen ? 1200 : '100%',
      alignSelf: 'center',
    },
    searchContainer: {
      paddingTop: isTablet ? 20 : 10,
      paddingBottom: 16,
      transform: [{
        translateY: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [screenHeight * 0.3, 0], // Slide up from middle of screen
        })
      }],
    },
    contentContainer: {
      flex: 1,
      opacity: fadeAnimation,
      transform: [{
        translateY: fadeAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        })
      }],
    },
  });

  return (
    <MealWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        <View style={responsiveStyles.container}>
          {/* Animated Search Input */}
          <Animated.View style={responsiveStyles.searchContainer}>
            <MealSearchInput
              placeholder="Search for meals..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              onSubmitEditing={handleSearchSubmit}
              onBackPress={handleBackPress}
              showBackButton={true}
              autoFocus={!initialSearchQuery}
            />
          </Animated.View>

          {/* Search Results */}
          <Animated.View style={responsiveStyles.contentContainer}>
            {isLoading ? (
              renderLoadingState()
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
              renderEmptyState()
            )}
          </Animated.View>
        </View>
      </SafeAreaView>
    </MealWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E8',
  },
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

export default MealSearchScreen;