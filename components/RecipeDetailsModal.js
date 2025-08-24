// RecipeDetailModal.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  FadeIn,
  FadeOut,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import LogButton from './LogButton'; // Import the LogButton component

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const INITIAL_HEIGHT = screenHeight * 0.6; // 60% of screen height
const FULL_HEIGHT = screenHeight * 0.9; // 90% of screen height (almost full screen)

// Animated components
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);

// Recipe Detail Tabs Component (simplified version)
const RecipeDetailTabs = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef(null);
  const tabRefs = useRef([]);

  const pillLeft = useSharedValue(0);
  const pillWidth = useSharedValue(0);

  const tabs = ["Guidance", "Ingredients"];

  const updatePillPosition = (index) => {
    if (tabRefs.current[index] && containerRef.current) {
      tabRefs.current[index].measureLayout(
        containerRef.current,
        (left, top, width) => {
          pillLeft.value = withTiming(left, {
            duration: 300,
            easing: Easing.out(Easing.ease),
          });
          pillWidth.value = withTiming(width, {
            duration: 300,
            easing: Easing.out(Easing.ease),
          });
        },
        () => console.log("Measurement failed")
      );
    }
  };

  useEffect(() => {
    setTimeout(() => updatePillPosition(activeTab), 50);
  }, []);

  const handlePress = (index) => {
    setActiveTab(index);
    onTabChange && onTabChange(index);
    updatePillPosition(index);
  };

  const animatedPillStyle = useAnimatedStyle(() => {
    return {
      left: pillLeft.value,
      width: pillWidth.value,
    };
  });

  return (
    <View style={tabStyles.wrapper}>
      <View ref={containerRef} style={tabStyles.tabsContainer}>
        <Animated.View style={[tabStyles.pill, animatedPillStyle]}>
          <LinearGradient
            colors={["#FF8A50", "#FF6B35"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={tabStyles.gradient}
          />
        </Animated.View>

        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            ref={(el) => (tabRefs.current[index] = el)}
            onPress={() => handlePress(index)}
            style={tabStyles.tabItem}
            activeOpacity={0.8}
          >
            <Text
              style={[
                tabStyles.tabText,
                activeTab === index && tabStyles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Main Modal Component with enhanced animations
const RecipeDetailModal = ({ visible, recipe, onClose, onLogProgress }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  
  const modalHeight = useSharedValue(INITIAL_HEIGHT);
  const modalTranslateY = useSharedValue(screenHeight);
  const modalOpacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  // Pan gesture for dragging the modal - ONLY on drag handle
  const startHeight = useSharedValue(INITIAL_HEIGHT);
  const isDragging = useSharedValue(false);

  // Fixed pan gesture - only responds to touches in the drag handle area
  const panGesture = Gesture.Pan()
    .onStart((event) => {
      'worklet';
      isDragging.value = true;
      startHeight.value = modalHeight.value;
    })
    .onUpdate((event) => {
      'worklet';
      // Calculate new height based on drag direction (up = negative, down = positive)
      const newHeight = Math.max(INITIAL_HEIGHT * 0.5, Math.min(FULL_HEIGHT, startHeight.value - event.translationY));
      modalHeight.value = newHeight;
    })
    .onEnd((event) => {
      'worklet';
      isDragging.value = false;
      const velocity = event.velocityY;
      const currentHeight = modalHeight.value;
      
      // Determine if we should snap to full screen or initial height based on velocity and position
      const shouldExpand = velocity < -500 || currentHeight > (FULL_HEIGHT + INITIAL_HEIGHT) / 2;
      
      if (shouldExpand) {
        // Snap to full screen
        modalHeight.value = withSpring(FULL_HEIGHT, {
          damping: 15,
          stiffness: 90,
        });
      } else {
        // Snap to initial height
        modalHeight.value = withSpring(INITIAL_HEIGHT, {
          damping: 15,
          stiffness: 90,
        });
      }
    });

  useEffect(() => {
    if (visible && !isClosing) {
      // Reset closing state and height when modal becomes visible
      setIsClosing(false);
      modalHeight.value = INITIAL_HEIGHT;
      
      // Animate modal in
      modalTranslateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
        mass: 0.8,
      });
      modalOpacity.value = withTiming(1, { duration: 300 });
      backdropOpacity.value = withTiming(1, { duration: 300 });
      
      // Slight delay for content to appear
      setTimeout(() => {
        contentOpacity.value = withTiming(1, { duration: 400 });
      }, 200);
    }
  }, [visible, isClosing]);

  const handleClose = () => {
    if (isClosing) return;
    
    setIsClosing(true);
    
    // Animate modal out first
    modalTranslateY.value = withTiming(screenHeight, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    modalOpacity.value = withTiming(0, { duration: 300 });
    backdropOpacity.value = withTiming(0, { duration: 300 });
    contentOpacity.value = withTiming(0, { duration: 200 });
    
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleLogProgress = () => {
    if (onLogProgress) {
      onLogProgress(recipe);
    } else {
      console.log('Log progress for recipe:', recipe?.title || recipe?.mealName);
    }
  };

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: modalTranslateY.value }],
      height: modalHeight.value,
      opacity: modalOpacity.value,
    };
  });

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });

  if (!recipe || !visible) return null;

  // Sample recipe data structure
  const defaultRecipeData = {
    guidance: [
      {
        step: 1,
        title: "Prep the ingredients",
        description: "Wash and chop all vegetables. Season the protein with salt and pepper.",
        time: "5 min"
      },
      {
        step: 2,
        title: "Heat the pan",
        description: "Heat oil in a large skillet over medium-high heat until shimmering.",
        time: "2 min"
      },
      {
        step: 3,
        title: "Cook the protein",
        description: "Add protein to the pan and cook until golden brown on both sides.",
        time: "8-10 min"
      },
      {
        step: 4,
        title: "Add vegetables",
        description: "Add vegetables to the pan and sauté until tender-crisp.",
        time: "5-7 min"
      },
      {
        step: 5,
        title: "Final seasoning",
        description: "Season to taste and add any final garnishes. Serve immediately.",
        time: "2 min"
      }
    ],
    ingredients: [
      { name: "Quinoa", amount: "1 cup", category: "Grains" },
      { name: "Cherry Tomatoes", amount: "200g", category: "Vegetables" },
      { name: "Cucumber", amount: "1 medium", category: "Vegetables" },
      { name: "Red Onion", amount: "1/2 medium", category: "Vegetables" },
      { name: "Feta Cheese", amount: "150g", category: "Dairy" },
      { name: "Olive Oil", amount: "3 tbsp", category: "Oils" },
      { name: "Lemon Juice", amount: "2 tbsp", category: "Seasonings" },
      { name: "Fresh Herbs", amount: "1/4 cup", category: "Herbs" },
      { name: "Salt", amount: "To taste", category: "Seasonings" },
      { name: "Black Pepper", amount: "To taste", category: "Seasonings" }
    ]
  };

  const recipeData = recipe && recipe.guidance && recipe.ingredients ? recipe : {
    ...recipe,
    ...defaultRecipeData
  };

  const renderGuidance = () => (
    <ScrollView 
      style={styles.tabContent} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      bounces={true}
      scrollEventThrottle={16}
    >
      <Animated.View 
        style={styles.guidanceContainer}
        entering={FadeIn.duration(500).delay(200)}
      >
        {recipeData.guidance.map((step, index) => (
          <Animated.View 
            key={index} 
            style={styles.stepContainer}
            entering={FadeIn.duration(400).delay(index * 100)}
          >
            <BlurView 
              intensity={25} 
              style={styles.glassBackground}
              tint="extraLight"
            >
              <LinearGradient
                colors={[
                  'rgba(255, 255, 255, 0.4)',
                  'rgba(255, 255, 255, 0.2)',
                  'rgba(255, 255, 255, 0.1)'
                ]}
                locations={[0, 0.6, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassGradient}
              >
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Animated.View 
                      style={styles.stepNumber}
                      entering={FadeIn.duration(400).delay(index * 100 + 100)}
                    >
                      <LinearGradient
                        colors={['#FF8A50', '#FF6B35']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.stepNumberGradient}
                      >
                        <Text style={styles.stepNumberText}>{step.step || index + 1}</Text>
                      </LinearGradient>
                    </Animated.View>
                    <View style={styles.stepInfo}>
                      <Text style={styles.stepTitle}>{step.title || 'Step'}</Text>
                      <View style={styles.timeContainer}>
                        <Ionicons name="time-outline" size={14} color="#FF8A50" />
                        <Text style={styles.timeText}>{step.time || 'N/A'}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.stepDescription}>{step.description || 'No description available'}</Text>
                </View>
              </LinearGradient>
            </BlurView>
          </Animated.View>
        ))}
      </Animated.View>
    </ScrollView>
  );

  const renderIngredients = () => {
    const groupedIngredients = recipeData.ingredients.reduce((acc, ingredient) => {
      if (!acc[ingredient.category]) {
        acc[ingredient.category] = [];
      }
      acc[ingredient.category].push(ingredient);
      return acc;
    }, {});

    return (
      <ScrollView 
        style={styles.tabContent} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        scrollEventThrottle={16}
      >
        <Animated.View 
          style={styles.ingredientsContainer}
          entering={FadeIn.duration(500).delay(200)}
        >
          {Object.entries(groupedIngredients).map(([category, ingredients], categoryIndex) => (
            <Animated.View 
              key={category} 
              style={styles.ingredientCategory}
              entering={FadeIn.duration(400).delay(categoryIndex * 100)}
            >
              <Text style={styles.categoryTitle}>{category || 'Other'}</Text>
              {ingredients.map((ingredient, index) => (
                <Animated.View 
                  key={index} 
                  style={styles.ingredientItem}
                  entering={FadeIn.duration(300).delay(categoryIndex * 100 + index * 50)}
                >
                  <Animated.View 
                    style={styles.ingredientBullet}
                    entering={FadeIn.duration(300).delay(categoryIndex * 100 + index * 50 + 100)}
                  />
                  <View style={styles.ingredientInfo}>
                    <Text style={styles.ingredientName}>{ingredient.name || 'Unknown'}</Text>
                    <Text style={styles.ingredientAmount}>{ingredient.amount || 'N/A'}</Text>
                  </View>
                </Animated.View>
              ))}
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return '#27AE60';
      case 'medium': return '#F39C12';
      case 'hard': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AnimatedTouchable
          style={[styles.modalOverlay, backdropAnimatedStyle]}
          activeOpacity={1}
          onPress={handleClose}
        />
        
        <AnimatedView style={[styles.modalContainer, modalAnimatedStyle, contentAnimatedStyle]}>
          {/* Background gradient for the entire modal */}
          <LinearGradient
            colors={['#FFF8E8', '#F5F0E1', '#EDE4D3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalBackgroundGradient}
          />
          
          {/* Drag handle indicator - Only this area will handle pan gestures */}
          <GestureDetector gesture={panGesture}>
            <View style={styles.dragHandle}>
              <View style={styles.dragHandleBar} />
            </View>
          </GestureDetector>

          {/* Header with Image */}
          <View style={styles.modalHeader}>
            <Image 
              source={{ uri: recipe.imageUri }} 
              style={styles.headerImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              style={styles.headerGradient}
              locations={[0, 0.5, 1]}
            />
            
            {/* Close Button */}
            <AnimatedTouchable
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.8}
              entering={FadeIn.duration(400).delay(300)}
            >
              <Ionicons name="close" size={24} color="white" />
            </AnimatedTouchable>

            {/* Recipe Info Overlay */}
            <AnimatedView 
              style={styles.headerInfo}
              entering={FadeIn.duration(500).delay(200)}
            >
              <Text style={styles.recipeTitle} numberOfLines={2}>
                {recipe.title || recipe.mealName || 'Untitled Recipe'}
              </Text>
              {recipe.chef && (
                <Text style={styles.chefName}>by {recipe.chef}</Text>
              )}
              
              <View style={styles.headerStats}>
                <AnimatedView 
                  style={styles.statItem}
                  entering={FadeIn.duration(400).delay(200)}
                >
                  <MaterialCommunityIcons name="food-drumstick" size={16} color="#FF6B35" />
                  <Text style={styles.statText}>
                    {recipe.protein || '0g'} protein
                  </Text>
                </AnimatedView>
                
                <AnimatedView 
                  style={styles.statItem}
                  entering={FadeIn.duration(400).delay(300)}
                >
                  <MaterialCommunityIcons name="rice" size={16} color="#4CAF50" />
                  <Text style={styles.statText}>
                    {recipe.carbs || '0g'} carbs
                  </Text>
                </AnimatedView>
                
                <AnimatedView 
                  style={styles.statItem}
                  entering={FadeIn.duration(400).delay(400)}
                >
                  <MaterialCommunityIcons name="oil" size={16} color="#FFC107" />
                  <Text style={styles.statText}>
                    {recipe.fat || '0g'} fat
                  </Text>
                </AnimatedView>
              </View>

              <View style={styles.bottomRow}>
                {recipe.difficulty && (
                  <AnimatedView 
                    style={[
                      styles.difficultyBadge, 
                      { backgroundColor: getDifficultyColor(recipe.difficulty) }
                    ]}
                    entering={FadeIn.duration(400).delay(500)}
                  >
                    <Text style={styles.difficultyText}>{recipe.difficulty || 'Unknown'}</Text>
                  </AnimatedView>
                )}

                <AnimatedView 
                  style={styles.timeItem}
                  entering={FadeIn.duration(400).delay(600)}
                >
                  <Ionicons name="time-outline" size={16} color="white" />
                  <Text style={styles.statText}>
                    {recipe.cookTime || recipe.prepTime || 'N/A'}
                  </Text>
                </AnimatedView>
              </View>

              {/* Header Log Button */}
              <AnimatedView 
                style={styles.headerLogButton}
                entering={FadeIn.duration(500).delay(700)}
              >
                <LogButton
                  title="Log This Meal"
                  subtitle="Mark as completed?"
                  icon="checkmark-circle"
                  onPress={handleLogProgress}
                  variant="success"
                  size="small"
                  style={styles.headerLogButtonStyle}
                  gradientColors={['#10B981', '#059669', '#047857']}
                />
              </AnimatedView>
            </AnimatedView>
          </View>

          {/* Tabs */}
          <RecipeDetailTabs onTabChange={setActiveTab} isVisible={visible && !isClosing} />

          {/* Tab Content - Now scrollable */}
          <View style={styles.contentContainer}>
            {activeTab === 0 ? renderGuidance() : renderIngredients()}
          </View>
        </AnimatedView>
      </GestureHandlerRootView>
    </Modal>
  );
};

const tabStyles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginVertical: 15,
    marginHorizontal: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 25,
    padding: 4,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(96, 96, 96, 0.9)"
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    flex: 1,
  },
  tabText: {
    color: "#666",
    fontWeight: "500",
    fontSize: 16,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "700",
  },
  pill: {
    position: "absolute",
    top: 4,
    bottom: 4,
    borderRadius: 20,
  },
  gradient: {
    flex: 1,
    borderRadius: 20,
  },
});

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  modalBackgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  
  dragHandle: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingTop: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    zIndex: 1,
  },
  dragHandleBar: {
    width: 50,
    height: 6,
    backgroundColor: '#CCC',
    borderRadius: 3,
  },
  modalHeader: {
    height: 250, // Increased height to accommodate the header log button
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%', // Increased to accommodate the button
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  headerInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    lineHeight: 30,
  },
  chefName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  headerLogButton: {
    marginTop: 8,
  },
  headerLogButtonStyle: {
    width: '100%',
  },
  
  // Content Container with gradient background
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  
  tabContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  
  // Enhanced Glass Effect Guidance Styles
  guidanceContainer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  
  stepContainer: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    // Enhanced shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    backgroundColor: "white"
  },
  
  glassBackground: {
    borderRadius: 20,
    overflow: 'hidden',
    // Glass border effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  glassGradient: {
    borderRadius: 20,
    // Enhanced glass effect with better opacity
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  stepContent: {
    padding: 18,
    // Ensure content is properly positioned over glass effect
    backgroundColor: 'transparent',
  },
  
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  stepNumber: {
    borderRadius: 18,
    width: 36,
    height: 36,
    marginRight: 14,
    overflow: 'hidden',
    // Enhanced shadow for the step number
    shadowColor: '#FF8A50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  
  stepNumberGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  
  stepNumberText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  stepInfo: {
    flex: 1,
  },
  
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2419',
    marginBottom: 6,
    // Enhanced text shadow for better readability on glass
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 138, 80, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 138, 80, 0.2)',
  },
  
  timeText: {
    fontSize: 13,
    color: '#FF8A50',
    fontWeight: '600',
  },
  
  stepDescription: {
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 22,
    marginLeft: 50,
    fontWeight: '400',
    // Enhanced text readability
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 0.5,
  },

  // Ingredients Styles
  ingredientsContainer: {
    padding: 20,
  },
  ingredientCategory: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D2419',
    marginBottom: 12,
    paddingLeft: 4,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF8A50',
    marginRight: 12,
  },
  ingredientInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientName: {
    fontSize: 16,
    color: '#2D2419',
    fontWeight: '500',
  },
  ingredientAmount: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '600',
  },
});
export default RecipeDetailModal;