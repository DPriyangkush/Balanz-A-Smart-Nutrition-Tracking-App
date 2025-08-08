import React, { useState, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { YStack, XStack, Card, Text, styled } from 'tamagui';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import ProgressBar from '../components/ProgressBar';
import FullWidthButton from 'components/FullWidthButton';
import { View, Animated } from 'react-native';

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

const SelectableCard = styled(Card, {
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    pressStyle: { scale: 0.97 },
    marginLeft: 10,
    marginRight: 10,
});

const GoalPreferenceScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { userId } = route.params;

    const [selectedGoal, setSelectedGoal] = useState('');
    // store measured layouts of cards: { [id]: { y, height } }
    const layoutsRef = useRef({});

    // Animated values for indicator position / size
    const animatedTop = useRef(new Animated.Value(0)).current;
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const [indicatorVisible, setIndicatorVisible] = useState(false);

    const handleCardLayout = (id, layout) => {
        // layout is: { x, y, width, height } relative to the parent View
        layoutsRef.current[id] = layout;

        // if this card is already selected (e.g., initial state),
        // set indicator to match immediately
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
        // if layout isn't measured yet, the onLayout handler will set the indicator when it runs
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

            <Text fontSize={20} fontWeight="700" mt="$4" textAlign="center">
                What's your primary goal?
            </Text>
            <Text fontSize={14} color="$gray10" mt={'$1'} mb={'$4'} textAlign="center">
                Choose your main fitness objective
            </Text>

            {/* container: we measure card layouts relative to this container */}
            <View style={{ position: 'relative' }}>
                {/* Animated "bubble" indicator (rendered BEFORE cards so cards sit on top) */}
                {indicatorVisible && (
                    <Animated.View
                        pointerEvents="none"
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: animatedTop,
                            height: animatedHeight,
                            backgroundColor: '#c0ffbbff',
                            borderRadius: 15,
                            borderWidth: 1,
                            borderColor: '#c0ffbbff',
                            marginLeft: 10,
                            marginRight: 10,
                        }}
                    />
                )}

                {goals.map((goal) => (
                    <SelectableCard
                        marginBottom={10}
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
                                <Text fontSize={20} fontWeight="600" color="#1e1e1e">
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
