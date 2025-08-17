import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const SplashScreen = () => {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const descAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Just run the animations - NO navigation
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1000, // Reduced from 1500ms
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 400, // Reduced from 600ms
        useNativeDriver: true,
      }),
      Animated.timing(descAnim, {
        toValue: 1,
        duration: 300, // Reduced from 500ms
        useNativeDriver: true,
      }),
    ]).start();

    // ⚠️ REMOVED THE TIMER AND NAVIGATION - MainNavigator handles this now
    console.log('🎨 Splash animations started');
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/adaptive-icon.png')}
        style={[
          styles.logo,
          {
            opacity: logoAnim,
            transform: [
              {
                scale: logoAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.Text style={[styles.logotext, { opacity: textAnim }]}>
        Balanz
      </Animated.Text>
      <Animated.Text
        style={[
          styles.description,
          {
            opacity: descAnim,
            transform: [
              {
                translateY: descAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        Perfectly Balanced Nutrition
      </Animated.Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  logotext: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  description: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '400',
    marginTop: '1.5%',
    fontFamily: 'Inter',
  },
});