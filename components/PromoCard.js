// EnhancedPromoCard.js - Production Optimized with Smooth Animations
import React, { useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const EnhancedPromoCard = ({
  promo,
  onPress,
  style,
  animate = true,
}) => {
  // Animation refs
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Memoized promo data extraction for performance
  const promoData = useMemo(() => {
    if (!promo) return null;

    const {
      title,
      subtitle,
      buttonText,
      imageSource,
      theme = {},
      discount,
      badge,
      ratings,
      orderCount,
    } = promo;

    return {
      title,
      subtitle,
      buttonText,
      imageSource,
      discount,
      badge,
      ratings,
      orderCount,
      backgroundColor: theme.backgroundColor || '#1e1e1e',
      primaryColor: theme.primaryColor || '#333',
      accentColor: theme.accentColor || '#EDFDEE',
    };
  }, [promo]);

  // Initialize enter animation
  React.useEffect(() => {
    if (animate && promoData) {
      // Stagger the entrance animation
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animate, promoData, slideAnim, opacityAnim]);

  // Enhanced press handlers with smooth animations
  const handlePressIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const handlePress = useCallback(() => {
    // Quick feedback animation before calling onPress
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        tension: 500,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 500,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onPress) onPress();
    });
  }, [scaleAnim, onPress]);

  // Memoized dynamic styles for performance
  const dynamicStyles = useMemo(() => {
    if (!promoData) return {};

    return {
      container: {
        transform: [
          { scale: scaleAnim },
          { 
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })
          }
        ],
        opacity: opacityAnim,
      },
      badge: {
        backgroundColor: promoData.primaryColor,
      },
      badgeText: {
        color: promoData.accentColor,
      },
      button: {
        backgroundColor: promoData.accentColor,
        shadowColor: promoData.primaryColor,
      },
      buttonText: {
        color: promoData.primaryColor,
      },
    };
  }, [promoData, scaleAnim, slideAnim, opacityAnim]);

  if (!promoData) return null;

  return (
    <Animated.View style={[styles.container, style, dynamicStyles.container]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={1}
        style={styles.touchable}
      >
        <ImageBackground
          source={{ uri: promoData.imageSource }}
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
          // Performance optimization for images
          loadingIndicatorSource={require('../assets/placeholder.png')}
        >
          {/* Gradient overlay for better text readability */}
          <View style={styles.gradientOverlay} />

          {/* Badge */}
          {promoData.badge && (
            <Animated.View 
              style={[
                styles.badge,
                dynamicStyles.badge,
                {
                  opacity: opacityAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0],
                      })
                    }
                  ]
                }
              ]}
            >
              <Text style={[styles.badgeText, dynamicStyles.badgeText]} numberOfLines={1}>
                {promoData.badge}
              </Text>
            </Animated.View>
          )}

          {/* Discount Badge */}
          {promoData.discount && (
            <Animated.View 
              style={[
                styles.discountBadge,
                {
                  opacity: opacityAnim,
                  transform: [
                    {
                      translateX: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      })
                    }
                  ]
                }
              ]}
            >
              <Text style={styles.discountText}>{promoData.discount}</Text>
              <Text style={styles.discountLabel}>OFF</Text>
            </Animated.View>
          )}

          {/* Main Content */}
          <View style={styles.content}>
            <Animated.View 
              style={[
                styles.textSection,
                {
                  opacity: opacityAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      })
                    }
                  ]
                }
              ]}
            >
              {/* Title with enhanced typography */}
              <Text style={styles.title} numberOfLines={2}>
                {promoData.title}
              </Text>

              {/* Subtitle */}
              <Text style={styles.subtitle} numberOfLines={2}>
                {promoData.subtitle}
              </Text>

              {/* Stats Row */}
              {(promoData.ratings || promoData.orderCount) && (
                <View style={styles.statsRow}>
                  {promoData.ratings && (
                    <View style={styles.statItem}>
                      <Text style={styles.ratingText}>★ {promoData.ratings}</Text>
                    </View>
                  )}
                  {promoData.orderCount && (
                    <View style={styles.statItem}>
                      <Text style={styles.orderText}>{promoData.orderCount}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Enhanced Action Button */}
              <Animated.View
                style={[
                  styles.button,
                  dynamicStyles.button,
                  {
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [15, 0],
                        })
                      }
                    ]
                  }
                ]}
              >
                <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
                  {promoData.buttonText}
                </Text>
                <Animated.Text 
                  style={[
                    styles.arrow, 
                    dynamicStyles.buttonText,
                    {
                      transform: [
                        {
                          translateX: scaleAnim.interpolate({
                            inputRange: [0.96, 1],
                            outputRange: [2, 0],
                            extrapolate: 'clamp',
                          })
                        }
                      ]
                    }
                  ]}
                >
                  →
                </Animated.Text>
              </Animated.View>
            </Animated.View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    marginHorizontal: 5,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    minHeight: 180,
    backgroundColor: '#FFF',
  },

  touchable: {
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
    width: '100%',
    minHeight: 180,
    justifyContent: 'space-between',
  },

  imageStyle: {
    borderRadius: 25,
  },

  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
  },

  badge: {
    position: 'absolute',
    top: 15,
    left: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  discountBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#FF4757',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  discountText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    lineHeight: 18,
  },

  discountLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFF',
    marginTop: -2,
  },

  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },

  textSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 14,
    color: '#E8E8E8',
    marginBottom: 12,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 15,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  orderText: {
    fontSize: 11,
    color: '#E0E0E0',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  button: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    minWidth: 130,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
    letterSpacing: 0.3,
  },

  arrow: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EnhancedPromoCard;