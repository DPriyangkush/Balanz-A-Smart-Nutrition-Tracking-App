import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { YStack } from 'tamagui';

const GreetingSection = ({ 
  userName = "Priyangkush", 
  mealCount = 202,
  customGreeting,
  customSubtext 
}) => {
  const greeting = customGreeting || `Hello, ${userName}`;
  const subtext = customSubtext || [
    `There are ${mealCount} healthy meal`,
    'options for you.'
  ];

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

const styles = StyleSheet.create({
  greetingSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 5,
  },
  subGreeting: {
    fontSize: 20,
    color: '#666',
    lineHeight: 24,
  },
});

export default GreetingSection;