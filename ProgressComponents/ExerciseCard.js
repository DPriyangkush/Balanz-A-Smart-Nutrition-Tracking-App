import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  withTiming, 
  withDelay,
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedView = Animated.createAnimatedComponent(View);

const ExerciseCard = ({
  data = [0.4, 0.8, 0.9, 0.5, 1.0, 0.3, 0.6],
  hours = 2,
  minutes = 12
}) => {
  // Create individual shared values for the bars
  const animatedValues = Array(7).fill().map(() => useSharedValue(0));

  const cardScale = useSharedValue(0.95);

  React.useEffect(() => {
    // Card entrance animation
    cardScale.value = withTiming(1, { duration: 600 });

    // Staggered bar animations with improved timing
    animatedValues.forEach((value, index) => {
      value.value = withDelay(index * 80, withTiming(1, { duration: 1000 }));
    });
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: interpolate(cardScale.value, [0.95, 1], [0.8, 1], Extrapolate.CLAMP),
  }));

  return (
    <AnimatedView style={[styles.card, cardAnimatedStyle]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="fitness-center" size={14} color="white" />
        </View>
        <Text style={styles.title}>Exercise</Text>
      </View>

      {/* Enhanced Chart Container with increased height */}
      <View style={styles.chartContainer}>
        <Svg width="140" height="80" viewBox="0 0 140 80">
          <Defs>
            {/* Gradient for bars */}
            <LinearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#4ADE80" stopOpacity="1" />
              <Stop offset="100%" stopColor="#22C55E" stopOpacity="1" />
            </LinearGradient>
            {/* Shadow gradient */}
            <LinearGradient id="shadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#000000" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </LinearGradient>
          </Defs>

          {data.map((value, index) => {
            const maxHeight = 80; // Increased from 50 to 70
            const barHeight = value * maxHeight;
            const barWidth = 7;
            const spacing = 18;
            const x = index * spacing + 8;
            const baseY = 80; // Adjusted base position

            // Animated style for bars
            const animatedRectStyle = useAnimatedStyle(() => {
              return {
                transform: [
                  {
                    scaleY: animatedValues[index].value,
                  },
                ],
                transformOrigin: `${x + barWidth / 2}px ${baseY}px`,
              };
            });

            return (
              <React.Fragment key={index}>
                {/* Shadow/Depth effect */}
                <AnimatedRect
                  x={x + 1}
                  y={baseY - barHeight + 1}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#shadowGradient)"
                  rx="3.5"
                  style={animatedRectStyle}
                />
                
                {/* Main bar with gradient */}
                <AnimatedRect
                  x={x}
                  y={baseY - barHeight}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#barGradient)"
                  rx="3.5"
                  style={animatedRectStyle}
                />
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      {/* Time Display */}
      <View style={styles.timeContainer}>
        <Text style={styles.hours}>{hours}</Text>
        <Text style={styles.hoursLabel}>h</Text>
        <Text style={styles.minutes}>{minutes}</Text>
        <Text style={styles.minutesLabel}>m</Text>
      </View>

      {/* Subtle bottom highlight for iOS feel */}
      <View style={styles.bottomHighlight} />
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 18,
    width: 185,
    height: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    backgroundColor: "#34C759",
    padding: 6,
    borderRadius: 10,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 26,
    height: 26,
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: -0.2,
  },
  chartContainer: {
    alignItems: 'flex-start',
    marginBottom: 5, // Reduced from 10 to 5
    marginLeft: -2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  hours: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    letterSpacing: -1,
  },
  hoursLabel: {
    color: '#8E8E93',
    fontSize: 17,
    fontWeight: '500',
    marginRight: 8,
    marginLeft: 3,
    fontFamily: 'Inter',
  },
  minutes: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    letterSpacing: -1,
  },
  minutesLabel: {
    color: '#8E8E93',
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 3,
    fontFamily: 'Inter',
  },
  bottomHighlight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});

export default ExerciseCard;
