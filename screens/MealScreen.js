import React, { useState } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { YStack } from 'tamagui';
import { MealWrapper } from '../components/ScreenWrappers';

// Import custom components
import GreetingSection from '../components/GreetingSection';
import MealSearchInput from '../components/MealSearchInput';
import NutritionCategories from '../components/NutritionCategories';
import MealSectionHeader from '../components/MealSectionHeader';
import MealCardsList from '../components/MealCardsList';
import RecipeSuggestionCards from 'components/RecipeSuggestionCards';

const MealScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const nutritionCategories = [
    { id: 1, name: 'Protein', emoji: '🥩' },
    { id: 2, name: 'Carbs', emoji: '🍞' },
    { id: 3, name: 'Vitamins', emoji: '🥬' },
    { id: 4, name: 'Fiber', emoji: '🥕' },
    { id: 5, name: 'Calcium', emoji: '🥛' },
    { id: 6, name: 'Healthy Fats', emoji: '🥑' },
  ];

  const mealPlans = [
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

  // Event handlers
  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleCategoryPress = (category) => {
    console.log('Category pressed:', category.name);
  };

  const handleMealPress = (meal) => {
    console.log('Meal pressed:', meal.mealName);
  };

  const handleSectionArrowPress = () => {
    console.log('Section arrow pressed');
  };

  const handleNutritionTrackingPress = () => {
    console.log('Nutrition tracking section pressed');
  };
  const handleRecipePress = (recipe) => {
    console.log('Recipe pressed:', recipe.title);   
  };

  return (
    <MealWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content"/>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Greeting Section */}
          <GreetingSection 
            userName="Priyangkush"
            mealCount={202}
          />

          {/* Search Input */}
          <MealSearchInput 
            placeholder="Find your healthy meal..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />

          {/* Nutrition Categories */}
          <NutritionCategories 
            categories={nutritionCategories}
            onCategoryPress={handleCategoryPress}
          />

          {/* Meal Plan Section */}
          <YStack style={styles.mealPlanSection} space="$3">
            <MealSectionHeader 
              title="Balanced Nutrition Plan"
              badgeText="Recommended"
              badgeIcon="🔥"
              onArrowPress={handleSectionArrowPress}
            />

            {/* Meal Cards */}
            <MealCardsList 
              meals={mealPlans}
              onMealPress={handleMealPress}
            />
          </YStack>

          {/* Nutrition Tracking Section */}
          <YStack style={styles.nutritionTrackingSection}>
            <MealSectionHeader 
              title="Recipe Suggestions"
              showBadge={false}
              onArrowPress={handleNutritionTrackingPress}
            />

            {/* Recipe Suggestions */}
            <RecipeSuggestionCards 
              onRecipePress={handleRecipePress}
            />
          </YStack>

          {/* Bottom Spacer */}
          <YStack style={styles.spacer} />
        </ScrollView>
      </SafeAreaView>
    </MealWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  mealPlanSection: {
    marginBottom: 0,
  },
  nutritionTrackingSection: {
    marginBottom: 30,
    
  },
  spacer: {
    height: 100,
  },
});

export default MealScreen;