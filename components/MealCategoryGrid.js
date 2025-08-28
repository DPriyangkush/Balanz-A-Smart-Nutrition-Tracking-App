import React from 'react';
import { TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native';
import { Card, XStack, YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MealCategoryGrid = ({ onCategoryPress }) => {
  const mealCategories = [
    {
      id: 1,
      title: 'Breakfast',
      icon: 'sunny-outline',
      color: '#FF9500',
      backgroundColor: '#FFF3E6',
      borderColor: '#FFEAD6',
    },
    {
      id: 2,
      title: 'Lunch',
      icon: 'restaurant-outline',
      color: '#34C759',
      backgroundColor: '#F0FFF4',
      borderColor: '#E8F5E8',
    },
    {
      id: 3,
      title: 'Snacks',
      icon: 'fast-food-outline',
      color: '#FF6B6B',
      backgroundColor: '#FFF5F5',
      borderColor: '#FFE8E8',
    },
    {
      id: 4,
      title: 'Dinner',
      icon: 'moon-outline',
      color: '#5856D6',
      backgroundColor: '#F5F4FF',
      borderColor: '#EBEAFF',
    },
  ];

  const navigation = useNavigation();

  const handleCategoryPress = (category) => {
    navigation.navigate("Breakfast");
    if (onCategoryPress) {
      
      onCategoryPress(category);
    }
  };

  // Get screen dimensions
  const { width: screenWidth } = Dimensions.get('window');
  
  // Calculate responsive dimensions
  const containerPadding = 20;
  const gridGap = 10;
  const availableWidth = screenWidth - (containerPadding * 2);
  const cardWidth = (availableWidth - gridGap) / 2;
  
  // Dynamic styles based on screen size
  const dynamicStyles = StyleSheet.create({
    categoryCard: {
      width: cardWidth,
      height: cardWidth, // Square aspect ratio
      minWidth: 150, // Minimum width for very small screens
      minHeight: 150, // Minimum height for very small screens
      maxWidth: 200, // Maximum width for very large screens
      maxHeight: 200, // Maximum height for very large screens
    },
    iconContainer: {
      width: Math.min(Math.max(cardWidth * 0.35, 50), 70), // Responsive icon container
      height: Math.min(Math.max(cardWidth * 0.35, 50), 70),
      borderRadius: Math.min(Math.max(cardWidth * 0.175, 25), 35),
    },
    iconSize: Math.min(Math.max(cardWidth * 0.2, 24), 36), // Responsive icon size
    categoryTitle: {
      fontSize: Math.min(Math.max(cardWidth * 0.08, 14), 18), // Responsive font size
    },
    touchableContent: {
      padding: Math.min(Math.max(cardWidth * 0.1, 15), 25), // Responsive padding
    },
  });

  return (
    <YStack style={styles.container}>
      {/* Section Heading */}
      <Text style={styles.sectionTitle}>What's on your mind?</Text>
      
      {/* Grid Container */}
      <View style={styles.gridContainer}>
        {mealCategories.map((category, index) => (
          <Card
            key={category.id}
            style={[
              styles.categoryCard,
              dynamicStyles.categoryCard,
              {
                backgroundColor: category.backgroundColor,
                borderColor: category.borderColor,
              }
            ]}
            borderWidth={1}
            borderRadius={16}
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.08}
            shadowRadius={8}
            elevation={3}
          >
            <TouchableOpacity
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.8}
              style={[styles.touchableContent, dynamicStyles.touchableContent]}
            >
              <YStack alignItems="center" justifyContent="center" space="$3">
                {/* Icon Container */}
                <View 
                  style={[
                    styles.iconContainer, 
                    dynamicStyles.iconContainer,
                    { backgroundColor: category.color + '20' }
                  ]}
                >
                  <Ionicons
                    name={category.icon}
                    size={dynamicStyles.iconSize}
                    color={category.color}
                  />
                </View>
                
                {/* Category Title */}
                <Text 
                  style={[
                    styles.categoryTitle, 
                    dynamicStyles.categoryTitle,
                    { color: category.color }
                  ]}
                >
                  {category.title}
                </Text>
              </YStack>
            </TouchableOpacity>
          </Card>
        ))}
      </View>
    </YStack>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -20, // Negative margin to counteract parent padding
    paddingHorizontal: 20, // Add back the padding for content
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D2419',
    marginBottom: 20,
    textAlign: 'left',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 15,
    marginBottom: 20,
  },
  categoryCard: {
    overflow: 'hidden',
  },
  touchableContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    fontWeight: '600',
    textAlign: 'center',
    numberOfLines: 1,
    adjustsFontSizeToFit: true,
  },
});

export default MealCategoryGrid;