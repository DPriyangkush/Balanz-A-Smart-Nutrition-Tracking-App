// services/MealService.js

// Centralized meal data - single source of truth
const SAMPLE_MEALS = [
  {
    id: 1,
    mealName: 'Grilled Chicken Salad',
    calories: '350 cal',
    prepTime: '15 min',
    imageUri: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=150&fit=crop',
    rating: 4.7,
    tags: ['protein', 'low-carb', 'healthy'],
    difficulty: 'Easy'
  },
  {
    id: 2,
    mealName: 'Quinoa Buddha Bowl',
    calories: '420 cal',
    prepTime: '20 min',
    imageUri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop',
    rating: 4.8,
    tags: ['vegan', 'protein', 'fiber'],
    difficulty: 'Medium'
  },
  {
    id: 3,
    mealName: 'Salmon Teriyaki',
    calories: '480 cal',
    prepTime: '25 min',
    imageUri: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&h=150&fit=crop',
    rating: 4.6,
    tags: ['omega-3', 'protein', 'japanese'],
    difficulty: 'Medium'
  },
  {
    id: 4,
    mealName: 'Avocado Toast',
    calories: '280 cal',
    prepTime: '5 min',
    imageUri: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=200&h=150&fit=crop',
    rating: 4.5,
    tags: ['healthy', 'quick', 'breakfast'],
    difficulty: 'Easy'
  },
  {
    id: 5,
    mealName: 'Greek Yogurt Parfait',
    calories: '220 cal',
    prepTime: '3 min',
    imageUri: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=150&fit=crop',
    rating: 4.4,
    tags: ['protein', 'breakfast', 'quick'],
    difficulty: 'Easy'
  },
  {
    id: 6,
    mealName: 'Vegetable Stir Fry',
    calories: '320 cal',
    prepTime: '18 min',
    imageUri: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=150&fit=crop',
    rating: 4.3,
    tags: ['vegan', 'fiber', 'asian'],
    difficulty: 'Easy'
  },
];

/**
 * MealService - Handles all meal-related data operations
 * This service abstracts data access and can be easily switched from sample data to API calls
 */
export class MealService {
  
  /**
   * Search meals by query
   * @param {string} query - Search term
   * @returns {Promise<Array>} - Array of matching meals
   */
  static async searchMeals(query) {
    try {
      // Simulate network delay for realistic behavior
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!query || !query.trim()) {
        return [];
      }
      
      const searchTerm = query.toLowerCase().trim();
      
      const results = SAMPLE_MEALS.filter(meal =>
        meal.mealName.toLowerCase().includes(searchTerm) ||
        meal.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        meal.difficulty.toLowerCase().includes(searchTerm)
      );
      
      return results;
      
    } catch (error) {
      console.error('Error searching meals:', error);
      throw new Error('Failed to search meals');
    }
  }
  
  /**
   * Get all available meals
   * @returns {Promise<Array>} - Array of all meals
   */
  static async getAllMeals() {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      return [...SAMPLE_MEALS]; // Return a copy to prevent mutation
    } catch (error) {
      console.error('Error fetching meals:', error);
      throw new Error('Failed to fetch meals');
    }
  }
  
  /**
   * Get meal by ID
   * @param {number} id - Meal ID
   * @returns {Promise<Object|null>} - Meal object or null if not found
   */
  static async getMealById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const meal = SAMPLE_MEALS.find(meal => meal.id === id);
      return meal || null;
    } catch (error) {
      console.error('Error fetching meal by ID:', error);
      throw new Error('Failed to fetch meal');
    }
  }
  
  /**
   * Get meals by category/tags
   * @param {string} category - Category to filter by
   * @returns {Promise<Array>} - Array of meals in category
   */
  static async getMealsByCategory(category) {
    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      
      const categoryLower = category.toLowerCase();
      const results = SAMPLE_MEALS.filter(meal =>
        meal.tags.some(tag => tag.toLowerCase().includes(categoryLower))
      );
      
      return results;
    } catch (error) {
      console.error('Error fetching meals by category:', error);
      throw new Error('Failed to fetch meals by category');
    }
  }
}