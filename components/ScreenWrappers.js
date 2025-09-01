// components/UpdatedScreenWrappers.js - Location Style Screen Wrappers
import React from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import LocationStyleHeader from "./LocationStyleHeader";
import StretchyHeader from "./StretchyHeader"; // Keep for screens that need the old style

// Meal Screen Wrapper - Location Style
export const MealWrapper = ({ 
  children, 
  profileImage = null,
  onProfilePress = null,
  onNotificationPress = null,
  hasNotificationBadge = false,
  ...props 
}) => {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      navigation.navigate('Profile'); // Default navigation to profile
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      // Default notification action
      Alert.alert("Notifications", "No new notifications");
    }
  };

  return (
    <LocationStyleHeader
      title="Meals & Nutrition"
      headerHeight={110}
      profileImage={profileImage}
      onProfilePress={handleProfilePress}
      onNotificationPress={handleNotificationPress}
      hasNotificationBadge={hasNotificationBadge}
      backgroundColor="#FFF8E8"
      titleColor="#333333"
      subtitleColor="#666666"
      gradientColors={['#FFF8E8', '#FFFFFF', '#F0F0F0']}
      blurIntensity={100}
      {...props}
    >
      <ScrollView style={styles.contentScrollWrapper}>
        {children}
      </ScrollView>
    </LocationStyleHeader>
  );
};

// AI Screen Wrapper - Location Style
export const AIWrapper = ({ 
  children, 
  profileImage = null,
  onProfilePress = null,
  onNotificationPress = null,
  hasNotificationBadge = false,
  ...props 
}) => {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      navigation.navigate('Profile');
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      Alert.alert("Notifications", "No new notifications");
    }
  };

  return (
    <LocationStyleHeader
      title="AI Assistant"
      headerHeight={140}
      profileImage={profileImage}
      onProfilePress={handleProfilePress}
      onNotificationPress={handleNotificationPress}
      hasNotificationBadge={hasNotificationBadge}
      backgroundColor="#F5F5FA"
      titleColor="#333333"
      subtitleColor="#666666"
      gradientColors={['#F5F5FA', '#E8E8ED', '#DCDCE0']}
      blurIntensity={100}
      {...props}
    >
      <ScrollView style={styles.contentScrollWrapper}>
        {children}
      </ScrollView>
    </LocationStyleHeader>
  );
};

// Progress Screen Wrapper - Location Style
export const ProgressWrapper = ({ 
  children, 
  profileImage = null,
  onProfilePress = null,
  onNotificationPress = null,
  hasNotificationBadge = false,
  ...props 
}) => {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      navigation.navigate('Profile');
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      Alert.alert("Notifications", "No new notifications");
    }
  };

  return (
    <LocationStyleHeader
      title="Progress Tracking"
      headerHeight={140}
      profileImage={profileImage}
      onProfilePress={handleProfilePress}
      onNotificationPress={handleNotificationPress}
      hasNotificationBadge={hasNotificationBadge}
      backgroundColor="#F0F9F0"
      titleColor="#333333"
      subtitleColor="#666666"
      gradientColors={['#F0F9F0', '#E8F5E8', '#E0F0E0']}
      blurIntensity={100}
      {...props}
    >
      <ScrollView style={styles.contentScrollWrapper}>
        {children}
      </ScrollView>
    </LocationStyleHeader>
  );
};

// Dashboard Screen Wrapper - Keep Original Style (if needed)
export const DashboardWrapper = ({ children, ...props }) => {
  return (
    <StretchyHeader
      title="Balanz"
      gradientColors={['#FFF8E8', '#FFF8E8', '#FFF8E8']}
      blurIntensity={100}
      headerHeight={90}
      {...props}
    >
      <ScrollView style={styles.contentScrollWrapper}>
        {children}
      </ScrollView>
    </StretchyHeader>
  );
};

// Profile Screen Wrapper - Keep Original Style (since this IS the profile)
export const ProfileWrapper = ({ children, ...props }) => {
  return (
    <StretchyHeader
      title="Profile"
      gradientColors={['#FFA726', '#FF7043', '#FF5722']}
      blurIntensity={100}
      headerHeight={130}
      {...props}
    >
      <ScrollView style={styles.contentScrollWrapper}>
        {children}
      </ScrollView>
    </StretchyHeader>
  );
};

// Also update your BreakfastWrapper in ScreenWrappers to ensure better scrolling:
export const BreakfastWrapper = ({ 
  children, 
  profileImage = null,
  onProfilePress = null,
  onNotificationPress = null,
  hasNotificationBadge = false,
  ...props 
}) => {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      navigation.navigate('Profile');
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      Alert.alert("Notifications", "No new notifications");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <LocationStyleHeader
        title="Breakfast"
        headerHeight={110}
        profileImage={profileImage}
        onProfilePress={handleProfilePress}
        onNotificationPress={handleNotificationPress}
        hasNotificationBadge={hasNotificationBadge}
        backgroundColor="#FFF8E8"
        titleColor="#333333"
        subtitleColor="#666666"
        gradientColors={['#FFF8E8', '#FFFFFF', '#F0F0F0']}
        blurIntensity={100}
        {...props}
      >
        {/* REMOVE the ScrollView wrapper - this is causing the issue */}
        <View style={styles.contentWrapper}>
          {children}
        </View>
      </LocationStyleHeader>
    </View>
  );
};

// Updated styles
const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
  
    // Remove minHeight as it can cause issues
  },
  // Remove contentScrollWrapper as we're not using ScrollView anymore
});