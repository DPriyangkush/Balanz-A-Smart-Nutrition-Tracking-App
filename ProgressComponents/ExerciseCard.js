import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const ExerciseCard = ({ 
  data = [0.3, 0.8, 0.6, 0.4, 0.9, 0.2, 0.7],
  minutes = 2,
  seconds = 12 
}) => {
  const animatedValues = data.map(() => useSharedValue(0));
  
  React.useEffect(() => {
    animatedValues.forEach((value, index) => {
      value.value = withDelay(
        index * 100,
        withTiming(1, { duration: 800 })
      );
    });
  }, []);

  const formatTime = (minutes, seconds) => {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>💪</Text>
        <Text style={styles.title}>Exercise</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <Svg width="140" height="60" viewBox="0 0 140 60">
          {data.map((value, index) => {
            const barHeight = value * 45;
            const barWidth = 16;
            const spacing = 20;
            const x = index * spacing + 2;
            const y = 55 - barHeight;
            
            return (
              <AnimatedRect
                key={index}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#32D74B"
                rx="8"
                style={{
                  transform: [
                    {
                      scaleY: animatedValues[index].value,
                    },
                  ],
                  transformOrigin: `${x + barWidth/2}px 55px`,
                }}
              />
            );
          })}
        </Svg>
      </View>
      
      <Text style={styles.time}>{formatTime(minutes, seconds)}</Text>
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
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  time: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
});

export default ExerciseCard;