// FoodCardsGrid.js - Enhanced version with proper meal data structure
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const FoodCardsGrid = ({ onItemPress }) => {
  const defaultFoodItems = [
    {
      id: 1,
      name: 'Flavorful Fried Rice Fiesta',
      kcal: '420 kcal',
      protein: '12g',
      carbs: '65g',
      fats: '8g',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop',
      recommended: true,
      category: 'Rice Dish',
      prepTime: '15 min',
      servings: 2,
      description: 'A colorful and flavorful fried rice packed with vegetables and aromatic spices.',
      ingredients: [
        { quantity: '2 cups', item: 'Cooked jasmine rice' },
        { quantity: '2 tbsp', item: 'Vegetable oil' },
        { quantity: '2', item: 'Eggs, beaten' },
        { quantity: '1 cup', item: 'Mixed vegetables (carrots, peas, corn)' },
        { quantity: '3', item: 'Green onions, chopped' },
        { quantity: '2 tbsp', item: 'Soy sauce' },
        { quantity: '1 tsp', item: 'Sesame oil' },
        { quantity: '1 tsp', item: 'Garlic, minced' },
      ],
      instructions: [
        'Heat oil in a large wok or skillet over high heat.',
        'Add beaten eggs and scramble, then remove and set aside.',
        'Add garlic and vegetables, stir-fry for 2-3 minutes.',
        'Add rice, breaking up any clumps, and stir-fry for 3-4 minutes.',
        'Return eggs to the pan, add soy sauce and sesame oil.',
        'Garnish with green onions and serve hot.'
      ]
    },
    {
      id: 2,
      name: 'Flavorful Fried Noodles',
      kcal: '385 kcal',
      protein: '10g',
      carbs: '58g',
      fats: '12g',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
      recommended: false,
      category: 'Noodles',
      prepTime: '12 min',
      servings: 2,
      description: 'Delicious stir-fried noodles with a perfect blend of Asian flavors.',
      ingredients: [
        { quantity: '8 oz', item: 'Fresh egg noodles' },
        { quantity: '2 tbsp', item: 'Vegetable oil' },
        { quantity: '1', item: 'Bell pepper, sliced' },
        { quantity: '1 cup', item: 'Bean sprouts' },
        { quantity: '2', item: 'Garlic cloves, minced' },
        { quantity: '2 tbsp', item: 'Oyster sauce' },
        { quantity: '1 tbsp', item: 'Dark soy sauce' },
        { quantity: '1 tsp', item: 'Sugar' },
      ]
    },
    {
      id: 3,
      name: 'Healthy Buddha Bowl',
      kcal: '280 kcal',
      protein: '18g',
      carbs: '32g',
      fats: '8g',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
      recommended: true,
      category: 'Healthy',
      prepTime: '10 min',
      servings: 1,
      description: 'A nutritious and colorful bowl packed with fresh vegetables and wholesome grains.',
      ingredients: [
        { quantity: '1/2 cup', item: 'Quinoa, cooked' },
        { quantity: '1/4 cup', item: 'Chickpeas, roasted' },
        { quantity: '1/2', item: 'Avocado, sliced' },
        { quantity: '1 cup', item: 'Mixed greens' },
        { quantity: '1/4 cup', item: 'Shredded carrots' },
        { quantity: '2 tbsp', item: 'Tahini dressing' },
        { quantity: '1 tbsp', item: 'Pumpkin seeds' },
        { quantity: '1/4 cup', item: 'Cherry tomatoes' },
      ]
    },
    {
      id: 4,
      name: 'Protein Packed Salad',
      kcal: '320 kcal',
      protein: '25g',
      carbs: '18g',
      fats: '15g',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
      recommended: false,
      category: 'Salad',
      prepTime: '8 min',
      servings: 1,
      description: 'A protein-rich salad perfect for post-workout nutrition.',
      ingredients: [
        { quantity: '4 oz', item: 'Grilled chicken breast' },
        { quantity: '2 cups', item: 'Mixed leafy greens' },
        { quantity: '1/4 cup', item: 'Black beans' },
        { quantity: '1 tbsp', item: 'Feta cheese' },
        { quantity: '1/4', item: 'Cucumber, diced' },
        { quantity: '2 tbsp', item: 'Olive oil vinaigrette' },
        { quantity: '1 tbsp', item: 'Sunflower seeds' },
      ]
    },
    {
      id: 5,
      name: 'Spicy Taco Bowl',
      kcal: '450 kcal',
      protein: '22g',
      carbs: '45g',
      fats: '18g',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      recommended: true,
      category: 'Mexican',
      prepTime: '20 min',
      servings: 2,
      description: 'A spicy and satisfying Mexican-inspired bowl with bold flavors.',
      ingredients: [
        { quantity: '1 cup', item: 'Brown rice, cooked' },
        { quantity: '6 oz', item: 'Ground turkey' },
        { quantity: '1/2 cup', item: 'Black beans' },
        { quantity: '1/4 cup', item: 'Corn kernels' },
        { quantity: '1/4 cup', item: 'Salsa' },
        { quantity: '2 tbsp', item: 'Greek yogurt' },
        { quantity: '1/4', item: 'Avocado, diced' },
        { quantity: '1 tbsp', item: 'Lime juice' },
      ]
    },
    {
      id: 6,
      name: 'Mediterranean Wrap',
      kcal: '365 kcal',
      protein: '16g',
      carbs: '42g',
      fats: '14g',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=300&h=200&fit=crop',
      recommended: false,
      category: 'Mediterranean',
      prepTime: '6 min',
      servings: 1,
      description: 'A fresh Mediterranean wrap with hummus and crispy vegetables.',
      ingredients: [
        { quantity: '1', item: 'Large whole wheat tortilla' },
        { quantity: '3 tbsp', item: 'Hummus' },
        { quantity: '2 oz', item: 'Grilled chicken' },
        { quantity: '1/4 cup', item: 'Cucumber, diced' },
        { quantity: '2 tbsp', item: 'Red onion, sliced' },
        { quantity: '1/4 cup', item: 'Lettuce, shredded' },
        { quantity: '2 tbsp', item: 'Feta cheese' },
        { quantity: '1 tbsp', item: 'Olive tapenade' },
      ]
    }
  ];

  const foodItems = defaultFoodItems;

  // Responsive breakpoints (same as before)
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 768;
  const isLargeScreen = screenWidth >= 768 && screenWidth < 1024;
  const isTablet = screenWidth >= 768;
  const isLargeTablet = screenWidth >= 1024;

  // Get screen dimensions and calculate responsive dimensions
  const containerPadding = 10;
  const gridGap = isSmallScreen ? 12 : isMediumScreen ? 10 : isTablet ? 18 : 15;
  const availableWidth = screenWidth - (containerPadding * 3);
  const cardWidth = (availableWidth - gridGap) / 2;

  // Dynamic sizing functions (same as before)
  const getCardHeight = () => {
    const baseHeight = cardWidth * 1.4;
    if (isSmallScreen) return Math.min(Math.max(baseHeight, 280), 320);
    if (isMediumScreen) return Math.min(Math.max(baseHeight, 300), 340);
    if (isLargeScreen) return Math.min(Math.max(baseHeight, 320), 380);
    if (isLargeTablet) return Math.min(Math.max(baseHeight, 340), 400);
    return 300;
  };

  const getImageHeight = () => {
    const cardHeight = getCardHeight();
    return cardHeight * 0.5;
  };

  const getGradientHeight = () => {
    if (isSmallScreen) return 40;
    if (isMediumScreen) return 50;
    if (isLargeScreen) return 60;
    if (isLargeTablet) return 70;
    return 50;
  };

  const getTitleFontSize = () => {
    if (isSmallScreen) return 14;
    if (isMediumScreen) return 15;
    if (isLargeScreen) return 16;
    if (isLargeTablet) return 17;
    return 15;
  };

  const getKcalFontSize = () => {
    if (isSmallScreen) return 13;
    if (isMediumScreen) return 14;
    if (isLargeScreen) return 15;
    if (isLargeTablet) return 16;
    return 14;
  };

  const getTagFontSize = () => {
    if (isSmallScreen) return 10;
    if (isMediumScreen) return 11;
    if (isLargeScreen) return 12;
    if (isLargeTablet) return 13;
    return 11;
  };

  const getMacroFontSize = () => {
    if (isSmallScreen) return 10;
    if (isMediumScreen) return 11;
    if (isLargeScreen) return 12;
    if (isLargeTablet) return 13;
    return 11;
  };

  const getContentPadding = () => {
    if (isSmallScreen) return 12;
    if (isMediumScreen) return 14;
    if (isLargeScreen) return 16;
    if (isLargeTablet) return 18;
    return 14;
  };

  const cardHeight = getCardHeight();
  const imageHeight = getImageHeight();
  const gradientHeight = getGradientHeight();

  // Enhanced item press handler
  const handleItemPress = (item) => {
    if (onItemPress) {
      // Ensure all required data is passed
      onItemPress({
        ...item,
        // Add default instructions if not present
        instructions: item.instructions || [
          `Prepare all ingredients for ${item.name}.`,
          'Follow the cooking method appropriate for this dish.',
          'Cook until done and serve hot.',
          'Enjoy your delicious meal!'
        ]
      });
    }
  };

  // Create dynamic styles (same as before)
  const responsiveStyles = StyleSheet.create({
    container: {
      marginHorizontal: -20,
      paddingHorizontal: 25,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: isTablet ? 22 : 18,
      fontWeight: 'thin',
      color: '#2D2419',
      paddingHorizontal: 10,
      textAlign: "center"
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: gridGap,
    },
    foodCardItem: {
      width: cardWidth,
      marginBottom: gridGap,
    },
    foodCard: {
      width: '100%',
      height: cardHeight,
      backgroundColor: 'white',
      borderRadius: 16,
      overflow: 'hidden',
      ...(isTablet && {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
      }),
      ...(!isTablet && {
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
      }),
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: imageHeight,
    },
    cardImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    gradientOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: gradientHeight,
    },
    macrosContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    macroItem: {
      alignItems: 'center',
      flex: 1,
    },
    macroLabel: {
      fontSize: getMacroFontSize(),
      color: '#999',
      fontWeight: '500',
      marginBottom: 2,
    },
    macroValue: {
      fontSize: getMacroFontSize(),
      color: '#333',
      fontWeight: '600',
    },
    cardContent: {
      flex: 1,
      padding: getContentPadding(),
      paddingTop: getContentPadding() * 0.8,
      justifyContent: 'space-between',
    },
    cardTitle: {
      fontSize: getTitleFontSize(),
      fontWeight: isTablet ? '600' : 'bold',
      color: '#333',
      marginBottom: 8,
      lineHeight: getTitleFontSize() * 1.3,
      numberOfLines: 2,
      textAlign: "center",
      ...(isTablet && {
        textShadowColor: 'rgba(0, 0, 0, 0.05)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
      }),
    },
    kcalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#EDFDEE',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'center',
      minWidth: '80%',
    },
    kcalText: {
      fontSize: getKcalFontSize(),
      color: '#1e1e1e',
      fontWeight: '600',
      marginLeft: 4,
    },
    sectionTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 40,
      marginTop: 10,
      marginHorizontal: 10,
    },
    sectionTitleLine: {
      flex: 1,
      height: 1,
      backgroundColor: "#1e1e1e",
      opacity: 0.5
    }
  });

  return (
    <View style={responsiveStyles.container}>
      {/* Section Heading with Lines */}
      <View style={responsiveStyles.sectionTitleContainer}>
        <View style={responsiveStyles.sectionTitleLine} />
        <Text style={responsiveStyles.sectionTitle}>Recommended</Text>
        <View style={responsiveStyles.sectionTitleLine} />
      </View>
      
      {/* Grid Container */}
      <View style={responsiveStyles.gridContainer}>
        {foodItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={responsiveStyles.foodCardItem}
            onPress={() => handleItemPress(item)}
            activeOpacity={0.8}
          >
            <View style={responsiveStyles.foodCard}>
              {/* Image Container with Gradient and Recommended Tag */}
              <View style={responsiveStyles.imageContainer}>
                <Image source={{ uri: item.image }} style={responsiveStyles.cardImage} />
                
                {/* Linear Gradient Overlay */}
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)']}
                  style={responsiveStyles.gradientOverlay}
                  locations={[0, 0.7, 1]}
                />
                
                
              </View>
              
              {/* Card Content */}
              <View style={responsiveStyles.cardContent}>
                <Text style={responsiveStyles.cardTitle} numberOfLines={2}>
                  {item.name}
                </Text>
                
                {/* Macros Container (P, C, F) */}
                <View style={responsiveStyles.macrosContainer}>
                  <View style={responsiveStyles.macroItem}>
                    <Text style={responsiveStyles.macroLabel}>P</Text>
                    <Text style={responsiveStyles.macroValue}>{item.protein}</Text>
                  </View>
                  <View style={responsiveStyles.macroItem}>
                    <Text style={responsiveStyles.macroLabel}>C</Text>
                    <Text style={responsiveStyles.macroValue}>{item.carbs}</Text>
                  </View>
                  <View style={responsiveStyles.macroItem}>
                    <Text style={responsiveStyles.macroLabel}>F</Text>
                    <Text style={responsiveStyles.macroValue}>{item.fats}</Text>
                  </View>
                </View>
                
                {/* Kcal Container */}
                <View style={responsiveStyles.kcalContainer}>
                  <Ionicons name="flash-outline" size={16} color="#1e1e1e" />
                  <Text style={responsiveStyles.kcalText}>{item.kcal}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default FoodCardsGrid;