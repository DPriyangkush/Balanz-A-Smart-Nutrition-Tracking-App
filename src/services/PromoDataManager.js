// Enhanced PromoDataManager.js - Fixed weekend detection and filtering
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration constants (unchanged)
export const PROMO_CONFIG = {
  DEFAULT_ROTATION_INTERVAL: 5000,
  MAX_PROMOS_PER_MEAL: 5,
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  ANIMATION_DURATION: 300,
  
  MEAL_TIME_RANGES: {
    breakfast: { start: 5, end: 11 },
    lunch: { start: 11, end: 16 },
    snacks: { start: 14, end: 18 },
    dinner: { start: 18, end: 23 },
  },
  
  MEAL_THEMES: {
    breakfast: {
      primaryColor: '#FF9500',
      backgroundColor: '#FFF8E8',
      accentColor: '#FFE4B5',
      gradientColors: ['#FFF8E8', '#FFE4B5'],
    },
    lunch: {
      primaryColor: '#34C759',
      backgroundColor: '#F0F9F0',
      accentColor: '#98FB98',
      gradientColors: ['#F0F9F0', '#98FB98'],
    },
    snacks: {
      primaryColor: '#5AC8FA',
      backgroundColor: '#E8F4FD',
      accentColor: '#B0E0E6',
      gradientColors: ['#E8F4FD', '#B0E0E6'],
    },
    dinner: {
      primaryColor: '#8E44AD',
      backgroundColor: '#F8F4FF',
      accentColor: '#E6E6FA',
      gradientColors: ['#F8F4FF', '#E6E6FA'],
    },
  }
};

// Enhanced promo data structure (unchanged)
export const PROMO_DATA = {
  breakfast: {
    weekday: [
      {
        id: 'breakfast_energy_boost',
        title: "Morning Power",
        subtitle: "High-protein breakfast to fuel your day!",
        buttonText: "Boost Energy",
        imageSource: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=300&h=200&fit=crop',
        discount: '35%',
        category: 'energy',
        priority: 1,
        tags: ['protein', 'quick', 'healthy', 'energy'],
        targetAudience: ['fitness', 'professionals', 'athletes'],
        validUntil: null,
        minOrderValue: 299,
        badge: 'TRENDING',
        specialOffer: 'Free protein shake with orders above ₹399',
        ratings: 4.8,
        orderCount: '2k+ orders today',
      },
      {
        id: 'breakfast_healthy_choice',
        title: "Wellness Bowl",
        subtitle: "Organic & nutritious breakfast options!",
        buttonText: "Go Healthy",
        imageSource: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=300&h=200&fit=crop',
        discount: '25%',
        category: 'healthy',
        priority: 2,
        tags: ['organic', 'low-cal', 'fresh', 'gluten-free'],
        targetAudience: ['health-conscious', 'weight-watchers', 'vegetarian'],
        validUntil: null,
        minOrderValue: 199,
        badge: 'HEALTHY',
        specialOffer: 'Free green tea with every order',
        ratings: 4.6,
        orderCount: '1.5k+ orders today',
      },
      {
        id: 'breakfast_quick_bite',
        title: "Rush Hour",
        subtitle: "Ready in 5 minutes - perfect for busy mornings!",
        buttonText: "Order Quick",
        imageSource: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop',
        discount: '20%',
        category: 'quick',
        priority: 3,
        tags: ['fast', 'convenient', 'grab-and-go'],
        targetAudience: ['busy-professionals', 'students'],
        validUntil: null,
        minOrderValue: 149,
        badge: 'FAST',
        specialOffer: 'Express delivery in 10 mins',
        ratings: 4.4,
        orderCount: '3k+ orders today',
      }
    ],
    weekend: [
      {
        id: 'breakfast_weekend_brunch',
        title: "Weekend Brunch",
        subtitle: "Leisurely brunch specials for your weekend!",
        buttonText: "Explore Brunch",
        imageSource: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
        discount: '40%',
        category: 'brunch',
        priority: 1,
        tags: ['premium', 'leisure', 'indulgent', 'family'],
        targetAudience: ['families', 'couples', 'food-lovers'],
        validUntil: null,
        minOrderValue: 499,
        badge: 'WEEKEND SPECIAL',
        specialOffer: 'Complimentary dessert with brunch combos',
        ratings: 4.9,
        orderCount: '800+ orders today',
      },
      {
        id: 'breakfast_masti_weekend_brunch',
        title: "Weekend Masti",
        subtitle: "Leisurely brunch specials for your weekend!",
        buttonText: "Explore Brunch",
        imageSource: 'https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        discount: '40%',
        category: 'brunch',
        priority: 2,
        tags: ['premium', 'leisure', 'indulgent', 'family'],
        targetAudience: ['families', 'couples', 'food-lovers'],
        validUntil: null,
        minOrderValue: 499,
        badge: 'WEEKEND SPECIAL',
        specialOffer: 'Complimentary dessert with brunch combos',
        ratings: 4.9,
        orderCount: '800+ orders today',
      },
    ],
    seasonal: {
      summer: [
        {
          id: 'breakfast_summer_cool',
          title: "Cool Mornings",
          subtitle: "Refreshing cold breakfast for hot summer days!",
          buttonText: "Stay Cool",
          imageSource: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop',
          discount: '30%',
          category: 'seasonal',
          priority: 1,
          tags: ['cold', 'refreshing', 'summer', 'smoothies'],
          targetAudience: ['all'],
          validUntil: '2024-08-31',
          minOrderValue: 199,
          badge: 'SUMMER SPECIAL',
          specialOffer: 'Free iced coffee with every order',
          ratings: 4.7,
          orderCount: '1.2k+ orders today',
        }
      ],
      winter: [
        {
          id: 'breakfast_winter_warm',
          title: "Warm Comfort",
          subtitle: "Hot breakfast to warm you up on cold mornings!",
          buttonText: "Get Warm",
          imageSource: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=300&h=200&fit=crop',
          discount: '35%',
          category: 'seasonal',
          priority: 1,
          tags: ['hot', 'comfort', 'winter', 'warming'],
          targetAudience: ['all'],
          validUntil: '2025-02-28',
          minOrderValue: 249,
          badge: 'WINTER WARMTH',
          specialOffer: 'Free hot chocolate with orders above ₹300',
          ratings: 4.8,
          orderCount: '2k+ orders today',
        }
      ]
    }
  },
  
  lunch: {
    weekday: [
      {
        id: 'lunch_power_meal',
        title: "Power Lunch",
        subtitle: "High-energy meals for productive afternoons!",
        buttonText: "Power Up",
        imageSource: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
        discount: '30%',
        category: 'power',
        priority: 1,
        tags: ['energy', 'productive', 'balanced', 'protein'],
        targetAudience: ['professionals', 'students', 'fitness'],
        validUntil: null,
        minOrderValue: 349,
        badge: 'ENERGY BOOST',
        specialOffer: 'Free energy drink with combo meals',
        ratings: 4.7,
        orderCount: '2.5k+ orders today',
      },
      {
        id: 'lunch_light_fresh',
        title: "Light & Fresh",
        subtitle: "Keep it light with our fresh lunch options!",
        buttonText: "Go Light",
        imageSource: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
        discount: '25%',
        category: 'light',
        priority: 2,
        tags: ['light', 'fresh', 'healthy', 'salads'],
        targetAudience: ['health-conscious', 'weight-watchers'],
        validUntil: null,
        minOrderValue: 299,
        badge: 'LIGHT MEAL',
        specialOffer: 'Free lemon water with salads',
        ratings: 4.5,
        orderCount: '1.8k+ orders today',
      }
    ],
    weekend: [
      {
        id: 'lunch_family_feast',
        title: "Family Feast",
        subtitle: "Perfect portions for the whole family!",
        buttonText: "Family Time",
        imageSource: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
        discount: '45%',
        category: 'family',
        priority: 1,
        tags: ['family', 'sharing', 'variety', 'combo'],
        targetAudience: ['families'],
        validUntil: null,
        minOrderValue: 799,
        badge: 'FAMILY PACK',
        specialOffer: 'Free dessert platter with family combos',
        ratings: 4.8,
        orderCount: '600+ orders today',
      }
    ]
  },
  
  snacks: {
    weekday: [
      {
        id: 'snacks_healthy_bite',
        title: "Smart Snacking",
        subtitle: "Guilt-free snacks to keep you satisfied!",
        buttonText: "Snack Smart",
        imageSource: 'https://images.unsplash.com/photo-1559656914-a30970c1affd?w=300&h=200&fit=crop',
        discount: '25%',
        category: 'healthy',
        priority: 1,
        tags: ['healthy', 'guilt-free', 'nutritious', 'baked'],
        targetAudience: ['health-conscious', 'fitness', 'office-goers'],
        validUntil: null,
        minOrderValue: 149,
        badge: 'GUILT-FREE',
        specialOffer: 'Buy 2 get 1 free on healthy snacks',
        ratings: 4.4,
        orderCount: '3.2k+ orders today',
      }
    ],
    weekend: [
      {
        id: 'snacks_weekend_treats',
        title: "Weekend Treats",
        subtitle: "Special treats for your relaxing weekend!",
        buttonText: "Treat Yourself",
        imageSource: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=300&h=200&fit=crop',
        discount: '35%',
        category: 'treats',
        priority: 1,
        tags: ['indulgent', 'special', 'weekend', 'desserts'],
        targetAudience: ['all'],
        validUntil: null,
        minOrderValue: 249,
        badge: 'WEEKEND ONLY',
        specialOffer: 'Free ice cream with dessert orders',
        ratings: 4.6,
        orderCount: '1.5k+ orders today',
      }
    ]
  },
  
  dinner: {
    weekday: [
      {
        id: 'dinner_comfort_meal',
        title: "Comfort Dinner",
        subtitle: "Hearty meals to end your day perfectly!",
        buttonText: "Get Comfort",
        imageSource: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop',
        discount: '35%',
        category: 'comfort',
        priority: 1,
        tags: ['hearty', 'comfort', 'satisfying', 'traditional'],
        targetAudience: ['families', 'comfort-seekers', 'traditional'],
        validUntil: null,
        minOrderValue: 399,
        badge: 'COMFORT FOOD',
        specialOffer: 'Free soup with dinner combos',
        ratings: 4.7,
        orderCount: '2.8k+ orders today',
      }
    ],
    weekend: [
      {
        id: 'dinner_weekend_special',
        title: "Weekend Special",
        subtitle: "Premium dinner experiences for the weekend!",
        buttonText: "Book Special",
        imageSource: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=300&h=200&fit=crop',
        discount: '50%',
        category: 'special',
        priority: 1,
        tags: ['premium', 'special', 'experience', 'gourmet'],
        targetAudience: ['couples', 'special-occasions', 'food-lovers'],
        validUntil: null,
        minOrderValue: 899,
        badge: 'PREMIUM',
        specialOffer: 'Complimentary wine with premium dinners',
        ratings: 4.9,
        orderCount: '400+ orders today',
      }
    ]
  }
};

// Enhanced PromoDataManager class with debug logging
export class PromoDataManager {
  constructor() {
    this.cache = new Map();
    this.lastFetchTime = new Map();
    this.listeners = new Set();
  }

  // Event listener management
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.warn('Listener error:', error);
      }
    });
  }

  // Time and context utilities
  getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'fall';
    return 'winter';
  }

  isWeekend() {
    const day = new Date().getDay();
    const isWeekendResult = day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
    console.log(`[PromoManager] Weekend check: day=${day}, isWeekend=${isWeekendResult}`);
    return isWeekendResult;
  }

  getCurrentMealType() {
    const hour = new Date().getHours();
    
    if (hour >= PROMO_CONFIG.MEAL_TIME_RANGES.breakfast.start && 
        hour < PROMO_CONFIG.MEAL_TIME_RANGES.breakfast.end) {
      return 'breakfast';
    }
    if (hour >= PROMO_CONFIG.MEAL_TIME_RANGES.lunch.start && 
        hour < PROMO_CONFIG.MEAL_TIME_RANGES.lunch.end) {
      return 'lunch';
    }
    if (hour >= PROMO_CONFIG.MEAL_TIME_RANGES.snacks.start && 
        hour < PROMO_CONFIG.MEAL_TIME_RANGES.snacks.end) {
      return 'snacks';
    }
    return 'dinner';
  }

  getTimeContext() {
    const hour = new Date().getHours();
    const isWeekend = this.isWeekend();
    const season = this.getCurrentSeason();
    const mealType = this.getCurrentMealType();
    
    const context = {
      hour,
      isWeekend,
      season,
      mealType,
      timeOfDay: this.getTimeOfDay(hour),
    };
    
    console.log(`[PromoManager] Time context:`, context);
    return context;
  }

  getTimeOfDay(hour) {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  // User profile filtering with debug logs
  filterByUserProfile(promos, userProfile) {
    if (!userProfile) {
      console.log(`[PromoManager] No user profile provided, returning all ${promos.length} promos`);
      return promos;
    }

    const filtered = promos.filter(promo => {
      // Target audience filtering
      if (promo.targetAudience && userProfile.audience) {
        const hasMatch = promo.targetAudience.some(audience => 
          userProfile.audience.includes(audience) || audience === 'all'
        );
        if (!hasMatch) {
          console.log(`[PromoManager] Filtering out ${promo.id} - target audience mismatch`);
          return false;
        }
      }

      // Dietary restrictions
      if (userProfile.dietaryRestrictions && promo.tags) {
        const restrictions = userProfile.dietaryRestrictions;
        if (restrictions.includes('vegetarian') && promo.tags.includes('non-vegetarian')) {
          console.log(`[PromoManager] Filtering out ${promo.id} - vegetarian restriction`);
          return false;
        }
        if (restrictions.includes('vegan') && 
            (promo.tags.includes('dairy') || promo.tags.includes('meat'))) {
          console.log(`[PromoManager] Filtering out ${promo.id} - vegan restriction`);
          return false;
        }
        if (restrictions.includes('gluten-free') && promo.tags.includes('gluten')) {
          console.log(`[PromoManager] Filtering out ${promo.id} - gluten-free restriction`);
          return false;
        }
      }

      // Budget filtering
      if (userProfile.budgetRange) {
        const [minBudget, maxBudget] = userProfile.budgetRange;
        if (promo.minOrderValue > maxBudget) {
          console.log(`[PromoManager] Filtering out ${promo.id} - budget too high (${promo.minOrderValue} > ${maxBudget})`);
          return false;
        }
      }

      // Allergy filtering
      if (userProfile.allergies && promo.tags) {
        const hasAllergen = userProfile.allergies.some(allergy => 
          promo.tags.includes(allergy.toLowerCase())
        );
        if (hasAllergen) {
          console.log(`[PromoManager] Filtering out ${promo.id} - allergy conflict`);
          return false;
        }
      }

      return true;
    });

    console.log(`[PromoManager] User profile filtering: ${promos.length} -> ${filtered.length} promos`);
    return filtered;
  }

  // Validity filtering with debug logs
  filterByValidity(promos) {
    const now = new Date();
    const filtered = promos.filter(promo => {
      if (!promo.validUntil) return true;
      const isValid = new Date(promo.validUntil) > now;
      if (!isValid) {
        console.log(`[PromoManager] Filtering out expired promo: ${promo.id}`);
      }
      return isValid;
    });

    console.log(`[PromoManager] Validity filtering: ${promos.length} -> ${filtered.length} promos`);
    return filtered;
  }

  // Theme application
  applyThemeToPromo(promo, mealType) {
    const theme = PROMO_CONFIG.MEAL_THEMES[mealType];
    if (!theme) return promo;

    return {
      ...promo,
      theme: {
        backgroundColor: theme.backgroundColor,
        primaryColor: theme.primaryColor,
        accentColor: theme.accentColor,
        gradientColors: theme.gradientColors,
      }
    };
  }

  // Enhanced main promo retrieval method with comprehensive debug logging
  async getPromos(mealType, userProfile = null, options = {}) {
    const { forceRefresh = false, limit = PROMO_CONFIG.MAX_PROMOS_PER_MEAL } = options;
    
    console.log(`[PromoManager] Getting promos for ${mealType}, limit=${limit}, forceRefresh=${forceRefresh}`);
    
    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = await this.getCachedPromos(mealType);
        if (cached) {
          console.log(`[PromoManager] Returning ${cached.length} cached promos`);
          this.notifyListeners('promos_loaded', { mealType, source: 'cache' });
          return cached.slice(0, limit);
        }
      }

      // Get fresh promos
      const mealData = PROMO_DATA[mealType];
      if (!mealData) {
        throw new Error(`No data found for meal type: ${mealType}`);
      }

      console.log(`[PromoManager] Meal data structure:`, {
        hasWeekday: !!mealData.weekday,
        weekdayCount: mealData.weekday?.length || 0,
        hasWeekend: !!mealData.weekend,
        weekendCount: mealData.weekend?.length || 0,
        hasSeasonal: !!mealData.seasonal
      });

      const context = this.getTimeContext();
      let availablePromos = [];

      // Collect promos based on context with detailed logging
      if (context.isWeekend && mealData.weekend) {
        console.log(`[PromoManager] Adding ${mealData.weekend.length} weekend promos`);
        availablePromos.push(...mealData.weekend);
      } else if (!context.isWeekend && mealData.weekday) {
        console.log(`[PromoManager] Adding ${mealData.weekday.length} weekday promos`);
        availablePromos.push(...mealData.weekday);
      }

      // Add seasonal promos
      if (mealData.seasonal && mealData.seasonal[context.season]) {
        const seasonalPromos = mealData.seasonal[context.season];
        console.log(`[PromoManager] Adding ${seasonalPromos.length} seasonal promos for ${context.season}`);
        availablePromos.push(...seasonalPromos);
      }

      console.log(`[PromoManager] Total promos before filtering: ${availablePromos.length}`);
      console.log(`[PromoManager] Promo IDs: ${availablePromos.map(p => p.id).join(', ')}`);

      // Apply filters with logging
      const beforeUserFilter = availablePromos.length;
      availablePromos = this.filterByUserProfile(availablePromos, userProfile);
      console.log(`[PromoManager] After user profile filter: ${beforeUserFilter} -> ${availablePromos.length}`);

      const beforeValidityFilter = availablePromos.length;
      availablePromos = this.filterByValidity(availablePromos);
      console.log(`[PromoManager] After validity filter: ${beforeValidityFilter} -> ${availablePromos.length}`);

      // Apply themes
      availablePromos = availablePromos.map(promo => 
        this.applyThemeToPromo(promo, mealType)
      );

      // Sort by priority
      availablePromos.sort((a, b) => (a.priority || 999) - (b.priority || 999));

      // Limit results
      const result = availablePromos.slice(0, limit);
      
      console.log(`[PromoManager] Final result: ${result.length} promos`);
      console.log(`[PromoManager] Final promo IDs: ${result.map(p => p.id).join(', ')}`);

      // Cache results
      await this.cachePromos(mealType, result);

      this.notifyListeners('promos_loaded', { mealType, source: 'fresh', count: result.length });
      return result;

    } catch (error) {
      console.error('[PromoManager] Error getting promos:', error);
      this.notifyListeners('promos_error', { mealType, error: error.message });
      throw error;
    }
  }

  // Cache management
  async cachePromos(mealType, promos) {
    const key = `promos_${mealType}`;
    const cacheData = {
      data: promos,
      timestamp: Date.now(),
      mealType,
    };

    this.cache.set(key, cacheData);
    this.lastFetchTime.set(key, Date.now());
    
    try {
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache promos:', error);
    }
  }

  async getCachedPromos(mealType) {
    const key = `promos_${mealType}`;
    
    // Check memory cache
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      if (Date.now() - cached.timestamp < PROMO_CONFIG.CACHE_DURATION) {
        return cached.data;
      }
    }

    // Check persistent storage
    try {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        const cacheData = JSON.parse(cached);
        if (Date.now() - cacheData.timestamp < PROMO_CONFIG.CACHE_DURATION) {
          this.cache.set(key, cacheData);
          return cacheData.data;
        }
      }
    } catch (error) {
      console.warn('Failed to get cached promos:', error);
    }

    return null;
  }

  // Test method to force weekend mode (for debugging)
  forceWeekendMode(enabled = true) {
    const originalIsWeekend = this.isWeekend;
    if (enabled) {
      this.isWeekend = () => {
        console.log(`[PromoManager] Forced weekend mode: returning true`);
        return true;
      };
    } else {
      this.isWeekend = originalIsWeekend;
    }
  }

  // Analytics and tracking
  trackPromoView(promoId, mealType, context = {}) {
    this.notifyListeners('promo_viewed', { promoId, mealType, context, timestamp: Date.now() });
  }

  trackPromoClick(promoId, mealType, context = {}) {
    this.notifyListeners('promo_clicked', { promoId, mealType, context, timestamp: Date.now() });
  }

  // Utility methods
  getPromoById(promoId) {
    for (const mealType of Object.keys(PROMO_DATA)) {
      const mealData = PROMO_DATA[mealType];
      
      const searchInArray = (promos) => {
        const found = promos.find(p => p.id === promoId);
        return found ? this.applyThemeToPromo(found, mealType) : null;
      };

      // Search in weekday promos
      if (mealData.weekday) {
        const found = searchInArray(mealData.weekday);
        if (found) return found;
      }

      // Search in weekend promos
      if (mealData.weekend) {
        const found = searchInArray(mealData.weekend);
        if (found) return found;
      }

      // Search in seasonal promos
      if (mealData.seasonal) {
        for (const season of Object.keys(mealData.seasonal)) {
          const found = searchInArray(mealData.seasonal[season]);
          if (found) return found;
        }
      }
    }
    return null;
  }

  async clearCache() {
    this.cache.clear();
    this.lastFetchTime.clear();
    
    try {
      const keys = await AsyncStorage.getAllKeys();
      const promoKeys = keys.filter(key => key.startsWith('promos_'));
      await AsyncStorage.multiRemove(promoKeys);
    } catch (error) {
      console.warn('Failed to clear promo cache:', error);
    }
  }
}

// User profile utilities (unchanged
// User profile utilities
export const createUserProfile = (preferences = {}) => {
  return {
    audience: preferences.audience || ['general'],
    dietaryRestrictions: preferences.dietaryRestrictions || [],
    budgetRange: preferences.budgetRange || [0, 2000],
    favoriteCategories: preferences.favoriteCategories || [],
    allergies: preferences.allergies || [],
    mealPreferences: preferences.mealPreferences || {},
    location: preferences.location || null,
    orderHistory: preferences.orderHistory || [],
    ...preferences
  };
};

// Sample user profiles for testing
export const SAMPLE_USER_PROFILES = {
  healthyEater: createUserProfile({
    audience: ['health-conscious', 'fitness'],
    dietaryRestrictions: ['vegetarian', 'gluten-free'],
    budgetRange: [200, 600],
    favoriteCategories: ['healthy', 'organic', 'light'],
    allergies: ['nuts'],
  }),
  
  busyProfessional: createUserProfile({
    audience: ['professionals', 'busy-professionals'],
    budgetRange: [300, 800],
    favoriteCategories: ['quick', 'energy', 'convenience'],
    mealPreferences: { preferQuickMeals: true },
  }),
  
  family: createUserProfile({
    audience: ['families'],
    budgetRange: [500, 1500],
    favoriteCategories: ['family', 'sharing', 'variety', 'combo'],
    mealPreferences: { familySize: 4 },
  }),
  
  student: createUserProfile({
    audience: ['students'],
    budgetRange: [100, 400],
    favoriteCategories: ['quick', 'budget', 'convenient'],
    mealPreferences: { budgetConscious: true },
  }),

  foodLover: createUserProfile({
    audience: ['food-lovers', 'gourmet'],
    budgetRange: [400, 2000],
    favoriteCategories: ['premium', 'special', 'gourmet'],
    mealPreferences: { premiumExperience: true },
  }),
};

// Export singleton instance
export const promoManager = new PromoDataManager();