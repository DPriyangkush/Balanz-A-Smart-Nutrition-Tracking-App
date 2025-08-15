import React, { useState, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { YStack, XStack, Card, Text, styled } from 'tamagui';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import ProgressBar from '../components/ProgressBar';
import FullWidthButton from 'components/FullWidthButton';
import { View, Animated, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const goals = [
  {
    id: 'Lose Weight',
    title: 'Lose Weight',
    description: 'Burn calories and reduce body fat',
    icon: <Feather name="activity" size={20} color="#f40101ff" />,
  },
  {
    id: 'Gain Muscle',
    title: 'Gain Muscle',
    description: 'Build strength and muscle mass',
    icon: <FontAwesome5 name="dumbbell" size={20} color="#ff0000ff" />,
  },
  {
    id: 'Maintain Weight',
    title: 'Maintain Weight',
    description: 'Stay healthy and maintain current weight',
    icon: <Feather name="heart" size={20} color="#ff0000ff" />,
  },
];

const horizontalMargin = screenWidth * 0.025; // ~2.5% of screen width

const SelectableCard = styled(Card, {
  padding: 16,
  borderRadius: 18,
  borderWidth: 1,
  borderColor: '#e2e8f0',
  pressStyle: { scale: 0.97 },
  marginHorizontal: horizontalMargin,
  marginBottom: 10,
});

const GoalPreferenceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [selectedGoal, setSelectedGoal] = useState('');
  const layoutsRef = useRef({});
  const animatedTop = useRef(new Animated.Value(0)).current;
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const [indicatorVisible, setIndicatorVisible] = useState(false);

  const handleCardLayout = (id, layout) => {
    layoutsRef.current[id] = layout;
    if (selectedGoal === id) {
      animatedTop.setValue(layout.y);
      animatedHeight.setValue(layout.height);
      setIndicatorVisible(true);
    }
  };

  const handleCardPress = (id) => {
    setSelectedGoal(id);
    const layout = layoutsRef.current[id];
    if (layout) {
      setIndicatorVisible(true);
      Animated.spring(animatedTop, {
        toValue: layout.y,
        useNativeDriver: false,
        damping: 20,
        stiffness: 600,
      }).start();
      Animated.spring(animatedHeight, {
        toValue: layout.height,
        useNativeDriver: false,
        damping: 20,
        stiffness: 600,
      }).start();
    }
  };

  const handleContinue = async () => {
    await updateDoc(doc(db, 'users', userId), {
      fitnessGoal: selectedGoal,
    });
    navigation.navigate('DietPreferenceScreen', { userId });
  };

  return (
    <YStack f={1} p="$4" marginTop={'$10'}>
      <ProgressBar step={2} />

      <Text fontSize={20} color="#fff" fontWeight="700" mt="$4" textAlign="center">
        What's your primary goal?
      </Text>
      <Text fontSize={14} color="$gray10" mt={'$1'} mb={'$4'} textAlign="center">
        Choose your main fitness objective
      </Text>

      <View style={{ position: 'relative' }}>
        {indicatorVisible && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: horizontalMargin,
              right: horizontalMargin,
              top: animatedTop,
              height: animatedHeight,
              backgroundColor: '#c0ffbbff',
              borderRadius: 18,
              borderWidth: 1,
              borderColor: '#c0ffbbff',
            }}
          />
        )}

        {goals.map((goal) => (
          <SelectableCard
            key={goal.id}
            elevate
            bordered
            backgroundColor={selectedGoal === goal.id ? '#c0ffbbff' : '#fff'}
            borderColor={selectedGoal === goal.id ? '#c0ffbbff' : '#e2e8f0'}
            onLayout={(e) => handleCardLayout(goal.id, e.nativeEvent.layout)}
            onPress={() => handleCardPress(goal.id)}
          >
            <XStack alignItems="center" gap="$4" height={100} flexWrap="wrap">
              {goal.icon}
              <YStack flexShrink={1} flex={1} mt={35}>
                <Text
                  fontSize={17}
                  fontWeight="600"
                  color="#1e1e1e"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {goal.title}
                </Text>
                <Text fontSize={16} color="$gray10" flexWrap="wrap">
                  {goal.description}
                </Text>
              </YStack>
            </XStack>
          </SelectableCard>
        ))}
      </View>

      <YStack mt={'$4'}>
        <FullWidthButton
          title="Next"
          backgroundColor={selectedGoal ? '#0f172a' : '#94a3b8'}
          disabled={!selectedGoal}
          onPress={handleContinue}
        />
      </YStack>
    </YStack>
  );
};

export default GoalPreferenceScreen;
