import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import MealCard from './MealCard';

const MealCardsList = ({ meals, onMealPress }) => {
  const defaultMeals = [
    {
      id: 1,
      mealName: 'High Protein Bowl',
      calories: '450 - 650 cal',
      prepTime: '15-20 min prep',
      rating: 4.5,
      imageUri: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop',
    },
    {
      id: 2,
      mealName: 'Mediterranean Feast',
      calories: '380 - 580 cal',
      prepTime: '10-15 min prep',
      rating: 4.8,
      imageUri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=150&fit=crop',
    },
    {
      id: 3,
      mealName: 'Green Power Salad',
      calories: '320 - 450 cal',
      prepTime: '5-10 min prep',
      rating: 4.6,
      imageUri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop',
    },
  ];

  const mealsList = meals || defaultMeals;

  return (
    <ScrollView 
      horizontal 
      style={styles.mealCardsContainer}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.mealCardsContent}
    >
      {mealsList.map((meal) => (
        <MealCard
          key={meal.id}
          mealName={meal.mealName}
          calories={meal.calories}
          prepTime={meal.prepTime}
          rating={meal.rating}
          imageUri={meal.imageUri}
          onPress={() => onMealPress && onMealPress(meal)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mealCardsContainer: {
    marginBottom: 10,
  },
  mealCardsContent: {
    paddingRight: 20,
  },
});

export default MealCardsList;