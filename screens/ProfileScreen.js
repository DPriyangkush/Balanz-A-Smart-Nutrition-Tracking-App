import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileCard from '../Cards/ProfileCard';

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 6 + 40;
  const desiredGap = 2;

  // PREMIUM FITNESS/NUTRITION APP GRADIENTS:

  // 1. HEALTH MINIMALIST (RECOMMENDED - Perfect for fitness apps)
  const healthMinimalistGradient = {
    colors: ['#e8f5e8', '#f0f8f0', '#e1f4e1'],
    locations: [0, 0.5, 1],
  };

  // 2. WELLNESS GRAY (Ultra minimal like your reference)
  const wellnessGrayGradient = {
    colors: ['#f8f9fa', '#e9ecef', '#dee2e6'],
    locations: [0, 0.5, 1],
  };

  // 3. SUBTLE MINT (Clean health vibe)
  const subtleMintGradient = {
    colors: ['#f0fff4', '#e6fffa', '#e0f2f1'],
    locations: [0, 0.5, 1],
  };

  // 4. PREMIUM NEUTRAL (Most sophisticated)
  const premiumNeutralGradient = {
    colors: ['#fafbfc', '#f1f3f4', '#e8eaed'],
    locations: [0, 0.5, 1],
  };

  // 5. FITNESS BLUE (Professional and trustworthy)
  const fitnessBlueGradient = {
    colors: ['#f9ffa9ff', '#e6f3ff', '#dbeafe'],
    locations: [0, 0.5, 1],
  };

  // 6. CLEAN WHITE (Matches your reference exactly)
  const cleanWhiteGradient = {
    colors: ['#f9f9f0ff', '#ddf9ddff', '#cdffcdff'],
    locations: [0, 0.4, 1],
  };

  // Select your preferred gradient here:
  const selectedGradient = cleanWhiteGradient; // This matches your reference image best

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        {...selectedGradient}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Glass Effect Layers - Reduced for minimal look */}
      <BlurView intensity={25} tint="light" style={StyleSheet.absoluteFill} />
      
      {/* Very subtle glass overlay */}
      <View style={styles.minimalGlassOverlay} />
      
      <View style={[styles.content, { paddingTop: headerHeight + desiredGap }]}>
        <ProfileCard style={styles.cardWithShadow} />
        
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  minimalGlassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // Very subtle overlay
  },
  content: {
    flex: 1,
    alignItems: "center",
    zIndex: 10,
  },
  cardWithShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "#2c3e50",
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});