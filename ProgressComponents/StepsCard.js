import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const StepsCard = ({ steps = 7500, goal = 10000 }) => {
  const progress = steps / goal;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = useSharedValue(circumference);
  
  React.useEffect(() => {
    strokeDashoffset.value = withTiming(circumference * (1 - progress), {
      duration: 1500,
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeDashoffset.value,
  }));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>👟</Text>
        <Text style={styles.title}>Steps</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <Svg width="120" height="120" style={styles.chart}>
          {/* Background circle */}
          <Circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#2A2A2A"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#FF9500"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            transform="rotate(-90 60 60)"
          />
        </Svg>
        
        <View style={styles.centerContent}>
          <Text style={styles.stepsCount}>{steps.toLocaleString()}</Text>
          <Text style={styles.stepsLabel}>Steps</Text>
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
    height: 180,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
    top: 25,
    position: 'relative',
  },
  chart: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsCount: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  stepsLabel: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default StepsCard;