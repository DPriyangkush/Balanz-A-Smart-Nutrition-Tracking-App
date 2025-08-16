import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const SplashScreen = () => {
  const navigation = useNavigation();
  const logoAnim = useRef(new Animated.Value(0)).current; // opacity + scale
  const textAnim = useRef(new Animated.Value(0)).current; // opacity
  const descAnim = useRef(new Animated.Value(0)).current; // opacity + slight slide

  useEffect(() => {

    // Sequential Animation
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(descAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();


    const timer = setTimeout(() => {
      navigation.navigate("Onboarding");
    }, 6000);

    return () => clearTimeout(timer);

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
                  outputRange: [10, 0], // slide up a little
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
