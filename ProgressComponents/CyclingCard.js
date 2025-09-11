import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedProps, withTiming, withRepeat } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CyclingCard = () => {
  const rotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  
  React.useEffect(() => {
    // Wheel rotation animation
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000 }),
      -1,
      false
    );
    
    // Pulse animation for activity indicator
    pulseScale.value = withRepeat(
      withTiming(1.3, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const wheelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pulseAnimatedProps = useAnimatedProps(() => ({
    r: 4 * pulseScale.value,
    opacity: 2 - pulseScale.value,
  }));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>🚴</Text>
        <Text style={styles.title}>Cycling</Text>
      </View>
      
      <View style={styles.iconContainer}>
        <Svg width="60" height="60" viewBox="0 0 60 60">
          {/* Bike frame */}
          <Path
            d="M15 30 L30 15 L45 30 L30 35 Z"
            fill="none"
            stroke="#B366D9"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          
          {/* Left wheel */}
          <AnimatedView style={[{ position: 'absolute', left: 5, top: 20 }, wheelAnimatedStyle]}>
            <Svg width="20" height="20" viewBox="0 0 20 20">
              <Circle cx="10" cy="10" r="8" fill="none" stroke="#B366D9" strokeWidth="2" />
              <Path d="M10 2 L10 18 M2 10 L18 10 M5.86 5.86 L14.14 14.14 M14.14 5.86 L5.86 14.14" 
                    stroke="#B366D9" strokeWidth="1" opacity="0.6" />
            </Svg>
          </AnimatedView>
          
          {/* Right wheel */}
          <AnimatedView style={[{ position: 'absolute', right: 5, top: 20 }, wheelAnimatedStyle]}>
            <Svg width="20" height="20" viewBox="0 0 20 20">
              <Circle cx="10" cy="10" r="8" fill="none" stroke="#B366D9" strokeWidth="2" />
              <Path d="M10 2 L10 18 M2 10 L18 10 M5.86 5.86 L14.14 14.14 M14.14 5.86 L5.86 14.14" 
                    stroke="#B366D9" strokeWidth="1" opacity="0.6" />
            </Svg>
          </AnimatedView>
          
          {/* Activity pulse indicator */}
          <AnimatedCircle
            cx="30"
            cy="30"
            animatedProps={pulseAnimatedProps}
            fill="#B366D9"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
    width: 180,
    height: 140,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default CyclingCard;