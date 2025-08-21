import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, AppState, Dimensions } from 'react-native';

const RandomQuoteCard = () => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);

  // Get screen dimensions for responsive design
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Responsive calculations
  const isTablet = screenWidth >= 768;
  const isLargeScreen = screenWidth >= 1024;
  const isSmallScreen = screenWidth < 375;
  
  // Dynamic sizing based on screen dimensions
  const horizontalPadding = Math.min(Math.max(screenWidth * 0.05, 16), 32);
  const verticalPadding = Math.min(Math.max(screenHeight * 0.015, 12), 24);
  const quoteFontSize = Math.min(Math.max(screenWidth * 0.04, 14), 20);
  const authorFontSize = Math.min(Math.max(screenWidth * 0.035, 12), 18);
  const lineHeight = quoteFontSize * 1.5;
  const marginBottom = Math.min(Math.max(screenHeight * 0.008, 5), 12);

  // Collection of diet, fitness, and nutrition quotes
  const quotes = [
    {
      text: "Your body is a temple. Keep it pure and clean for the soul to reside in.",
      author: "B.K.S. Iyengar",
      category: "wellness"
    },
    {
      text: "Let food be thy medicine and medicine be thy food.",
      author: "Hippocrates",
      category: "nutrition"
    },
    {
      text: "The groundwork for all happiness is good health.",
      author: "Leigh Hunt",
      category: "wellness"
    },
    {
      text: "Fitness is not about being better than someone else. It's about being better than you used to be.",
      author: "Khloe Kardashian",
      category: "fitness"
    },
    {
      text: "You don't have to be extreme, just consistent.",
      author: "Unknown",
      category: "fitness"
    },
    {
      text: "A healthy outside starts from the inside.",
      author: "Robert Urich",
      category: "wellness"
    },
    {
      text: "Don't put off tomorrow what you can do today. Your future self will thank you.",
      author: "Unknown",
      category: "motivation"
    },
    {
      text: "Eat well, move daily, hydrate often, sleep soundly, think positively.",
      author: "Unknown",
      category: "wellness"
    },
    {
      text: "The pain you feel today will be the strength you feel tomorrow.",
      author: "Unknown",
      category: "fitness"
    },
    {
      text: "Healthy eating is a form of self-respect.",
      author: "Unknown",
      category: "nutrition"
    },
    {
      text: "Your only limit is your mind.",
      author: "Unknown",
      category: "motivation"
    },
    {
      text: "Good things come to those who sweat.",
      author: "Unknown",
      category: "fitness"
    },
    {
      text: "Strive for progress, not perfection.",
      author: "Unknown",
      category: "motivation"
    },
    {
      text: "The best project you'll ever work on is you.",
      author: "Unknown",
      category: "motivation"
    },
    {
      text: "Small changes in your eating habits can lead to big changes in your health.",
      author: "Unknown",
      category: "nutrition"
    },
    {
      text: "Exercise is king, nutrition is queen, together they create a kingdom.",
      author: "Jack LaLanne",
      category: "wellness"
    },
    {
      text: "Your health is an investment, not an expense.",
      author: "Unknown",
      category: "wellness"
    },
    {
      text: "What seems impossible today will one day become your warm-up.",
      author: "Unknown",
      category: "fitness"
    },
    {
      text: "Don't wish for it, work for it.",
      author: "Unknown",
      category: "motivation"
    },
    {
      text: "A journey of a thousand miles begins with a single step.",
      author: "Lao Tzu",
      category: "motivation"
    }
  ];

  // Function to get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  // Function to get category color
  const getCategoryColor = (category) => {
    const colors = {
      nutrition: '#34C759',
      fitness: '#FF6B6B',
      wellness: '#5856D6',
      motivation: '#FF9500'
    };
    return colors[category] || '#666';
  };

  // Initialize quote on component mount
  useEffect(() => {
    setCurrentQuote(getRandomQuote());
  }, []);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to foreground from background/inactive state
        setCurrentQuote(getRandomQuote());
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [appState]);

  if (!currentQuote) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.quoteText}>
        "{currentQuote.text}"
      </Text>
      <Text style={[
        styles.authorText,
        { color: getCategoryColor(currentQuote.category) }
      ]}>
        — {currentQuote.author}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 16,
    color: '#2D2419',
    fontWeight: '400',
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 5,
  },
  authorText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default RandomQuoteCard;