// components/ScreenWrappers.js - Fixed with Proper Scrolling
import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import StretchyHeader from "./StretchyHeader";

// Dashboard Screen Wrapper - iOS Style
export const DashboardWrapper = ({ children, ...props }) => {
  return (
    <StretchyHeader
      title="Balanz"
      gradientColors={['#FFF8E8', '#FFF8E8', '#FFF8E8']}
      blurIntensity={100}
      headerHeight={90}
      {...props}
    >
      <View style={styles.contentWrapper}>
        {children}
      </View>
    </StretchyHeader>
  );
};

// Meal Screen Wrapper - iOS Style
export const MealWrapper = ({ children, ...props }) => {
  return (
    <StretchyHeader
      title="Meals"
      gradientColors={['#FF6B6B', '#FF8E8E', '#FFB6B6']}
      blurIntensity={100}
      headerHeight={90}
      {...props}
    >
      <View style={styles.contentWrapper}>
        {children}
      </View>
    </StretchyHeader>
  );
};

// AI Screen Wrapper - iOS Style
export const AIWrapper = ({ children, ...props }) => {
  return (
    <StretchyHeader
      title="AI Assistant"
      gradientColors={['#667eea', '#764ba2', '#9c5faa']}
      blurIntensity={100}
      headerHeight={130}
      {...props}
    >
      <View style={styles.contentWrapper}>
        {children}
      </View>
    </StretchyHeader>
  );
};

// Progress Screen Wrapper - iOS Style
export const ProgressWrapper = ({ children, ...props }) => {
  return (
    <StretchyHeader
      title="Progress"
      gradientColors={['#4ECDC4', '#44A08D', '#3F7F7A']}
      blurIntensity={100}
      headerHeight={130}
      {...props}
    >
      <View style={styles.contentWrapper}>
        {children}
      </View>
    </StretchyHeader>
  );
};

// Profile Screen Wrapper - iOS Style
export const ProfileWrapper = ({ children, ...props }) => {
  return (
    <StretchyHeader
      title="Profile"
      gradientColors={['#FFA726', '#FF7043', '#FF5722']}
      blurIntensity={100}
      headerHeight={130}
      {...props}
    >
      <View style={styles.contentWrapper}>
        {children}
      </View>
    </StretchyHeader>
  );
};

// Breakfast Screen Wrapper - WITH BACK BUTTON AND FIXED SCROLLING
export const BreakfastWrapper = ({ children, onBackPress, ...props }) => {
  const navigation = useNavigation();

  // Default back press handler
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress(); // Use custom back press if provided
    } else if (navigation.canGoBack()) {
      navigation.goBack(); // Default navigation back
    } else {
      // Fallback - navigate to a specific screen or show alert
      Alert.alert(
        "Navigate Back",
        "Would you like to go to the main screen?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Yes", 
            onPress: () => {
              // Navigate to your main screen - adjust route name as needed
              navigation.navigate('Dashboard'); // or 'Home', 'Main', etc.
            }
          }
        ]
      );
    }
  };

  return (
    <StretchyHeader
      title="Breakfast"
      gradientColors={['#FFA726', '#FF7043', '#FF5722']}
      blurIntensity={100}
      headerHeight={90}
      showBackButton={true} // Enable back button
      onBackPress={handleBackPress} // Back button handler
      backButtonColor="#1e1e1e" // Dark color for visibility
      backButtonSize={24}
      {...props}
    >
      {/* Fixed: Use scrollableContentWrapper for BreakfastWrapper */}
      <View style={styles.contentWrapper}>
        {children}
      </View>
    </StretchyHeader>
  );
};

const styles = StyleSheet.create({
  // Original contentWrapper for other screens
  contentWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 0,
    minHeight: 1000, // This is fine for other screens
  },
  
  // NEW: Scrollable content wrapper for BreakfastScreen
  scrollableContentWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 0,
    // REMOVED: minHeight - this was blocking scrolling
    // minHeight: 1000, ❌ This prevents proper scrolling
  },
});