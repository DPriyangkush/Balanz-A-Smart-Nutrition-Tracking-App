// components/SkeletonLoader.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, useColorScheme } from 'react-native';

const SkeletonPlaceholder = ({ width, height, borderRadius = 4, style = {} }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const animate = () => {
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => animate());
    };
    animate();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: isDark 
      ? ['#2a2a2a', '#3a3a3a', '#2a2a2a']
      : ['#f0f0f0', '#e0e0e0', '#f0f0f0'],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

// Auth Screen Skeleton
export const AuthScreenSkeleton = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      {/* Header */}
      <View style={styles.header}>
        <SkeletonPlaceholder width={30} height={30} borderRadius={15} />
        <SkeletonPlaceholder width={120} height={24} borderRadius={12} />
        <View style={{ width: 30 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <SkeletonPlaceholder width={280} height={40} borderRadius={20} />
      </View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        <SkeletonPlaceholder width="100%" height={50} borderRadius={8} style={styles.fieldMargin} />
        <SkeletonPlaceholder width="100%" height={50} borderRadius={8} style={styles.fieldMargin} />
        <SkeletonPlaceholder width="100%" height={50} borderRadius={8} style={styles.fieldMargin} />
        
        {/* Forgot Password */}
        <View style={styles.forgotContainer}>
          <SkeletonPlaceholder width={120} height={16} borderRadius={8} />
        </View>
        
        {/* Login Button */}
        <SkeletonPlaceholder width="100%" height={50} borderRadius={25} style={styles.buttonMargin} />
      </View>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <SkeletonPlaceholder width="30%" height={1} />
        <SkeletonPlaceholder width={20} height={16} borderRadius={8} style={styles.orText} />
        <SkeletonPlaceholder width="30%" height={1} />
      </View>

      {/* Social Buttons */}
      <View style={styles.socialContainer}>
        <SkeletonPlaceholder width="100%" height={50} borderRadius={25} style={styles.socialButton} />
        <SkeletonPlaceholder width="100%" height={50} borderRadius={25} style={styles.socialButton} />
        <SkeletonPlaceholder width="100%" height={50} borderRadius={25} style={styles.socialButton} />
      </View>

      {/* Terms */}
      <View style={styles.termsContainer}>
        <SkeletonPlaceholder width="60%" height={12} borderRadius={6} />
        <SkeletonPlaceholder width="40%" height={12} borderRadius={6} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
};

// Home Screen Skeleton
export const HomeScreenSkeleton = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      {/* Header */}
      <View style={styles.homeHeader}>
        <View>
          <SkeletonPlaceholder width={80} height={16} borderRadius={8} />
          <SkeletonPlaceholder width={150} height={24} borderRadius={12} style={{ marginTop: 8 }} />
        </View>
        <SkeletonPlaceholder width={40} height={40} borderRadius={20} />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <SkeletonPlaceholder width="48%" height={100} borderRadius={12} />
        <SkeletonPlaceholder width="48%" height={100} borderRadius={12} />
      </View>

      {/* Chart Section */}
      <View style={styles.chartSection}>
        <SkeletonPlaceholder width="100%" height={200} borderRadius={12} />
      </View>

      {/* List Items */}
      <View style={styles.listSection}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.listItem}>
            <SkeletonPlaceholder width={50} height={50} borderRadius={25} />
            <View style={styles.listContent}>
              <SkeletonPlaceholder width="60%" height={16} borderRadius={8} />
              <SkeletonPlaceholder width="40%" height={14} borderRadius={7} style={{ marginTop: 6 }} />
            </View>
            <SkeletonPlaceholder width={60} height={20} borderRadius={10} />
          </View>
        ))}
      </View>
    </View>
  );
};

// Generic Loading Skeleton
export const GenericSkeleton = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 30,
    marginBottom: 30,
  },
  tabsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  formContainer: {
    marginBottom: 20,
  },
  fieldMargin: {
    marginBottom: 20,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingRight: 20,
  },
  buttonMargin: {
    marginTop: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orText: {
    marginHorizontal: 10,
  },
  socialContainer: {
    marginBottom: 20,
  },
  socialButton: {
    marginBottom: 12,
  },
  termsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  chartSection: {
    marginBottom: 30,
  },
  listSection: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listContent: {
    flex: 1,
    marginLeft: 15,
  },
});

export default SkeletonPlaceholder;