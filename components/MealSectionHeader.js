import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { XStack, YStack } from 'tamagui';

const MealSectionHeader = ({ 
  title, 
  badgeText, 
  badgeIcon, 
  showBadge = true, 
  onArrowPress 
}) => {
  return (
    <YStack space="$3">
      {/* Section Title with Arrow */}
      <XStack justifyContent="space-between" alignItems="center">
        <Text style={styles.sectionTitle}>{title}</Text>
        {onArrowPress && (
          <TouchableOpacity onPress={onArrowPress}>
            <Text style={styles.arrow}>More</Text>
          </TouchableOpacity>
        )}
      </XStack>

      {/* Badge */}
      {showBadge && (
        <XStack 
          style={styles.badge}
          alignItems="center" 
          gap="$2"
          alignSelf="flex-start"
        >
          <Text style={styles.badgeIcon}>{badgeIcon}</Text>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </XStack>
      )}
    </YStack>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  arrow: {
    fontSize: 16,
    color: '#333',
  },
  badge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeIcon: {
    fontSize: 16,
  },
  badgeText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
});

export default MealSectionHeader;