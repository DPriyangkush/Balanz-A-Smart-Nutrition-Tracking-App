// components/ScreenWrappers.js
import React from "react";
import { View, StyleSheet } from "react-native";
import StretchyHeader from "./StretchyHeader";

// Dashboard Screen Wrapper - iOS Style
export const DashboardWrapper = ({ children, ...props }) => {
  return (
    <StretchyHeader
      title="Balanz"
      gradientColors={['#FFF8E8', '#FFF8E8', '#FFF8E8']}
      blurIntensity={100} // iOS-level blur intensity
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

export const BreakfastWrapper = ({ children, ...props }) => {
  return (
    <StretchyHeader
      title="Breakfast"
      gradientColors={['#FFA726', '#FF7043', '#FF5722']}
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

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, // Overlap with header for smooth transition
    paddingTop: 20,
    paddingHorizontal: 0, // Remove horizontal padding to eliminate white gaps
    minHeight: 1000, // Ensure scrollable content
  },
});