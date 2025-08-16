import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import ProgressBar from '../components/ProgressBar';
import FullWidthButton from '../components/FullWidthButton';
import { YStack, XStack, Text, Button, useTheme } from 'tamagui';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import useAuthStore from '../stores/authStore'; // Add this import

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive utility functions
const getResponsiveSize = (size) => {
  const baseWidth = 375;
  return (screenWidth / baseWidth) * size;
};

const getResponsiveFontSize = (size) => {
  const baseWidth = 375;
  const scale = screenWidth / baseWidth;
  return Math.min(size * scale, size * 1.3);
};

const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 350;

// Custom Animated Button Component
const AnimatedDietButton = ({ type, isSelected, onPress }) => {
  const scale = useSharedValue(1);
  const selectedValue = useSharedValue(isSelected ? 1 : 0);

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
    return { color };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const buttonSize = isTablet ? '$6' : isSmallScreen ? '$4' : '$5';

  return (
    <Animated.View style={[styles.animatedButton, animatedStyle]}>
      <Button
        size={buttonSize}
        borderRadius="$8"
        borderWidth={1}
        borderColor={isSelected ? 'transparent' : '$gray6'}
        backgroundColor="transparent"
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        minWidth={getResponsiveSize(80)}
        paddingHorizontal={getResponsiveSize(12)}
      >
        <Animated.Text style={[styles.buttonText, textAnimatedStyle, {
          fontSize: getResponsiveFontSize(14)
        }]}>
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
    return { color };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.05, { damping: 10, stiffness: 200 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    });
  };

  const buttonSize = isTablet ? '$7' : isSmallScreen ? '$5' : '$6';

  return (
    <Animated.View style={[styles.animatedCuisineButton, animatedStyle]}>
      <Button
        width="100%"
        size={buttonSize}
        borderRadius="$8"
        borderWidth={1}
        borderColor={isSelected ? 'transparent' : '$gray6'}
        backgroundColor="transparent"
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        minHeight={getResponsiveSize(48)}
      >
        <Animated.Text style={[styles.buttonText, textAnimatedStyle, {
          fontSize: getResponsiveFontSize(14)
        }]}>
          {cuisine}
        </Animated.Text>
      </Button>
    </Animated.View>
  );
};

const DietPreferenceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  
  // Safely extract userId with fallback to auth store
  const { user, completeOnboarding } = useAuthStore();
  const userId = route.params?.userId || user?.uid;

  const [dietType, setDietType] = useState('Vegetarian');
  const [allergies, setAllergies] = useState([]);
  const [cuisine, setCuisine] = useState([]);

  // Show loading if no userId is available
  if (!userId) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isFormValid = dietType && allergies.length > 0 && cuisine.length > 0;

  const allergyOptions = [
    { label: 'Nuts', value: 'Nuts' },
    { label: 'Dairy', value: 'Dairy' },
    { label: 'Gluten', value: 'Gluten' },
    { label: 'Shellfish', value: 'Shellfish' },
    { label: 'No Allergies', value: 'No Allergies' }
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

  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const atStart = contentOffset.x <= 0;
    const atEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 1;
    setShowLeftFade(!atStart);
    setShowRightFade(!atEnd);
  };

  const handleSubmit = async () => {
    if (!isFormValid || !userId) return;
    
    try {
      // Save diet preferences to Firestore
      await updateDoc(doc(db, 'users', userId), {
        dietPreference: { dietType, allergies, cuisines: cuisine },
      });
      
      // Mark onboarding as complete
      completeOnboarding();
      
      // Navigate to main app - this will trigger the navigation logic in MainNavigator
      // to show Dashboard since onboarding is now complete
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }], // Replace with your main tabs navigator name
      });
      
    } catch (error) {
      console.error('Error saving diet preferences:', error);
      // Optionally show error to user
      alert('Failed to save preferences. Please try again.');
    }
  };

  const containerPadding = isTablet ? getResponsiveSize(32) : getResponsiveSize(10);
  const marginHorizontal = isTablet ? getResponsiveSize(20) : getResponsiveSize(10);
  const gapSize = isTablet ? 15 : 10;
  const topMargin = isTablet ? getResponsiveSize(60) : getResponsiveSize(50);
  const cuisineItemsPerRow = isTablet ? 4 : 2;
  const cuisineRows = Math.ceil(cuisineOptions.length / cuisineItemsPerRow);

  return (
    <YStack
      p={containerPadding}
      gap={gapSize}
      mt={topMargin}
      style={styles.container}
    >
      <View style={{ marginHorizontal }}>
        <ProgressBar step={3} />

        <Text
          fontSize={getResponsiveFontSize(20)}
          fontWeight="700"
          mt="$4"
          textAlign="center"
          style={{ marginBottom: getResponsiveSize(20), color: "#fff" }}
        >
          Your Food Preferences
        </Text>

        {/* Diet Type */}
        <Text
          fontWeight="600"
          mt="$4"
          mb="$3"
          marginLeft={10}
          color="$gray11"
          fontSize={getResponsiveFontSize(16)}
          fontFamily={"$heading"}
        >
          Dietary Type
        </Text>

        <View style={{ position: 'relative' }}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <XStack
              space={isTablet ? "$3" : "$2"}
              mb={'$3'}
              paddingHorizontal={isTablet ? getResponsiveSize(10) : 0}
            >
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

          {showLeftFade && (
            <LinearGradient
              colors={[
                theme.background.val,           // fully opaque
                `${theme.background.val}E6`,    // ~90% opacity
                `${theme.background.val}B3`,    // ~70%
                `${theme.background.val}80`,    // ~50%
                `${theme.background.val}4D`,    // ~30%
                `${theme.background.val}1A`,    // ~10%
                `${theme.background.val}00`     // fully transparent
              ]}
              style={styles.leftFade}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              pointerEvents="none"
            />
          )}
          {showRightFade && (
            <LinearGradient
              colors={[
                `${theme.background.val}00`,    // fully transparent
                `${theme.background.val}1A`,    // ~10%
                `${theme.background.val}4D`,    // ~30%
                `${theme.background.val}80`,    // ~50%
                `${theme.background.val}B3`,    // ~70%
                `${theme.background.val}E6`,    // ~90%
                theme.background.val            // fully opaque
              ]}
              style={styles.rightFade}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              pointerEvents="none"
            />
          )}
        </View>

        {/* Allergies */}
        <YStack mb={getResponsiveSize(40)}>
          <Text
            fontWeight="600"
            mt="$4"
            mb="$3"
            marginLeft={10}
            color="$gray11"
            fontSize={getResponsiveFontSize(16)}
            fontFamily={"$heading"}
          >
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
        <Text
          fontWeight="600"
          mt="$8"
          mb="$3"
          marginLeft={10}
          color="$gray11"
          fontSize={getResponsiveFontSize(16)}
          fontFamily={"$heading"}
        >
          Cuisine Preferences
        </Text>
        <YStack space={isTablet ? "$3" : "$2"}>
          {Array.from({ length: cuisineRows }).map((_, rowIndex) => (
            <XStack key={rowIndex} space={isTablet ? "$3" : "$2"}>
              {cuisineOptions
                .slice(rowIndex * cuisineItemsPerRow, rowIndex * cuisineItemsPerRow + cuisineItemsPerRow)
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
      <YStack mt={getResponsiveSize(20)} style={{ paddingBottom: getResponsiveSize(20) }}>
        <FullWidthButton
          title="Save & Continue"
          onPress={handleSubmit}
          disabled={!isFormValid}
        />
      </YStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: screenHeight * 0.9,
  },
  animatedButton: {
    borderRadius: getResponsiveSize(22),
    overflow: 'hidden',
  },
  animatedCuisineButton: {
    borderRadius: getResponsiveSize(22),
    overflow: 'hidden',
    width: '100%',
  },
  buttonText: {
    fontFamily: 'Inter',
    fontSize: getResponsiveFontSize(14),
    textAlign: 'center',
  },
  leftFade: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 30,
  },
  rightFade: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 30,
  },
});

export default DietPreferenceScreen;