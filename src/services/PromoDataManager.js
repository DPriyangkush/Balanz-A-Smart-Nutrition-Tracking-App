// Enhanced PromoDataManager.js - Expanded weekend data and improved filtering
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

// Significantly expanded promo data structure with more weekend options
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
        id: 'breakfast_weekend_brunch_deluxe',
        title: "Weekend Brunch Deluxe",
        subtitle: "Leisurely brunch specials for your weekend relaxation!",
        buttonText: "Explore Brunch",
        imageSource: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
        discount: '40%',
        category: 'brunch',
        priority: 1,
        tags: ['premium', 'leisure', 'indulgent', 'family'],
        targetAudience: ['families', 'couples', 'food-lovers'],
        validUntil: null,
        minOrderValue: 499,
        
        specialOffer: 'Complimentary dessert with brunch combos',
        
      },
      {
        id: 'breakfast_weekend_family_feast',
        title: "Family Weekend Feast",
        subtitle: "Perfect sharing portions for the whole family!",
        buttonText: "Family Time",
        imageSource: 'https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?w=300&h=200&fit=crop',
        discount: '45%',
        category: 'family',
        priority: 2,
        tags: ['family', 'sharing', 'variety', 'weekend'],
        targetAudience: ['families', 'large-groups'],
        validUntil: null,
        minOrderValue: 699,
        
        specialOffer: 'Free family game with orders above ₹800',
        
      },
      {
        id: 'breakfast_weekend_lazy_morning',
        title: "Lazy Morning Treats",
        subtitle: "Indulgent breakfast for those slow weekend mornings!",
        buttonText: "Indulge Now",
        imageSource: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=300&h=200&fit=crop',
        discount: '35%',
        category: 'indulgent',
        priority: 3,
        tags: ['indulgent', 'comfort', 'sweet', 'weekend'],
        targetAudience: ['comfort-seekers', 'sweet-tooth'],
        validUntil: null,
        minOrderValue: 399,
        
        specialOffer: 'Free hot chocolate with pancake orders',
        
      },
      {
        id: 'breakfast_weekend_healthy_brunch',
        title: "Healthy Weekend Brunch",
        subtitle: "Nutritious yet delicious weekend breakfast options!",
        buttonText: "Eat Clean",
        imageSource: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop',
        discount: '30%',
        category: 'healthy-weekend',
        priority: 4,
        tags: ['healthy', 'organic', 'fresh', 'weekend'],
        targetAudience: ['health-conscious', 'fitness'],
        validUntil: null,
        minOrderValue: 349,
        
        specialOffer: 'Free fresh juice with healthy combos',
        ratings: 4.6,
        orderCount: '750+ orders today',
      },
      {
        id: 'breakfast_weekend_continental',
        title: "Continental Weekend",
        subtitle: "European-style breakfast for sophisticated weekends!",
        buttonText: "Go Continental",
        imageSource: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
        discount: '38%',
        category: 'continental',
        priority: 5,
        tags: ['continental', 'sophisticated', 'premium', 'weekend'],
        targetAudience: ['sophisticated', 'couples'],
        validUntil: null,
        minOrderValue: 549,
        
        specialOffer: 'Free croissant with continental breakfast',
        ratings: 4.8,
        orderCount: '500+ orders today',
      }
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
      },
      {
        id: 'lunch_express_meal',
        title: "Express Lunch",
        subtitle: "Quick and delicious meals for busy schedules!",
        buttonText: "Order Fast",
        imageSource: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop',
        discount: '20%',
        category: 'express',
        priority: 3,
        tags: ['quick', 'convenient', 'office', 'fast'],
        targetAudience: ['busy-professionals', 'students'],
        validUntil: null,
        minOrderValue: 249,
        badge: 'EXPRESS',
        specialOffer: 'Delivery in 15 minutes',
        ratings: 4.4,
        orderCount: '3.1k+ orders today',
      }
    ],
    weekend: [
      {
        id: 'lunch_weekend_family_feast',
        title: "Weekend Family Feast",
        subtitle: "Perfect portions for the whole family to enjoy together!",
        buttonText: "Family Time",
        imageSource: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
        discount: '45%',
        category: 'family',
        priority: 1,
        tags: ['family', 'sharing', 'variety', 'combo'],
        targetAudience: ['families'],
        validUntil: null,
        minOrderValue: 799,
        
        specialOffer: 'Free dessert platter with family combos',
       
      },
      {
        id: 'lunch_weekend_gourmet_special',
        title: "Weekend Gourmet",
        subtitle: "Premium lunch experiences for special weekends!",
        buttonText: "Go Gourmet",
        imageSource: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop',
        discount: '40%',
        category: 'gourmet',
        priority: 2,
        tags: ['premium', 'gourmet', 'special', 'weekend'],
        targetAudience: ['food-lovers', 'couples'],
        validUntil: null,
        minOrderValue: 649,
        
        specialOffer: 'Free appetizer with gourmet meals',
        
      },
      {
        id: 'lunch_weekend_comfort_bowl',
        title: "Weekend Comfort Bowl",
        subtitle: "Hearty comfort foods for relaxing weekend afternoons!",
        buttonText: "Get Comfort",
        imageSource: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=200&fit=crop',
        discount: '35%',
        category: 'comfort',
        priority: 3,
        tags: ['comfort', 'hearty', 'satisfying', 'weekend'],
        targetAudience: ['comfort-seekers', 'families'],
        validUntil: null,
        minOrderValue: 449,
      
        specialOffer: 'Free soup with comfort meals',
        
      },
      {
        id: 'lunch_weekend_healthy_deluxe',
        title: "Weekend Healthy Deluxe",
        subtitle: "Premium healthy options for wellness-focused weekends!",
        buttonText: "Eat Well",
        imageSource: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop',
        discount: '32%',
        category: 'healthy-premium',
        priority: 4,
        tags: ['healthy', 'premium', 'organic', 'weekend'],
        targetAudience: ['health-conscious', 'fitness'],
        validUntil: null,
        minOrderValue: 549,
        specialOffer: 'Free superfood drink with orders',
        ratings: 4.8,
        orderCount: '550+ orders today',
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
      },
      {
        id: 'snacks_energy_boost',
        title: "Energy Snacks",
        subtitle: "Power-packed snacks for instant energy boost!",
        buttonText: "Get Energy",
        imageSource: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&h=200&fit=crop',
        discount: '22%',
        category: 'energy',
        priority: 2,
        tags: ['energy', 'protein', 'nuts', 'boost'],
        targetAudience: ['fitness', 'students', 'professionals'],
        validUntil: null,
        minOrderValue: 199,
        badge: 'ENERGY',
        specialOffer: 'Free protein bar with energy combos',
        ratings: 4.5,
        orderCount: '2.8k+ orders today',
      }
    ],
    weekend: [
      {
        id: 'snacks_weekend_treats_premium',
        title: "Premium Weekend Treats",
        subtitle: "Indulgent treats for your special weekend moments!",
        buttonText: "Treat Yourself",
        imageSource: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=300&h=200&fit=crop',
        discount: '38%',
        category: 'premium-treats',
        priority: 1,
        tags: ['indulgent', 'premium', 'weekend', 'desserts'],
        targetAudience: ['all'],
        validUntil: null,
        minOrderValue: 299,
        
        specialOffer: 'Free premium ice cream with dessert orders',
        
      },
      {
        id: 'snacks_weekend_party_pack',
        title: "Weekend Party Pack",
        subtitle: "Perfect sharing snacks for weekend gatherings!",
        buttonText: "Party Time",
        imageSource: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop',
        discount: '42%',
        category: 'party',
        priority: 2,
        tags: ['sharing', 'party', 'variety', 'weekend'],
        targetAudience: ['families', 'friends', 'party-goers'],
        validUntil: null,
        minOrderValue: 499,
        specialOffer: 'Free party games with large orders',
      },
      {
        id: 'snacks_weekend_artisan',
        title: "Artisan Weekend Bites",
        subtitle: "Handcrafted gourmet snacks for discerning tastes!",
        buttonText: "Go Artisan",
        imageSource: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        discount: '35%',
        category: 'artisan',
        priority: 3,
        tags: ['artisan', 'handcrafted', 'gourmet', 'weekend'],
        targetAudience: ['food-lovers', 'sophisticated'],
        validUntil: null,
        minOrderValue: 399,
        specialOffer: 'Free artisan cheese with orders',
      },
      {
        id: 'snacks_weekend_comfort_bites',
        title: "Weekend Comfort Bites",
        subtitle: "Nostalgic comfort snacks for cozy weekend vibes!",
        buttonText: "Feel Comfort",
        imageSource: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
        discount: '30%',
        category: 'comfort',
        priority: 4,
        tags: ['comfort', 'nostalgic', 'cozy', 'weekend'],
        targetAudience: ['comfort-seekers', 'families'],
        validUntil: null,
        minOrderValue: 249,
        specialOffer: 'Free hot beverage with comfort snacks',
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
      },
      {
        id: 'dinner_healthy_choice',
        title: "Healthy Dinner",
        subtitle: "Nutritious yet delicious dinner options!",
        buttonText: "Eat Healthy",
        imageSource: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop',
        discount: '28%',
        category: 'healthy',
        priority: 2,
        tags: ['healthy', 'nutritious', 'balanced', 'fresh'],
        targetAudience: ['health-conscious', 'fitness'],
        validUntil: null,
        minOrderValue: 349,
        badge: 'HEALTHY',
        specialOffer: 'Free herbal tea with healthy meals',
        ratings: 4.6,
        orderCount: '2.2k+ orders today',
      }
    ],
    weekend: [
      {
        id: 'dinner_weekend_special_deluxe',
        title: "Weekend Special Deluxe",
        subtitle: "Premium dinner experiences for unforgettable weekends!",
        buttonText: "Book Special",
        imageSource: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=300&h=200&fit=crop',
        discount: '50%',
        category: 'special',
        priority: 1,
        tags: ['premium', 'special', 'experience', 'gourmet'],
        targetAudience: ['couples', 'special-occasions', 'food-lovers'],
        validUntil: null,
        minOrderValue: 899,
        
        specialOffer: 'Complimentary wine with premium dinners',
        
      },
      {
        id: 'dinner_weekend_family_celebration',
        title: "Family Weekend Celebration",
        subtitle: "Grand dinner spreads perfect for family celebrations!",
        buttonText: "Celebrate",
        imageSource: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
        discount: '45%',
        category: 'family-celebration',
        priority: 2,
        tags: ['family', 'celebration', 'grand', 'sharing'],
        targetAudience: ['families', 'large-groups'],
        validUntil: null,
        minOrderValue: 1299,
        specialOffer: 'Free celebration cake with large orders',
      },
      {
        id: 'dinner_weekend_romantic',
        title: "Romantic Weekend Dinner",
        subtitle: "Intimate dining experiences for couples!",
        buttonText: "Romance",
        imageSource: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop',
        discount: '40%',
        category: 'romantic',
        priority: 3,
        tags: ['romantic', 'intimate', 'couples', 'candlelight'],
        targetAudience: ['couples', 'romantic'],
        validUntil: null,
        minOrderValue: 799,
        specialOffer: 'Free roses and candles with romantic dinners',
      },
      {
        id: 'dinner_weekend_comfort_feast',
        title: "Weekend Comfort Feast",
        subtitle: "Ultimate comfort foods for relaxing weekend evenings!",
        buttonText: "Feast Now",
        imageSource: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop',
        discount: '38%',
        category: 'comfort-feast',
        priority: 4,
        tags: ['comfort', 'feast', 'hearty', 'satisfying'],
        targetAudience: ['comfort-seekers', 'families'],
        validUntil: null,
        minOrderValue: 699,
        specialOffer: 'Free comfort dessert with feast orders',
      },
      {
        id: 'dinner_weekend_international',
        title: "International Weekend",
        subtitle: "Global cuisines for adventurous weekend dining!",
        buttonText: "Go Global",
        imageSource: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop',
        discount: '35%',
        category: 'international',
        priority: 5,
        tags: ['international', 'global', 'exotic', 'adventure'],
        targetAudience: ['adventurous', 'food-lovers'],
        validUntil: null,
        minOrderValue: 599,
        specialOffer: 'Free international appetizer sampler',
      }
    ]
  }
};

// Enhanced PromoDataManager class with improved filtering and debugging
export class PromoDataManager {
  constructor() {
    this.cache = new Map();
    this.lastFetchTime = new Map();
    this.listeners = new Set();
    this.forceWeekendOverride = false;
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
    if (this.forceWeekendOverride) {
      console.log(`[PromoManager] Force weekend override: returning true`);
      return true;
    }
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

  // Enhanced user profile filtering with more permissive approach for fallback scenarios
  filterByUserProfile(promos, userProfile) {
    if (!userProfile) {
      console.log(`[PromoManager] No user profile provided, returning all ${promos.length} promos`);
      return promos;
    }

    const filtered = promos.filter(promo => {
      // Target audience filtering - be more permissive
      if (promo.targetAudience && userProfile.audience) {
        const hasMatch = promo.targetAudience.some(audience => 
          userProfile.audience.includes(audience) || audience === 'all'
        );
        // Don't filter out if no specific target audience match for fallback scenarios
        if (!hasMatch && promo.targetAudience.length > 0 && !promo.targetAudience.includes('all')) {
          console.log(`[PromoManager] Soft filtering ${promo.id} - target audience mismatch (will keep for fallback)`);
          // Don't return false here, keep the promo for fallback scenarios
        }
      }

      // Dietary restrictions - strict filtering
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

      // Budget filtering - be more permissive for weekends
      if (userProfile.budgetRange) {
        const [minBudget, maxBudget] = userProfile.budgetRange;
        // Allow 20% budget flexibility for weekend specials
        const flexibleBudget = this.isWeekend() ? maxBudget * 1.2 : maxBudget;
        if (promo.minOrderValue > flexibleBudget) {
          console.log(`[PromoManager] Filtering out ${promo.id} - budget too high (${promo.minOrderValue} > ${flexibleBudget})`);
          return false;
        }
      }

      // Allergy filtering - strict filtering
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

  // Enhanced main promo retrieval method with improved weekend data handling
  async getPromos(mealType, userProfile = null, options = {}) {
    const { forceRefresh = false, limit = PROMO_CONFIG.MAX_PROMOS_PER_MEAL } = options;
    
    console.log(`[PromoManager] Getting promos for ${mealType}, limit=${limit}, forceRefresh=${forceRefresh}`);
    
    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = await this.getCachedPromos(mealType);
        if (cached && cached.length >= 2) {
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

      console.log(`[PromoManager] Meal data structure for ${mealType}:`, {
        hasWeekday: !!mealData.weekday,
        weekdayCount: mealData.weekday?.length || 0,
        hasWeekend: !!mealData.weekend,
        weekendCount: mealData.weekend?.length || 0,
        hasSeasonal: !!mealData.seasonal
      });

      const context = this.getTimeContext();
      let availablePromos = [];

      // Collect promos based on context with detailed logging
      if (context.isWeekend && mealData.weekend && mealData.weekend.length > 0) {
        console.log(`[PromoManager] Adding ${mealData.weekend.length} weekend promos for ${mealType}`);
        availablePromos.push(...mealData.weekend);
      } 
      
      // Always add weekday promos as fallback, but prioritize weekend on weekends
      if (mealData.weekday && mealData.weekday.length > 0) {
        if (context.isWeekend) {
          console.log(`[PromoManager] Adding ${mealData.weekday.length} weekday promos as fallback for weekend`);
        } else {
          console.log(`[PromoManager] Adding ${mealData.weekday.length} weekday promos for ${mealType}`);
        }
        
        // Add weekday promos, but with lower priority on weekends
        const weekdayWithPriority = mealData.weekday.map(promo => ({
          ...promo,
          priority: context.isWeekend ? (promo.priority || 0) + 100 : (promo.priority || 0)
        }));
        availablePromos.push(...weekdayWithPriority);
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

      // Sort by priority (lower number = higher priority)
      availablePromos.sort((a, b) => (a.priority || 999) - (b.priority || 999));

      // Limit results
      const result = availablePromos.slice(0, limit);
      
      console.log(`[PromoManager] Final result: ${result.length} promos`);
      console.log(`[PromoManager] Final promo IDs: ${result.map(p => p.id).join(', ')}`);

      // Cache results if we have enough
      if (result.length >= 2) {
        await this.cachePromos(mealType, result);
      }

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
    this.forceWeekendOverride = enabled;
    console.log(`[PromoManager] Force weekend mode: ${enabled ? 'enabled' : 'disabled'}`);
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