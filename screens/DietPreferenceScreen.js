import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import ProgressBar from '../components/ProgressBar';
import FullWidthButton from '../components/FullWidthButton';
import { YStack, XStack, Text, Button } from 'tamagui';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';


// Custom Animated Button Component
const AnimatedDietButton = ({ type, isSelected, onPress, children }) => {
  const scale = useSharedValue(1);
  const selectedValue = useSharedValue(isSelected ? 1 : 0);

  // Diet type color mapping
  const dietColors = {
    'Vegetarian': '#4CAF50',
    'Non-Veg': '#E53935',
    'Vegan': '#81C784',
    'Pescatarian': '#2196F3',
    'Paleo': '#8D6E63',
    'Low-Carb': '#FF9800',
    'Low-Fat': '#FDD835',
    'Whole30': '#6A1B9A',
    'Plant-Based': '#388E3C'
  };

  React.useEffect(() => {
    selectedValue.value = withSpring(isSelected ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      selectedValue.value,
      [0, 1],
      ['transparent', dietColors[type] || '#4CAF50']
    );

    return {
      backgroundColor,
      transform: [{ scale: scale.value }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      selectedValue.value,
      [0, 1],
      ['#000000', '#FFFFFF']
    );

    return {
      color,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  return (
    <Animated.View style={[styles.animatedButton, animatedStyle]}>
      <Button
        size="$5"
        borderRadius="$8"
        borderWidth={1}
        borderColor={isSelected ? 'transparent' : '$gray6'}
        backgroundColor="transparent"
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.Text style={[styles.buttonText, textAnimatedStyle]}>
          {type}
        </Animated.Text>
      </Button>
    </Animated.View>
  );
};

// Custom Animated Cuisine Button Component
const AnimatedCuisineButton = ({ cuisine, isSelected, onPress }) => {
  const scale = useSharedValue(1);
  const selectedValue = useSharedValue(isSelected ? 1 : 0);

  // Cuisine type color mapping
  const cuisineColors = {
    'Indian': '#FF6B35',
    'Continental': '#8E44AD',
    'Keto': '#27AE60',
    'Mediterranean': '#3498DB'
  };

  React.useEffect(() => {
    selectedValue.value = withSpring(isSelected ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      selectedValue.value,
      [0, 1],
      ['transparent', cuisineColors[cuisine] || '#007AFF']
    );

    return {
      backgroundColor,
      transform: [{ scale: scale.value }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      selectedValue.value,
      [0, 1],
      ['#000000', '#FFFFFF']
    );

    return {
      color,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 200,
    });
  };

  const handlePressOut = () => {
    // bounce overshoot before settling
    scale.value = withSpring(1.05, {
      damping: 10,
      stiffness: 200,
    }, () => {
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 200,
      });
    });
  };

  return (
    <Animated.View style={[styles.animatedCuisineButton, animatedStyle]}>
      <Button
        width="100%"
        size="$6"
        borderRadius="$8"
        borderWidth={1}
        borderColor={isSelected ? 'transparent' : '$gray6'}
        backgroundColor="transparent"
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.Text style={[styles.buttonText, textAnimatedStyle]}>
          {cuisine}
        </Animated.Text>
      </Button>
    </Animated.View>
  );
};

const DietPreferenceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [dietType, setDietType] = useState('Vegetarian');
  const [allergies, setAllergies] = useState([]);
  const [cuisine, setCuisine] = useState([]); // now an array

  const allergyOptions = [
    { label: 'Nuts', value: 'Nuts' },
    { label: 'Dairy', value: 'Dairy' },
    { label: 'Gluten', value: 'Gluten' },
    { label: 'Shellfish', value: 'Shellfish' }
  ];

  const cuisineOptions = ['Indian', 'Continental', 'Keto', 'Mediterranean'];

  const dietOptions = [
    'Vegetarian',
    'Non-Veg',
    'Vegan',
    'Pescatarian',
    'Paleo',
    'Low-Carb',
    'Low-Fat',
    'Whole30',
    'Plant-Based'
  ];

  const handleSubmit = async () => {
    await updateDoc(doc(db, 'users', userId), {
      dietPreference: { dietType, allergies, cuisines: cuisine },
    });
    navigation.reset({ index: 0, routes: [{ name: 'DashboardScreen' }] });
  };

  return (
    <YStack p="$4" gap={10} mt={'$10'}>
      <View style={{ marginHorizontal: 10 }}>
        <ProgressBar step={3} />

        <Text fontSize={20} fontWeight="700" mt="$4" textAlign="center">
          Your Food Preferences
        </Text>

        {/* Diet Type */}
        <Text fontWeight="600" mt="$4" mb="$3" color="$gray11" fontSize={16} fontFamily={"$heading"}>
          Dietary Type
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack space="$2" mb={'$3'}>
            {dietOptions.map((type) => (
              <AnimatedDietButton
                key={type}
                type={type}
                isSelected={dietType === type}
                onPress={() => setDietType(type)}
              />
            ))}
          </XStack>
        </ScrollView>

        {/* Allergies - Dropdown */}
        <YStack mb={"$11"}>
          <Text fontWeight="600" mt="$4" mb="$2" color="$gray11" fontSize={16} fontFamily={"$heading"}>
            Allergies
          </Text>

          <MultiSelectDropdown
            placeholder="Select Allergies"
            values={allergies}
            onValuesChange={setAllergies}
            items={allergyOptions}
          />
        </YStack>

        {/* Cuisine */}
        <Text fontWeight="600" mt="$4" mb="$3" color="$gray11" fontSize={16} fontFamily={"$heading"}>
          Cuisine Preferences
        </Text>
        <YStack space="$2">
          {Array.from({ length: 2 }).map((_, rowIndex) => (
            <XStack key={rowIndex} space="$2">
              {cuisineOptions
                .slice(rowIndex * 2, rowIndex * 2 + 2)
                .map((cui) => (
                  <View key={cui} style={{ flex: 1 }}>
                    <AnimatedCuisineButton
                      cuisine={cui}
                      isSelected={cuisine.includes(cui)}
                      onPress={() => {
                        setCuisine((prev) =>
                          prev.includes(cui)
                            ? prev.filter((item) => item !== cui)
                            : [...prev, cui]
                        );
                      }}
                    />
                  </View>
                ))}
            </XStack>
          ))}
        </YStack>
      </View>

      {/* Save Button */}
      <YStack mt={'$5'}>
        <FullWidthButton
          title="Save & Continue"
          onPress={handleSubmit}
        />
      </YStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  animatedButton: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  animatedCuisineButton: {
    borderRadius: 22,
    overflow: 'hidden',
    width: '100%',
  },
  buttonText: {
    fontFamily: 'Inter',
    fontSize: 16,
  },
});

export default DietPreferenceScreen;
