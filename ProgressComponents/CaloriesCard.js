import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const CaloriesCard = ({
  calories = 1459,
  goal = 2500,
  subtitle = 'From 2,500 kcal',
}) => {
  const progress = Math.min(calories / goal, 1);
  const sweepAngle = useSharedValue(0);

  React.useEffect(() => {
    sweepAngle.value = withTiming(progress * 270, { duration: 1500 });
  }, [progress]);

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const createArc = (startAngle, endAngle, innerRadius, outerRadius) => {
    const start = polarToCartesian(50, 50, outerRadius, endAngle);
    const end = polarToCartesian(50, 50, outerRadius, startAngle);
    const innerStart = polarToCartesian(50, 50, innerRadius, endAngle);
    const innerEnd = polarToCartesian(50, 50, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', start.x, start.y,
      'A', outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      'L', innerEnd.x, innerEnd.y,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      'Z',
    ].join(' ');
  };

  const animatedProps = useAnimatedProps(() => {
    'worklet';

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      'worklet';
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    };

    const createArc = (startAngle, endAngle, innerRadius, outerRadius) => {
      'worklet';
      const start = polarToCartesian(50, 50, outerRadius, endAngle);
      const end = polarToCartesian(50, 50, outerRadius, startAngle);
      const innerStart = polarToCartesian(50, 50, innerRadius, endAngle);
      const innerEnd = polarToCartesian(50, 50, innerRadius, startAngle);

      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

      return [
        'M', start.x, start.y,
        'A', outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
        'L', innerEnd.x, innerEnd.y,
        'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
        'Z',
      ].join(' ');
    };

    const currentAngle = sweepAngle.value;
    const d = createArc(45, 45 + currentAngle, 25, 35);

    return { d };
  });

  const needleAngle = 45 + progress * 270;
  const needleX = 50 + 30 * Math.cos((needleAngle - 90) * (Math.PI / 180));
  const needleY = 50 + 30 * Math.sin((needleAngle - 90) * (Math.PI / 180));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>🔥</Text>
        <Text style={styles.title}>Calories</Text>
      </View>

      <View style={styles.chartContainer}>
        <Svg width="100" height="80" viewBox="0 0 100 80">
          {/* Background arc */}
          <Path d={createArc(45, 315, 25, 35)} fill="#2A2A2A" />
          {/* Progress arc */}
          <AnimatedPath animatedProps={animatedProps} fill="#FF9500" />
          {/* Needle */}
          <Path
            d={`M 50 50 L ${needleX} ${needleY}`}
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.calories}>{calories.toLocaleString()}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
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
    marginBottom: 15,
  },
  infoContainer: {
    alignItems: 'flex-start',
  },
  calories: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default CaloriesCard;
