import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, ClipPath, Rect, Circle, Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, withRepeat } from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const WaterCard = ({ 
  current = 0.3,
  glasses = 3,
  total = 8
}) => {
  const waveOffset = useSharedValue(0);
  
  React.useEffect(() => {
    waveOffset.value = withRepeat(
      withTiming(100, { duration: 3000 }),
      -1,
      false
    );
  }, []);

  const animatedWaveProps = useAnimatedProps(() => {
    const wave1 = `M 0 ${50 - current * 30 + Math.sin(waveOffset.value * 0.02) * 3} Q 25 ${45 - current * 30 + Math.sin(waveOffset.value * 0.02 + 1) * 3} 50 ${50 - current * 30 + Math.sin(waveOffset.value * 0.02 + 2) * 3} T 100 ${50 - current * 30} V 80 H 0 Z`;
    return { d: wave1 };
  });

  const animatedWaveProps2 = useAnimatedProps(() => {
    const wave2 = `M 0 ${55 - current * 30 + Math.sin(waveOffset.value * 0.015 + 1) * 2} Q 25 ${48 - current * 30 + Math.sin(waveOffset.value * 0.015 + 2) * 2} 50 ${55 - current * 30 + Math.sin(waveOffset.value * 0.015 + 3) * 2} T 100 ${55 - current * 30} V 80 H 0 Z`;
    return { d: wave2 };
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>💧</Text>
        <Text style={styles.title}>Water</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <Svg width="80" height="80" viewBox="0 0 100 80">
          <Defs>
            <ClipPath id="circleClip">
              <Circle cx="50" cy="40" r="35" />
            </ClipPath>
          </Defs>
          
          {/* Background circle */}
          <Circle
            cx="50"
            cy="40"
            r="35"
            fill="none"
            stroke="#2A2A2A"
            strokeWidth="3"
          />
          
          {/* Water waves */}
          <AnimatedPath
            animatedProps={animatedWaveProps}
            fill="#007AFF"
            opacity="0.6"
            clipPath="url(#circleClip)"
          />
          <AnimatedPath
            animatedProps={animatedWaveProps2}
            fill="#007AFF"
            opacity="0.4"
            clipPath="url(#circleClip)"
          />
          
          {/* Circle border */}
          <Circle
            cx="50"
            cy="40"
            r="35"
            fill="none"
            stroke="#007AFF"
            strokeWidth="3"
            opacity="0.3"
          />
        </Svg>
        
        <View style={styles.centerContent}>
          <Text style={styles.glassesCount}>{glasses}</Text>
          <Text style={styles.glassesTotal}>of {total}</Text>
        </View>
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
    height: 160,
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
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassesCount: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  glassesTotal: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default WaterCard;