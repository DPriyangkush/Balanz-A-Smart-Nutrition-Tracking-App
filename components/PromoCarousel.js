// PromoCarousel.js - Fixed auto-rotation issues
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import EnhancedPromoCard from '../components/PromoCard';
import { promoManager, PROMO_CONFIG, SAMPLE_USER_PROFILES } from '../src/services/PromoDataManager';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 40;
const CARD_MARGIN = 10;

const PromoCarousel = ({
  mealType = null,
  userProfile = null,
  autoRotate = true,
  rotationInterval = PROMO_CONFIG.DEFAULT_ROTATION_INTERVAL,
  showControls = true,
  showMealTypeSelector = true,
  onPromoPress = null,
  style,
  maxPromos = PROMO_CONFIG.MAX_PROMOS_PER_MEAL,
}) => {
  // State management
  const [promos, setPromos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMealType, setCurrentMealType] = useState(mealType);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs
  const scrollViewRef = useRef(null);
  const rotationTimerRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const isUserInteracting = useRef(false); // Track user interaction
  const rotationPaused = useRef(false); // Track if rotation is paused

  // Auto-detect meal type based on current time
  useEffect(() => {
    if (!mealType) {
      const detectedMealType = promoManager.getCurrentMealType();
      setCurrentMealType(detectedMealType);
    }
  }, [mealType]);

  // Clear existing timer
  const clearRotationTimer = useCallback(() => {
    if (rotationTimerRef.current) {
      clearInterval(rotationTimerRef.current);
      rotationTimerRef.current = null;
    }
  }, []);

  // Start auto-rotation
  const startAutoRotation = useCallback(() => {
    if (!autoRotate || promos.length <= 1 || rotationPaused.current) {
      return;
    }

    clearRotationTimer();
    
    rotationTimerRef.current = setInterval(() => {
      if (!isUserInteracting.current && !rotationPaused.current) {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % promos.length;
          
          // Scroll to next promo with better error handling
          if (scrollViewRef.current) {
            try {
              scrollViewRef.current.scrollTo({
                x: nextIndex * (CARD_WIDTH + CARD_MARGIN * 2),
                animated: true
              });
            } catch (error) {
              console.warn('Scroll error:', error);
            }
          }
          
          return nextIndex;
        });
      }
    }, rotationInterval);
  }, [autoRotate, promos.length, rotationInterval, clearRotationTimer]);

  // Load promos
  const loadPromos = useCallback(async (forceRefresh = false) => {
    if (!currentMealType) return;

    try {
      setLoading(true);
      setError(null);
      
      const loadedPromos = await promoManager.getPromos(
        currentMealType, 
        userProfile,
        { forceRefresh, limit: maxPromos }
      );
      
      console.log(`Loaded ${loadedPromos.length} promos for ${currentMealType}`); // Debug log
      
      setPromos(loadedPromos);
      setCurrentIndex(0);
      
      // Track analytics
      promoManager.trackPromoView('carousel_loaded', currentMealType, {
        count: loadedPromos.length,
        userProfile: userProfile?.audience || ['general']
      });
      
    } catch (err) {
      setError(err.message);
      console.error('Error loading promos:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [currentMealType, userProfile, maxPromos]);

  // Initial load
  useEffect(() => {
    loadPromos();
  }, [loadPromos]);

  // Auto-rotation effect - Fixed to properly handle 2 items
  useEffect(() => {
    console.log(`Auto-rotation setup: autoRotate=${autoRotate}, promos.length=${promos.length}`); // Debug log
    
    if (!autoRotate || promos.length <= 1) {
      clearRotationTimer();
      return;
    }

    // Start rotation after a delay to ensure UI is ready
    const startTimer = setTimeout(() => {
      startAutoRotation();
    }, 1000);

    return () => {
      clearTimeout(startTimer);
      clearRotationTimer();
    };
  }, [autoRotate, promos.length, startAutoRotation, clearRotationTimer]);

  // Handle manual navigation - Fixed to restart auto-rotation properly
  const goToPromo = useCallback((index) => {
    if (index >= 0 && index < promos.length) {
      isUserInteracting.current = true;
      
      setCurrentIndex(index);
      
      if (scrollViewRef.current) {
        try {
          scrollViewRef.current.scrollTo({
            x: index * (CARD_WIDTH + CARD_MARGIN * 2),
            animated: true
          });
        } catch (error) {
          console.warn('Manual scroll error:', error);
        }
      }
      
      // Reset user interaction flag and restart auto-rotation after animation
      setTimeout(() => {
        isUserInteracting.current = false;
        if (autoRotate && promos.length > 1) {
          startAutoRotation();
        }
      }, 500); // Wait for scroll animation to complete
    }
  }, [promos.length, autoRotate, startAutoRotation]);

  // Handle scroll events - Fixed to properly track user interaction
  const handleScrollBegin = useCallback(() => {
    isUserInteracting.current = true;
    clearRotationTimer();
  }, [clearRotationTimer]);

  const handleScrollEnd = useCallback((event) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN * 2)
    );
    
    setCurrentIndex(newIndex);
    
    // Resume auto-rotation after user stops interacting
    setTimeout(() => {
      isUserInteracting.current = false;
      if (autoRotate && promos.length > 1) {
        startAutoRotation();
      }
    }, 2000); // Wait 2 seconds after user stops scrolling
  }, [autoRotate, promos.length, startAutoRotation]);

  // Handle promo press
  const handlePromoPress = useCallback((promo, index) => {
    // Pause auto-rotation when user interacts with a promo
    rotationPaused.current = true;
    clearRotationTimer();
    
    // Track click analytics
    promoManager.trackPromoClick(promo.id, currentMealType, {
      index,
      userProfile: userProfile?.audience || ['general']
    });

    // Call custom handler if provided
    if (onPromoPress) {
      onPromoPress(promo, index);
    } else {
      // Default action - show alert with promo details
      Alert.alert(
        promo.title,
        `${promo.subtitle}\n\n${promo.specialOffer || 'Tap to explore more!'}`,
        [
          { 
            text: 'Maybe Later', 
            style: 'cancel',
            onPress: () => {
              // Resume auto-rotation after alert
              setTimeout(() => {
                rotationPaused.current = false;
                if (autoRotate && promos.length > 1) {
                  startAutoRotation();
                }
              }, 500);
            }
          },
          { 
            text: promo.buttonText, 
            onPress: () => {
              console.log('Promo selected:', promo.id);
              // Resume auto-rotation after alert
              setTimeout(() => {
                rotationPaused.current = false;
                if (autoRotate && promos.length > 1) {
                  startAutoRotation();
                }
              }, 500);
            }
          }
        ]
      );
    }
  }, [currentMealType, userProfile, onPromoPress, autoRotate, promos.length, clearRotationTimer, startAutoRotation]);

  // Handle meal type change
  const changeMealType = useCallback((newMealType) => {
    if (newMealType !== currentMealType) {
      clearRotationTimer();
      setCurrentMealType(newMealType);
      
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Reload promos for new meal type
        loadPromos(true).then(() => {
          // Fade in animation
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      });
    }
  }, [currentMealType, clearRotationTimer, fadeAnim, loadPromos]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadPromos(true);
  }, [loadPromos]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRotationTimer();
    };
  }, [clearRotationTimer]);
  
  // Render meal type selector
  const renderMealTypeSelector = () => {
    if (!showMealTypeSelector) return null;

    const mealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'];
    
    return (
      <View style={styles.mealTypeSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mealTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.mealTypeButton,
                currentMealType === type && styles.activeMealTypeButton
              ]}
              onPress={() => changeMealType(type)}
            >
              <Text style={[
                styles.mealTypeText,
                currentMealType === type && styles.activeMealTypeText
              ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render loading state
  if (loading && promos.length === 0) {
    return (
      <View style={[styles.container, styles.centered, style]}>
        {renderMealTypeSelector()}
        <ActivityIndicator size="large" color="#FF9500" />
        <Text style={styles.loadingText}>Loading delicious promos...</Text>
      </View>
    );
  }

  // Render error state
  if (error && promos.length === 0) {
    return (
      <View style={[styles.container, styles.centered, style]}>
        {renderMealTypeSelector()}
        <Text style={styles.errorText}>Oops! {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => loadPromos(true)}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render empty state
  if (promos.length === 0) {
    return (
      <View style={[styles.container, styles.centered, style]}>
        {renderMealTypeSelector()}
        <Text style={styles.emptyText}>No promos available for {currentMealType}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, style, { opacity: fadeAnim }]}>
      {renderMealTypeSelector()}
      
      {/* Debug info - remove in production */}
      {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Promos: {promos.length} | Current: {currentIndex + 1} | Auto: {autoRotate ? 'ON' : 'OFF'}
          </Text>
        </View>
      )}

      {/* Promo Cards Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {promos.map((promo, index) => (
          <View key={`${promo.id}-${index}`} style={styles.cardContainer}>
            <EnhancedPromoCard
              promo={promo}
              onPress={() => handlePromoPress(promo, index)}
              animate={true}
            />
          </View>
        ))}
      </ScrollView>

      {/* Controls */}
      {showControls && promos.length > 1 && (
        <View style={styles.controls}>
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {promos.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index && styles.activeDot
                ]}
                onPress={() => goToPromo(index)}
              />
            ))}
          </View>

          {/* Navigation Arrows */}
          <View style={styles.navigation}>
            <TouchableOpacity
              style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
              onPress={() => goToPromo(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              <Text style={styles.navText}>‹</Text>
            </TouchableOpacity>
            
            <Text style={styles.indexText}>
              {currentIndex + 1} of {promos.length}
            </Text>
            
            <TouchableOpacity
              style={[styles.navButton, currentIndex === promos.length - 1 && styles.disabledButton]}
              onPress={() => goToPromo(currentIndex + 1)}
              disabled={currentIndex === promos.length - 1}
            >
              <Text style={styles.navText}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  mealTypeSelector: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  mealTypeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },

  activeMealTypeButton: {
    backgroundColor: '#FF9500',
  },

  mealTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },

  activeMealTypeText: {
    color: '#FFF',
  },

  debugInfo: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 8,
    margin: 10,
    borderRadius: 5,
  },

  debugText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },

  scrollContent: {
    paddingHorizontal: 10,
  },

  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
  },

  controls: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: '#FF9500',
    width: 20,
  },

  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: '#DDD',
  },

  navText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },

  indexText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },

  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },

  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FF9500',
    borderRadius: 20,
  },

  retryText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default PromoCarousel;