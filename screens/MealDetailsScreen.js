// MealDetailsScreen.js
import React, { memo, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

// Animation configuration
const ANIMATION_CONFIG = {
  stagger: 100,
  duration: 350,
  springConfig: {
    damping: 18,
    stiffness: 180,
    mass: 0.9,
  },
  timingConfig: {
    duration: 350,
    easing: Easing.out(Easing.quad),
  },
};

/** 🔹 Fade-in animation component */
const FadeInItem = memo(({ 
  children, 
  index = 0, 
  useSpring = false, 
  delay: customDelay
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    const delay = customDelay ?? index * ANIMATION_CONFIG.stagger;
    
    if (useSpring) {
      opacity.value = withDelay(delay, withSpring(1, ANIMATION_CONFIG.springConfig));
      translateY.value = withDelay(delay, withSpring(0, ANIMATION_CONFIG.springConfig));
      scale.value = withDelay(delay, withSpring(1, ANIMATION_CONFIG.springConfig));
    } else {
      opacity.value = withDelay(delay, withTiming(1, ANIMATION_CONFIG.timingConfig));
      translateY.value = withDelay(delay, withTiming(0, ANIMATION_CONFIG.timingConfig));
      scale.value = withDelay(delay, withTiming(1, ANIMATION_CONFIG.timingConfig));
    }
  }, [index, useSpring, customDelay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
});

FadeInItem.displayName = 'FadeInItem';

/** 🔹 Animated progress bar */
const ProgressBar = memo(({ delay = 0 }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      progress.value = withTiming(1, { 
        duration: 1000, 
        easing: Easing.out(Easing.cubic) 
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>
    </View>
  );
});

ProgressBar.displayName = 'ProgressBar';

/** 🔹 Static header component */
const StaticHeader = memo(({ meal, responsiveConfig, onBackPress }) => {
  return (
    <View style={[styles.imageSection, { height: responsiveConfig.imageHeight }]}>
      <Image 
        source={{ uri: meal.image }} 
        style={styles.mealImage} 
        resizeMode="cover"
        fadeDuration={200}
      />

      <View style={styles.headerOverlay}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBackPress} 
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="thumbs-up-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="thumbs-down-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
        style={styles.imageGradient}
        locations={[0, 0.7, 1]}
      />
    </View>
  );
});

StaticHeader.displayName = 'StaticHeader';

const MealDetailsScreen = memo(({ route, navigation }) => {
  const { mealData } = route.params || {};

  const defaultMeal = useMemo(() => ({
    id: 1,
    name: 'Oatmeal Porridge',
    category: 'Breakfast',
    prepTime: '5 min',
    kcal: '340 Kcal',
    protein: '3g',
    carbs: '35g',
    fats: '14g',
    servings: 2,
    image: 'https://images.unsplash.com/photo-1571197119282-7c4a5ef5b7ac?w=400&h=300&fit=crop',
    ingredients: [
      { quantity: '1 u.', item: 'Piece(s) avocado' },
      { quantity: '1 u.', item: 'Tablespoon(s) extra virgin olive oil' },
      { quantity: '1 u.', item: 'Tablespoon(s) balsamic vinegar' },
      { quantity: '1 u.', item: 'Pinch(es) salt' },
    ],
    instructions: [
      'Heat water in a medium saucepan and bring to a boil.',
      'Add oats and reduce heat to medium-low. Cook for 5 minutes.',
      'Stir in your favorite toppings and serve hot.',
      'Garnish with fresh fruits and nuts if desired.',
    ],
  }), []);

  const meal = useMemo(() => mealData || defaultMeal, [mealData, defaultMeal]);

  const responsiveConfig = useMemo(() => {
    const isTablet = screenWidth >= 768;
    return {
      isTablet,
      imageHeight: isTablet ? 350 : 280,
      horizontalPadding: Math.min(Math.max(screenWidth * 0.05, 20), 28),
    };
  }, []);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleLogMeal = useCallback(() => {
    console.log('Logging meal:', meal.name);
  }, [meal.name]);

  const macroData = useMemo(() => [
    { value: meal.protein, label: 'Protein', key: 'protein' },
    { value: meal.carbs, label: 'Carbs', key: 'carbs' },
    { value: meal.fats, label: 'Fat', key: 'fats' },
  ], [meal.protein, meal.carbs, meal.fats]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent 
      />

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={Platform.OS === 'ios'}
        removeClippedSubviews={Platform.OS === 'android'}
      >
        <StaticHeader
          meal={meal}
          responsiveConfig={responsiveConfig}
          onBackPress={handleBackPress}
        />

        <View style={[
          styles.contentSection, 
          { paddingHorizontal: responsiveConfig.horizontalPadding }
        ]}>
          <FadeInItem index={0}>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>{meal.category}</Text>
            </View>
          </FadeInItem>

          <FadeInItem index={1}>
            <Text style={styles.mealTitle}>{meal.name}</Text>
          </FadeInItem>

          <FadeInItem index={2}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={16} color="#9b59b6" />
                <Text style={styles.infoText}>{meal.prepTime}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="flame-outline" size={16} color="red" />
                <Text style={styles.infoText}>{meal.kcal}</Text>
              </View>
            </View>
          </FadeInItem>

          <FadeInItem index={3} useSpring>
            <View style={styles.macrosContainer}>
              {macroData.map((macro) => (
                <View key={macro.key} style={styles.macroItem}>
                  <Text style={styles.macroValue}>{macro.value}</Text>
                  <Text style={styles.macroLabel}>{macro.label}</Text>
                </View>
              ))}
            </View>
          </FadeInItem>

          <FadeInItem index={4} useSpring>
            <View style={styles.LogContainer}>
              <TouchableOpacity onPress={handleLogMeal} activeOpacity={0.8}>
                <Text style={styles.LogText}>Log Meal</Text>
              </TouchableOpacity>
            </View>
          </FadeInItem>

          <FadeInItem index={5}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <Text style={styles.servingsText}>{meal.servings} serves</Text>
              </View>

              <ProgressBar delay={500} />

              <View style={styles.ingredientsList}>
                {meal.ingredients.map((ingredient, index) => (
                  <FadeInItem key={`ingredient-${index}`} index={6 + index}>
                    <View style={styles.ingredientItem}>
                      <Text style={styles.ingredientQuantity}>{ingredient.quantity}</Text>
                      <Text style={styles.ingredientName}>{ingredient.item}</Text>
                    </View>
                  </FadeInItem>
                ))}
              </View>
            </View>
          </FadeInItem>

          <FadeInItem index={10}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Meal Preparation</Text>

              <ProgressBar delay={1000} />

              {meal.instructions && (
                <View style={styles.instructionsList}>
                  {meal.instructions.map((instruction, index) => (
                    <FadeInItem key={`instruction-${index}`} index={11 + index}>
                      <View style={styles.instructionItem}>
                        <Text style={styles.instructionNumber}>{index + 1}.</Text>
                        <Text style={styles.instructionText}>{instruction}</Text>
                      </View>
                    </FadeInItem>
                  ))}
                </View>
              )}
            </View>
          </FadeInItem>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

MealDetailsScreen.displayName = 'MealDetailsScreen';

export default MealDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
  },
  imageSection: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  contentSection: {
    backgroundColor: '#FFF8E8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  categoryContainer: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#9b59b6',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  mealTitle: {
    fontSize: 28,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#1e1e1e',
    marginBottom: 16,
    lineHeight: 34,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
    alignSelf: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1e1e1e',
    borderRadius: 35,
    paddingVertical: 20,
    marginBottom: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#EDFDEE',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  LogContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1e1e1e',
    borderRadius: 35,
    paddingVertical: 20,
    marginHorizontal: 100,
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  LogText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    marginBottom: 28,
    paddingHorizontal: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#1e1e1e',
  },
  servingsText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  ingredientQuantity: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
    width: 60,
  },
  ingredientName: {
    fontSize: 14,
    color: '#1e1e1e',
    fontWeight: '400',
    flex: 1,
  },
  progressContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1e1e1e',
    borderRadius: 2,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  instructionNumber: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    width: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#1e1e1e',
    lineHeight: 20,
    flex: 1,
  },
  bottomSpacing: {
    height: 40,
  },
});