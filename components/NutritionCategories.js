import React from 'react';
import { TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { Circle, YStack } from 'tamagui';

const NutritionCategories = ({ categories, onCategoryPress }) => {
  const defaultCategories = [
    { id: 1, name: 'Protein', emoji: '🥩' },
    { id: 2, name: 'Carbs', emoji: '🍞' },
    { id: 3, name: 'Vitamins', emoji: '🥬' },
    { id: 4, name: 'Fiber', emoji: '🥕' },
    { id: 5, name: 'Calcium', emoji: '🥛' },
    { id: 6, name: 'Healthy Fats', emoji: '🥑' },
  ];

  const nutritionCategories = categories || defaultCategories;

  return (
    <ScrollView 
      horizontal 
      style={styles.categoriesContainer}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContent}
    >
      {nutritionCategories.map((category) => (
        <TouchableOpacity 
          key={category.id} 
          style={styles.categoryItem}
          onPress={() => onCategoryPress && onCategoryPress(category)}
        >
          <Circle
            size={70}
            backgroundColor="$background"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={4}
            elevation={2}
            justifyContent="center"
            alignItems="center"
            marginBottom={8}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
          </Circle>
          <Text style={styles.categoryName}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    marginBottom: 30,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 25,
  },
  categoryEmoji: {
    fontSize: 34,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default NutritionCategories;