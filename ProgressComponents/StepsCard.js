import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);


const StepsCard = ({ steps = 7500, goal = 10000 }) => {
  const progress = steps / goal;
  const circumference = 2 * Math.PI * 60; // radius = 60
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
        <View style={styles.iconContainer}>
          <MaterialIcons name="directions-run" size={16} color="white" />
        </View>
        <Text style={styles.title}>Steps</Text>
      </View>
            
      <View style={styles.chartContainer}>
        <Svg width="140" height="140" style={styles.chart}>
          {/* Inner dotted circle */}
          <Circle
            cx="70"
            cy="70"
            r="45"
            fill="none"
            stroke="#FF9F0A"
            strokeWidth="1"
            strokeDasharray="2,4"
          />
          {/* Background circle */}
          <Circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="#333333"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="#FF9F0A"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            transform="rotate(-90 70 70)"
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
    borderRadius: 16,
    padding: 16,
    width: 180,
    height: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
       
  },
  iconContainer: {
    backgroundColor: "#ffab2ed1",
    padding: 4,
    borderRadius: 8,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 26,
    height: 26,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Inter-SemiBold',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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
    marginBottom: 2,
  },
  stepsLabel: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
});

export default StepsCard;