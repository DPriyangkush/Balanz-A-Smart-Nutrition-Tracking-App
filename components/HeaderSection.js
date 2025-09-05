// HeaderSection.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Meal data configuration
const MEAL_DATA = {
  breakfast: {
    icon: '☀️',
    title: 'Start your day with a nutritious breakfast!',
    subtitle: 'Fuel your morning with energy',
    timeRange: { start: 5, end: 11 },
  },
  lunch: {
    icon: '🌞',
    title: 'Power through your day with a healthy lunch!',
    subtitle: 'Midday nutrition for sustained energy',
    timeRange: { start: 11, end: 16 },
  },
  snacks: {
    icon: '🍎',
    title: 'Smart snacking for better health!',
    subtitle: 'Healthy bites between meals',
    timeRange: { start: 14, end: 18 },
  },
  dinner: {
    icon: '🌙',
    title: 'End your day with a satisfying dinner!',
    subtitle: 'Evening nourishment for recovery',
    timeRange: { start: 18, end: 23 },
    
  },
};

const HeaderSection = ({ 
  userName = "Priyangkush", 
  mealType = "breakfast", // breakfast, lunch, snacks, dinner
  onSearchPress, 
  onNotificationPress, 
  onProfilePress,
  customTitle = null, // Optional custom title override
  showTimeGreeting = true // Show time-based greeting
}) => {
  const [greeting, setGreeting] = useState('Good Morning!');
  const [isOptimalTime, setIsOptimalTime] = useState(false);

  // Get meal configuration
  const mealConfig = MEAL_DATA[mealType] || MEAL_DATA.breakfast;

  // Function to get time-based greeting
  const getTimeBasedGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      return 'Good Morning!';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon!';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening!';
    } else {
      return 'Good Night!';
    }
  };

  // Check if current time is optimal for this meal
  const checkOptimalTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const { start, end } = mealConfig.timeRange;
    
    return hour >= start && hour < end;
  };

  // Get dynamic title based on time and meal type
  const getDynamicTitle = () => {
    if (customTitle) return customTitle;
    
    const now = new Date();
    const hour = now.getHours();
    const isOptimal = checkOptimalTime();

    // Time-specific messages
    const timeMessages = {
      breakfast: {
        optimal: "Perfect time for breakfast! 🌅",
        early: "A bit early, but breakfast prep time! ⏰",
        late: "Late breakfast? Better late than never! ☕",
        veryLate: "Brunch time! Let's make it special 🥞"
      },
      lunch: {
        optimal: "Lunch time! Let's refuel 🍽️",
        early: "Planning ahead for lunch? Smart! 📝",
        late: "Afternoon fuel needed! ⚡",
        veryLate: "Late lunch but still important! 🥗"
      },
      snacks: {
        optimal: "Perfect snack time! 🍎",
        early: "Early snack planning! 📋",
        late: "Evening snack? Choose wisely! 🥜",
        veryLate: "Night snack? Keep it light! 🍌"
      },
      dinner: {
        optimal: "Dinner time! Let's wind down 🍽️",
        early: "Early dinner prep? Excellent!👨‍🍳",
        late: "Late dinner? Keep it light! 🥗",
        veryLate: "Very late? Consider lighter options 🍵"
      }
    };

    const messages = timeMessages[mealType];
    
    if (isOptimal) return messages.optimal;
    if (hour < mealConfig.timeRange.start) return messages.early;
    if (hour < mealConfig.timeRange.end + 2) return messages.late;
    return messages.veryLate;
  };

  // Update greeting and optimal time check
  useEffect(() => {
    const updateTimeData = () => {
      setGreeting(getTimeBasedGreeting());
      setIsOptimalTime(checkOptimalTime());
    };

    // Set initial values
    updateTimeData();

    // Update every minute
    const interval = setInterval(updateTimeData, 60000);

    return () => clearInterval(interval);
  }, [mealType]);

  // Get greeting text based on meal type and time
  const getContextualGreeting = () => {
    if (!showTimeGreeting) return `Hi ${userName},`;
    
    const now = new Date();
    const hour = now.getHours();
    
    // Meal-specific greetings
    const mealGreetings = {
      breakfast: hour < 10 ? `Good morning, ${userName}!` : `Hi ${userName}!`,
      lunch: hour >= 11 && hour < 14 ? `Lunch time, ${userName}!` : `Hi ${userName}!`,
      snacks: `Snack time, ${userName}!`,
      dinner: hour >= 17 ? `Good evening, ${userName}!` : `Hi ${userName}!`,
    };
    
    return mealGreetings[mealType] || `Hi ${userName}!`;
  };

  return (
    <View style={[styles.container, { backgroundColor: mealConfig.backgroundColor }]}>
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          <Text style={[styles.greeting, { color: mealConfig.primaryColor }]}>
            {getContextualGreeting()}
          </Text>
          {showTimeGreeting && (
            <Text style={styles.subGreeting}>
              {greeting} {mealConfig.icon}
            </Text>
          )}
          {isOptimalTime && (
            <View style={[styles.optimalTimeBadge, { backgroundColor: mealConfig.primaryColor }]}>
              <Text style={styles.optimalTimeText}>Optimal Time!</Text>
            </View>
          )}
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
            <Ionicons name="search" size={24} color="#1e1e1e" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress}>
            <Ionicons name="notifications" size={24} color="#1e1e1e" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={[styles.mainTitle, { color: mealConfig.primaryColor }]}>
        {getDynamicTitle()}
      </Text>
      
      {mealConfig.subtitle && (
        <Text style={styles.subtitle}>
          {mealConfig.subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingTop: 10,
    paddingBottom: 20,
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  optimalTimeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  optimalTimeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  iconButton: {
    padding: 5,
  },
  profileButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 30,
    maxWidth: '90%',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    maxWidth: '85%',
  },
});

export default HeaderSection;