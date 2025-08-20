import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Card, XStack, YStack } from 'tamagui';

const MealCard = ({ 
  mealName, 
  calories, 
  prepTime, 
  rating = 4.5, 
  imageUri, 
  onPress,
  width = 160 
}) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Text key={i} style={styles.starFilled}>★</Text>);
      } else {
        stars.push(<Text key={i} style={styles.starEmpty}>☆</Text>);
      }
    }
    return stars;
  };

  return (
    <Card
      style={[styles.mealCard, { width }]}
      backgroundColor="$background"
      borderRadius={16}
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.1}
      shadowRadius={8}
      elevation={4}
      marginBottom={20}
      marginRight={15}
    >
      <TouchableOpacity onPress={onPress}>
        <YStack>
          <YStack style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.mealImage} />
            <TouchableOpacity style={styles.heartContainer}>
              <Text style={styles.heartIcon}>🤍</Text>
            </TouchableOpacity>
          </YStack>
          
          <YStack style={styles.cardInfo} space="$1">
            <Text style={styles.mealName}>{mealName}</Text>
            <Text style={styles.caloriesText}>{calories}</Text>
            
            <YStack style={styles.ratingTimeContainer} space="$1">
              <XStack style={styles.starsContainer}>
                {renderStars(rating)}
              </XStack>
              <Text style={styles.timeText}>⏱ {prepTime}</Text>
            </YStack>
          </YStack>
        </YStack>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  mealCard: {
    backgroundColor: '#FFF',
  },
  imageContainer: {
    position: 'relative',
  },
  mealImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  heartContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 16,
  },
  cardInfo: {
    padding: 12,
  },
  mealName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 18,
  },
  caloriesText: {
    fontSize: 14,
    color: '#666',
  },
  ratingTimeContainer: {
    marginTop: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starFilled: {
    color: '#FFD700',
    fontSize: 12,
  },
  starEmpty: {
    color: '#DDD',
    fontSize: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
});

export default MealCard;