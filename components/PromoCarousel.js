// PromoCarousel.js - Updated to better utilize PromoDataManager weekend data
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  PanResponder,
} from 'react-native';
import EnhancedPromoCard from '../components/PromoCard';
import { promoManager, PROMO_CONFIG } from '../src/services/PromoDataManager';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 40;
const CARD_MARGIN = 10;
const SNAP_THRESHOLD = 0.3;

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
  debugMode = false,
}) => {
  // State management
  const [promos, setPromos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMealType, setCurrentMealType] = useState(mealType);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Animation refs
  const scrollViewRef = useRef(null);
  const rotationTimerRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const isUserInteracting = useRef(false);
  const rotationPaused = useRef(false);

  // Performance optimization: Memoize expensive calculations
  const cardTotalWidth = useMemo(() => CARD_WIDTH + CARD_MARGIN * 2, []);
  
  const mealTypes = useMemo(() => ['breakfast', 'lunch', 'snacks', 'dinner'], []);

  const debugLog = useCallback((message, data = null) => {
    if (debugMode) {
      console.log(`[PromoCarousel][${new Date().toLocaleTimeString()}] ${message}`, data || '');
    }
  }, [debugMode]);

  // Auto-detect meal type
  useEffect(() => {
    if (!mealType) {
      const detectedMealType = promoManager.getCurrentMealType();
      setCurrentMealType(detectedMealType);
      debugLog('Auto-detected meal type:', detectedMealType);
    }
  }, [mealType, debugLog]);

  // Enhanced auto-rotation with smooth animations
  const clearRotationTimer = useCallback(() => {
    if (rotationTimerRef.current) {
      clearInterval(rotationTimerRef.current);
      rotationTimerRef.current = null;
      debugLog('Rotation timer cleared');
    }
  }, [debugLog]);

  const startAutoRotation = useCallback(() => {
    if (!autoRotate || promos.length <= 1 || rotationPaused.current) {
      debugLog('Auto-rotation conditions not met');
      return;
    }

    clearRotationTimer();
    
    rotationTimerRef.current = setInterval(() => {
      if (!isUserInteracting.current && !rotationPaused.current) {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % promos.length;
          
          // Smooth scroll with enhanced easing
          if (scrollViewRef.current) {
            try {
              scrollViewRef.current.scrollTo({
                x: nextIndex * cardTotalWidth,
                animated: true
              });
            } catch (error) {
              debugLog('Scroll error:', error.message);
            }
          }
          
          debugLog('Auto-rotating', { from: prevIndex, to: nextIndex });
          return nextIndex;
        });
      }
    }, rotationInterval);

    debugLog('Auto-rotation started');
  }, [autoRotate, promos.length, rotationInterval, clearRotationTimer, debugLog, cardTotalWidth]);

  // Enhanced promo loading with better data manager utilization
  const loadPromos = useCallback(async (forceRefresh = false) => {
    if (!currentMealType) return;

    try {
      setLoading(true);
      setError(null);
      
      // Animate loading state
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.6,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();

      debugLog('Loading promos', { mealType: currentMealType, forceRefresh });
      
      // Clear cache if force refresh or if we don't have enough promos
      if (forceRefresh || promos.length < 2) {
        await promoManager.clearCache();
        debugLog('Cache cleared');
      }
      
      // First attempt: Get promos with fresh data
      let loadedPromos = await promoManager.getPromos(
        currentMealType, 
        userProfile,
        { forceRefresh: true, limit: maxPromos }
      );

      debugLog('Initial promos loaded:', { count: loadedPromos.length, ids: loadedPromos.map(p => p.id) });

      // Enhanced fallback strategy 1: Try weekend mode if we don't have enough promos
      if (loadedPromos.length < 2) {
        debugLog('Not enough promos, trying weekend fallback');
        try {
          promoManager.forceWeekendMode(true);
          const weekendPromos = await promoManager.getPromos(
            currentMealType,
            userProfile,
            { forceRefresh: true, limit: maxPromos }
          );
          promoManager.forceWeekendMode(false);
          
          debugLog('Weekend fallback promos:', { count: weekendPromos.length, ids: weekendPromos.map(p => p.id) });
          
          // Merge promos avoiding duplicates
          const combinedPromos = [...loadedPromos];
          weekendPromos.forEach(promo => {
            if (!combinedPromos.find(p => p.id === promo.id)) {
              combinedPromos.push(promo);
            }
          });
          loadedPromos = combinedPromos;
          debugLog('After weekend fallback merge:', { count: loadedPromos.length });
        } catch (fallbackError) {
          debugLog('Weekend fallback failed:', fallbackError.message);
        }
      }

      // Enhanced fallback strategy 2: Try other meal types with adaptation
      if (loadedPromos.length < 2) {
        debugLog('Still not enough promos, trying cross-meal fallback');
        const otherMealTypes = mealTypes.filter(type => type !== currentMealType);
        
        for (const otherMealType of otherMealTypes) {
          if (loadedPromos.length >= maxPromos) break;
          
          try {
            const otherPromos = await promoManager.getPromos(
              otherMealType,
              userProfile,
              { forceRefresh: true, limit: 3 }
            );
            
            debugLog(`${otherMealType} fallback promos:`, { count: otherPromos.length, ids: otherPromos.map(p => p.id) });
            
            otherPromos.forEach(promo => {
              if (!loadedPromos.find(p => p.id === promo.id) && loadedPromos.length < maxPromos) {
                // Adapt the promo for current meal type
                const adaptedPromo = {
                  ...promo,
                  id: `${promo.id}_adapted_${currentMealType}`,
                  subtitle: `Perfect for your ${currentMealType}! ${promo.subtitle}`,
                  badge: promo.badge ? `${promo.badge} (${currentMealType.toUpperCase()})` : `${currentMealType.toUpperCase()} SPECIAL`
                };
                loadedPromos.push(adaptedPromo);
                debugLog(`Adapted ${promo.id} for ${currentMealType}`);
              }
            });
          } catch (otherMealError) {
            debugLog(`${otherMealType} fallback failed:`, otherMealError.message);
          }
        }
        debugLog('After cross-meal fallback:', { count: loadedPromos.length });
      }

      // Minimal synthetic promos fallback (only if absolutely necessary)
      if (loadedPromos.length === 0) {
        debugLog('No promos found, creating minimal emergency fallback');
        const emergencyPromos = [
          {
            id: `emergency_${currentMealType}_1`,
            title: "Daily Special",
            subtitle: `Something delicious is waiting for you in our ${currentMealType} menu!`,
            buttonText: "Explore",
            imageSource: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=300&h=200&fit=crop',
            discount: '20%',
            category: 'emergency',
            priority: 1,
            badge: 'SPECIAL',
            theme: {
              backgroundColor: PROMO_CONFIG.MEAL_THEMES[currentMealType]?.backgroundColor || '#1e1e1e',
              primaryColor: PROMO_CONFIG.MEAL_THEMES[currentMealType]?.primaryColor || '#333',
              accentColor: PROMO_CONFIG.MEAL_THEMES[currentMealType]?.accentColor || '#EDFDEE',
            }
          },
        ];
        
        loadedPromos = emergencyPromos;
        debugLog('Emergency fallback applied:', { count: loadedPromos.length });
      } else if (loadedPromos.length === 1) {
        // Add one more emergency promo to ensure carousel works
        debugLog('Adding one more promo for carousel functionality');
        const secondPromo = {
          id: `emergency_${currentMealType}_second`,
          title: "Chef's Choice",
          subtitle: `Our chef recommends these amazing ${currentMealType} dishes!`,
          buttonText: "Try Now",
          imageSource: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
          discount: '15%',
          category: 'emergency',
          priority: 2,
          badge: "CHEF'S PICK",
          theme: {
            backgroundColor: PROMO_CONFIG.MEAL_THEMES[currentMealType]?.backgroundColor || '#1e1e1e',
            primaryColor: PROMO_CONFIG.MEAL_THEMES[currentMealType]?.primaryColor || '#333',
            accentColor: PROMO_CONFIG.MEAL_THEMES[currentMealType]?.accentColor || '#EDFDEE',
          }
        };
        loadedPromos.push(secondPromo);
      }

      setPromos(loadedPromos);
      setCurrentIndex(0);
      
      // Animate content in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start();

      debugLog('Final promos loaded successfully:', { 
        count: loadedPromos.length, 
        fromDataManager: loadedPromos.filter(p => !p.id.includes('emergency')).length,
        emergency: loadedPromos.filter(p => p.id.includes('emergency')).length
      });
      
    } catch (err) {
      setError(err.message);
      debugLog('Error loading promos:', err.message);
      
      // Simplified emergency fallback with smooth animation
      const emergencyPromos = [
        {
          id: 'emergency_fallback_1',
          title: "Daily Special",
          subtitle: "Something delicious is waiting for you!",
          buttonText: "Explore",
          imageSource: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=300&h=200&fit=crop',
          discount: '20%',
          category: 'emergency',
          priority: 1,
          badge: 'SPECIAL',
          theme: {
            backgroundColor: PROMO_CONFIG.MEAL_THEMES[currentMealType]?.backgroundColor || '#1e1e1e',
            primaryColor: PROMO_CONFIG.MEAL_THEMES[currentMealType]?.primaryColor || '#333',
            accentColor: PROMO_CONFIG.MEAL_THEMES[currentMealType]?.accentColor || '#EDFDEE',
          }
        },
        {
          id: 'emergency_fallback_2',
          title: "Chef's Choice",
          subtitle: "Our chef recommends these amazing dishes!",
          buttonText: "Try Now",
          imageSource: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
          discount: '15%',
          category: 'emergency',
          priority: 2,
          badge: "CHEF'S PICK",
          theme: {
            backgroundColor: PROMO_CONFIG.MEAL_THEMES[currentMealType]?.backgroundColor || '#1e1e1e',
            primaryColor: PROMO_CONFIG.MEAL_THEMES[currentMealType]?.primaryColor || '#333',
            accentColor: PROMO_CONFIG.MEAL_THEMES[currentMealType]?.accentColor || '#EDFDEE',
          }
        }
      ];
      
      setPromos(emergencyPromos);
      
      // Animate error recovery
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
      
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [currentMealType, userProfile, maxPromos, promos.length, debugLog, mealTypes, fadeAnim, scaleAnim, slideAnim]);

  // Auto-rotation effect
  useEffect(() => {
    loadPromos();
  }, [loadPromos]);

  useEffect(() => {
    if (!autoRotate || promos.length <= 1) {
      clearRotationTimer();
      return;
    }

    const startTimer = setTimeout(() => {
      startAutoRotation();
    }, 1000);

    return () => {
      clearTimeout(startTimer);
      clearRotationTimer();
    };
  }, [autoRotate, promos.length, startAutoRotation, clearRotationTimer]);

  // Enhanced navigation with smooth animations
  const goToPromo = useCallback((index) => {
    if (index >= 0 && index < promos.length && index !== currentIndex) {
      isUserInteracting.current = true;
      
      // Smooth transition animation
      Animated.timing(slideAnim, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
      
      setCurrentIndex(index);
      
      if (scrollViewRef.current) {
        try {
          scrollViewRef.current.scrollTo({
            x: index * cardTotalWidth,
            animated: true
          });
        } catch (error) {
          debugLog('Manual scroll error:', error.message);
        }
      }
      
      setTimeout(() => {
        isUserInteracting.current = false;
        if (autoRotate && promos.length > 1) {
          startAutoRotation();
        }
      }, 500);
    }
  }, [promos.length, currentIndex, autoRotate, startAutoRotation, debugLog, cardTotalWidth, slideAnim]);

  // Enhanced scroll handling
  const handleScrollBegin = useCallback(() => {
    isUserInteracting.current = true;
    clearRotationTimer();
    debugLog('User scroll begin');
  }, [clearRotationTimer, debugLog]);

  const handleScrollEnd = useCallback((event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / cardTotalWidth);
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(Math.max(0, Math.min(newIndex, promos.length - 1)));
    }
    
    setTimeout(() => {
      isUserInteracting.current = false;
      if (autoRotate && promos.length > 1) {
        startAutoRotation();
      }
    }, 2000);
  }, [autoRotate, promos.length, startAutoRotation, debugLog, cardTotalWidth, currentIndex]);

  // Enhanced promo press handling
  const handlePromoPress = useCallback((promo, index) => {
    rotationPaused.current = true;
    clearRotationTimer();
    
    // Press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
    
    if (onPromoPress) {
      onPromoPress(promo, index);
    } else {
      Alert.alert(
        promo.title,
        `${promo.subtitle}\n\n${promo.specialOffer || 'Tap to explore more!'}`,
        [
          { 
            text: 'Maybe Later', 
            style: 'cancel',
            onPress: () => {
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
  }, [clearRotationTimer, startAutoRotation, onPromoPress, autoRotate, promos.length, scaleAnim]);

  // Enhanced meal type change with smooth transitions
  const changeMealType = useCallback((newMealType) => {
    if (newMealType !== currentMealType) {
      clearRotationTimer();
      
      // Smooth transition out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start(() => {
        setCurrentMealType(newMealType);
        loadPromos(true);
      });
    }
  }, [currentMealType, clearRotationTimer, fadeAnim, slideAnim, loadPromos]);

  // Meal type selector with smooth animations
  const renderMealTypeSelector = () => {
    if (!showMealTypeSelector) return null;

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
              activeOpacity={0.8}
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

  // Cleanup
  useEffect(() => {
    return () => clearRotationTimer();
  }, [clearRotationTimer]);

  // Loading state
  if (loading && promos.length === 0) {
    return (
      <View style={[styles.container, styles.centered, style]}>
        {renderMealTypeSelector()}
        <ActivityIndicator size="large" color="#FF9500" />
        <Text style={styles.loadingText}>Loading delicious promos...</Text>
      </View>
    );
  }

  // Error state
  if (error && promos.length === 0) {
    return (
      <View style={[styles.container, styles.centered, style]}>
        {renderMealTypeSelector()}
        <Text style={styles.errorText}>Oops! {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => loadPromos(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty state
  if (promos.length === 0) {
    return (
      <View style={[styles.container, styles.centered, style]}>
        {renderMealTypeSelector()}
        <Text style={styles.emptyText}>No promos available for {currentMealType}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => loadPromos(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.retryText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        style, 
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      {renderMealTypeSelector()}

      {/* Enhanced Promo Cards Carousel */}
      <Animated.View
        style={{
          transform: [{ 
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })
          }]
        }}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardTotalWidth}
          decelerationRate="fast"
          contentContainerStyle={styles.scrollContent}
          onScrollBeginDrag={handleScrollBegin}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
          bounces={true}
          bouncesZoom={false}
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
      </Animated.View>

      {/* Enhanced Controls */}
      {showControls && promos.length > 1 && (
        <View style={styles.controls}>
          <View style={styles.pagination}>
            {promos.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index && styles.activeDot
                ]}
                onPress={() => goToPromo(index)}
                activeOpacity={0.8}
              />
            ))}
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

  scrollContent: {
    paddingHorizontal: 10,
  },

  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
  },

  controls: {
    paddingHorizontal: 10,
    marginTop: -40,
    backgroundColor: 'transparent',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
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