import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const HeartIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24">
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill="#FF2D92"
    />
  </Svg>
);

const HeartCard = ({
  bpm = 109,
  data = [72, 75, 100, 108, 82, 95, 98, 102, 85, 98, 102, 105, 119, 110, 108, 106, 103, 101, 98, 95, 50],
}) => {
  const pathLength = useSharedValue(0);

  React.useEffect(() => {
    pathLength.value = withRepeat(withTiming(1, { duration: 2000 }), -1, false);
  }, []);

  const createPath = (points, isFillPath = false) => {
    if (points.length === 0) return '';

    const width = 140;
    const height = 80;
    const maxValue = Math.max(...points);
    const minValue = Math.min(...points);
    const range = maxValue - minValue || 1;

    // Convert points to coordinates
    const coords = points.map((point, index) => ({
      x: (index / (points.length - 1)) * width,
      y: height - ((point - minValue) / range) * height,
    }));

    if (coords.length < 2) return '';

    // Create smooth curve using cubic Bézier curves
    let path = `M ${coords[0].x} ${coords[0].y}`;

    for (let i = 1; i < coords.length; i++) {
      const current = coords[i];
      const previous = coords[i - 1];
      
      // Calculate control points for smooth curves
      const tension = 0.3; // Adjust this value to control smoothness (0-1)
      
      let cp1x = previous.x;
      let cp1y = previous.y;
      let cp2x = current.x;
      let cp2y = current.y;
      
      if (i > 1) {
        const beforePrevious = coords[i - 2];
        cp1x = previous.x + (current.x - beforePrevious.x) * tension;
        cp1y = previous.y + (current.y - beforePrevious.y) * tension;
      }
      
      if (i < coords.length - 1) {
        const next = coords[i + 1];
        cp2x = current.x - (next.x - previous.x) * tension;
        cp2y = current.y - (next.y - previous.y) * tension;
      }
      
      path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${current.x} ${current.y}`;
    }

    // For fill path, close the path at the bottom
    if (isFillPath) {
      path += ` L ${width} ${height} L 0 ${height} Z`;
    }

    return path;
  };

  const heartPath = createPath(data);
  const fillPath = createPath(data, true);

  const animatedProps = useAnimatedProps(() => {
    const pathLengthValue = 200;
    return {
      strokeDasharray: [pathLengthValue, pathLengthValue],
      strokeDashoffset: pathLengthValue * (1 - pathLength.value),
    };
  });

  const animatedFillProps = useAnimatedProps(() => {
    const pathLengthValue = 200;
    return {
      strokeDasharray: [pathLengthValue, pathLengthValue],
      strokeDashoffset: pathLengthValue * (1 - pathLength.value),
    };
  });

  if (!heartPath) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <HeartIcon />
        </View>
        <Text style={styles.title}>Heart</Text>
      </View>

      <View style={styles.chartContainer}>
        <Svg width="140" height="80" viewBox="0 0 140 80">
          <Defs>
            <LinearGradient id="heartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FF2D92" stopOpacity="0.4" />
              <Stop offset="70%" stopColor="#FF2D92" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="#FF2D92" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>
          
          {/* Fill area */}
          <AnimatedPath
            d={fillPath}
            fill="url(#heartGradient)"
            stroke="none"
            animatedProps={animatedFillProps}
          />
          
          {/* Stroke line */}
          <AnimatedPath
            d={heartPath}
            fill="none"
            stroke="#FF2D92"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animatedProps={animatedProps}
          />
        </Svg>
      </View>

      <View style={styles.bpmContainer}>
        <Text style={styles.bpm}>{bpm}</Text>
        <Text style={styles.bpmLabel}>bpm</Text>
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
    height: 200, // Increased height to match image proportions
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  title: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  bpmContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  bpm: {
    color: 'white',
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  bpmLabel: {
    color: '#8E8E93',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 4,
    marginBottom: 2,
  },
});

export default HeartCard;