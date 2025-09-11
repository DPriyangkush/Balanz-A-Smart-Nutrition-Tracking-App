import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const HeartCard = ({
  bpm = 109,
  data = [72, 75, 78, 82, 85, 88, 92, 95, 98, 102, 105, 109, 106, 103, 100, 97, 94, 91, 88],
}) => {
  const pathLength = useSharedValue(0);

  React.useEffect(() => {
    pathLength.value = withRepeat(withTiming(1, { duration: 2000 }), -1, false);
  }, []);

  const createPath = (points) => {
    if (points.length === 0) return '';

    const width = 140;
    const height = 50;
    const maxValue = Math.max(...points);
    const minValue = Math.min(...points);
    const range = maxValue - minValue || 1;

    let path = '';
    points.forEach((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((point - minValue) / range) * height;

      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        const prevX = ((index - 1) / (points.length - 1)) * width;
        const prevY = height - ((points[index - 1] - minValue) / range) * height;
        const cpX = (prevX + x) / 2;
        path += ` Q ${cpX} ${prevY} ${x} ${y}`;
      }
    });

    return path;
  };

  const heartPath = createPath(data);

  const animatedProps = useAnimatedProps(() => {
    const pathLengthValue = 200; // Can be adjusted or measured dynamically
    return {
      strokeDasharray: [pathLengthValue, pathLengthValue],
      strokeDashoffset: pathLengthValue * (1 - pathLength.value),
    };
  });

  // Skip rendering if path is invalid
  if (!heartPath) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>❤️</Text>
        <Text style={styles.title}>Heart</Text>
      </View>

      <View style={styles.chartContainer}>
        <Svg width="140" height="50" viewBox="0 0 140 50">
          <AnimatedPath
            d={heartPath}
            fill="none"
            stroke="#FF3B30"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animatedProps={animatedProps}
          />
        </Svg>
      </View>

      <View style={styles.bpmContainer}>
        <Text style={styles.bpm}>{bpm}</Text>
        <Text style={styles.bpmLabel}>BPM</Text>
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
    marginBottom: 15,
  },
  bpmContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bpm: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  bpmLabel: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default HeartCard;
