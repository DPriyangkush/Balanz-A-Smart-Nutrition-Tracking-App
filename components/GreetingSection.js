import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import { YStack } from 'tamagui';

const { width } = Dimensions.get('window');

// Responsive font sizes based on screen width
const getResponsiveFontSize = (baseSize, minSize, maxSize) => {
  const scale = width / 375; // Using iPhone X width as base
  const scaledSize = baseSize * scale;
  return Math.min(Math.max(scaledSize, minSize), maxSize);
};

// Responsive spacing based on screen width
const getResponsiveSpacing = (baseSpacing) => {
  const scale = width / 375;
  return Math.max(baseSpacing * scale, baseSpacing * 0.7);
};

const GreetingSection = ({
  userName = "Priyangkush",
  mealCount = 369,
  customGreeting,
  customSubtext
}) => {
  const greeting = customGreeting || `Hello, ${userName}`;
  const subtext = customSubtext || [
    `There are ${mealCount} healthy meal`,
    'options for you.'
  ];

  const styles = StyleSheet.create({
    greetingSection: {
      marginTop: getResponsiveSpacing(20),
      marginBottom: getResponsiveSpacing(20),
    },
    greeting: {
      fontSize: getResponsiveFontSize(28, 20, 32),
      fontWeight: 'bold',
      color: '#2D5016',
      marginBottom: getResponsiveSpacing(5),
      textAlign: width < 350 ? 'left' : 'left', // Maintain left alignment
      lineHeight: getResponsiveFontSize(38, 28, 46),
    },
    subGreeting: {
      fontSize: getResponsiveFontSize(16, 10, 24),
      color: '#666',
      lineHeight: getResponsiveFontSize(24, 20, 28),
      flexWrap: 'wrap', // Allow text wrapping on smaller screens
    },
  });

  return (
    <YStack style={styles.greetingSection} space="$1">
      <Text style={styles.greeting}>{greeting}</Text>
      {Array.isArray(subtext) ? (
        subtext.map((line, index) => (
          <Text key={index} style={styles.subGreeting}>{line}</Text>
        ))
      ) : (
        <Text style={styles.subGreeting}>{subtext}</Text>
      )}
    </YStack>
  );
};

export default GreetingSection;