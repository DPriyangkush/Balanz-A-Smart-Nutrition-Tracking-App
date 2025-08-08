import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  FlatList,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import ProgressBar from '../components/ProgressBar';
import { YStack, XStack, Button } from 'tamagui';
import FullWidthInput from 'components/FullWidthInput';
import HalfWidthInput from 'components/HalfWidthInput';
import HalfWidthSelect from 'components/HalfWidthSelect';
import FullWidthButton from 'components/FullWidthButton';

// Reanimated
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PersonalInfoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [gender, setGender] = useState('');
  const [activity, setActivity] = useState('');

  const isComplete = age && weight && height && gender && activity;

  const maleBg = useSharedValue('#fff');
  const femaleBg = useSharedValue('#fff');

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    if (selectedGender === 'Male') {
      maleBg.value = withTiming('#abceff', { duration: 300 });
      femaleBg.value = withTiming('#fff', { duration: 300 });
    } else {
      femaleBg.value = withTiming('#f5c5ff', { duration: 300 });
      maleBg.value = withTiming('#fff', { duration: 300 });
    }
  };

  const maleAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: maleBg.value,
  }));
  const femaleAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: femaleBg.value,
  }));

  const handleNext = async () => {
    await updateDoc(doc(db, 'users', userId), {
      personalInfo: {
        age,
        weight,
        weightUnit,
        height,
        heightUnit,
        gender,
        activity,
      },
    });
    navigation.navigate('GoalPreferenceScreen', { userId });
  };

  const formContent = (
    <YStack style={styles.contentContainer} space>
      <ProgressBar step={1} />
      <Text style={styles.heading}>Tell us about yourself</Text>

      <FullWidthInput 
        mb="$2"
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <XStack paddingHorizontal="$2" gap="$2" mb="$2" zIndex={500}>
        <HalfWidthInput
          placeholder="Weight"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <HalfWidthSelect
          value={weightUnit}
          onValueChange={setWeightUnit}
          items={[
            { label: 'kg', value: 'kg' },
            { label: 'lbs', value: 'lbs' },
          ]}
        />
      </XStack>

      <XStack paddingHorizontal="$2" gap="$2" mb="$2" zIndex={100}>
        <HalfWidthInput
          placeholder="Height"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
        <HalfWidthSelect
          value={heightUnit}
          onValueChange={setHeightUnit}
          items={[
            { label: 'cm', value: 'cm' },
            { label: 'ft', value: 'ft' },
          ]}
        />
      </XStack>

      <XStack paddingHorizontal="$2" gap="$2" mb="$2" style={styles.genderContainer}>
        <Animated.View style={[styles.genderButtonContainer, maleAnimatedStyle]}>
          <Button
            flex={1}
            height={screenHeight * 0.08}
            backgroundColor="transparent"
            borderColor={gender === 'Male' ? '#4356ff' : '#aaa'}
            borderWidth={0.8}
            borderRadius={15}
            onPress={() => handleGenderSelect('Male')}
            pressStyle={{ backgroundColor: '#f0f0f0' }}
          >
            <XStack alignItems="center" gap="$2">
              <FontAwesome name="male" size={screenWidth * 0.06} color="#0015ff" />
              <Text style={[
                styles.genderText,
                { color: gender === 'Male' ? '#000' : '#666' }
              ]}>
                Male
              </Text>
            </XStack>
          </Button>
        </Animated.View>

        <Animated.View style={[styles.genderButtonContainer, femaleAnimatedStyle]}>
          <Button
            flex={1}
            height={screenHeight * 0.08}
            backgroundColor="transparent"
            borderColor={gender === 'Female' ? '#ff4bea' : '#aaa'}
            borderWidth={0.8}
            borderRadius={15}
            onPress={() => handleGenderSelect('Female')}
            pressStyle={{ backgroundColor: '#f0f0f0' }}
          >
            <XStack alignItems="center" gap="$2">
              <FontAwesome name="female" size={screenWidth * 0.06} color="#ff00c3" />
              <Text style={[
                styles.genderText,
                { color: gender === 'Female' ? '#000' : '#666' }
              ]}>
                Female
              </Text>
            </XStack>
          </Button>
        </Animated.View>
      </XStack>

      <YStack paddingHorizontal="$2" mb="$6" zIndex={100} marginLeft="$2">
        <HalfWidthSelect
          placeholder="Activity Level"
          value={activity}
          onValueChange={setActivity}
          items={[
            { label: 'Sedentary', value: 'Sedentary' },
            { label: 'Lightly Active', value: 'Lightly Active' },
            { label: 'Moderately Active', value: 'Moderately Active' },
            { label: 'Very Active', value: 'Very Active' },
          ]}
        />
      </YStack>

      <FullWidthButton
        style={[!isComplete && { backgroundColor: '#ccc' }]}
        disabled={!isComplete}
        title="Next"
        onPress={handleNext}
      />
    </YStack>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={[{ key: 'form' }]} // dummy single-item list
        renderItem={() => <View>{formContent}</View>}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
};

export default PersonalInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingTop: screenHeight * 0.09,
    paddingBottom: screenHeight * 0.05,
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.02,
    maxWidth: 570,
    width: '100%',
  },
  heading: {
    fontSize: screenWidth * 0.06,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: screenHeight * 0.01,
    color: '#333',
  },
  genderText: {
    fontWeight: '600',
    fontSize: screenWidth * 0.04,
  },
  genderButtonContainer: {
    flex: 1,
    height: screenHeight * 0.07,
    borderRadius: 15,
    overflow: 'hidden',
  },
  genderContainer: {
    marginHorizontal: screenWidth * 0.025,
  },
});
