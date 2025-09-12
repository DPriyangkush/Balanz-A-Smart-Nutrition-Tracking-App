import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { 
  Defs, 
  ClipPath, 
  Circle, 
  Path, 
  LinearGradient, 
  Stop 
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const WaterDropIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path
      d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
      fill="#4A9EFF"
    />
  </Svg>
);

const WaterCard = ({
  current = 0.3,
  glasses = 3,
  total = 8,
  liters = "0.3"
}) => {
  const waveOffset = useSharedValue(0);
  const bubbleAnimation = useSharedValue(0);

  React.useEffect(() => {
    waveOffset.value = withRepeat(
      withTiming(360, { duration: 4000 }),
      -1,
      false
    );
    
    bubbleAnimation.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      false
    );
  }, []);

  // Calculate water level - lower level for more realistic look
  const waterLevel = current * 100;
  const baseWaterY = 90 - (waterLevel * 0.25); // Much lower water level

  const animatedWaveProps = useAnimatedProps(() => {
    const offset = waveOffset.value;
    const wave1Y = baseWaterY + Math.sin((offset * Math.PI) / 180) * 1.5;
    const wave2Y = baseWaterY + Math.sin(((offset + 90) * Math.PI) / 180) * 1;
    const wave3Y = baseWaterY + Math.sin(((offset + 180) * Math.PI) / 180) * 1.2;
    
    const path = `
      M 0 ${wave1Y}
      Q 35 ${wave2Y} 70 ${wave1Y}
      Q 105 ${wave3Y} 140 ${wave1Y}
      Q 175 ${wave2Y} 210 ${wave1Y}
      V 140 H 0 Z
    `;
    
    return { d: path };
  });

  const animatedWaveProps2 = useAnimatedProps(() => {
    const offset = waveOffset.value + 60;
    const wave1Y = baseWaterY + 1.5 + Math.sin((offset * Math.PI) / 180) * 1;
    const wave2Y = baseWaterY + 1.5 + Math.sin(((offset + 120) * Math.PI) / 180) * 0.8;
    const wave3Y = baseWaterY + 1.5 + Math.sin(((offset + 240) * Math.PI) / 180) * 1;
    
    const path = `
      M 0 ${wave1Y}
      Q 35 ${wave2Y} 70 ${wave1Y}
      Q 105 ${wave3Y} 140 ${wave1Y}
      Q 175 ${wave2Y} 210 ${wave1Y}
      V 140 H 0 Z
    `;
    
    return { d: path };
  });

  // Animated bubbles with updated positions
  const animatedBubble1 = useAnimatedProps(() => {
    const progress = bubbleAnimation.value;
    const y = interpolate(progress, [0, 1], [100, 45], Extrapolation.CLAMP);
    const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0], Extrapolation.CLAMP);
    return { cy: y, opacity };
  });

  const animatedBubble2 = useAnimatedProps(() => {
    const progress = (bubbleAnimation.value + 0.3) % 1;
    const y = interpolate(progress, [0, 1], [95, 40], Extrapolation.CLAMP);
    const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0], Extrapolation.CLAMP);
    return { cy: y, opacity };
  });

  const animatedBubble3 = useAnimatedProps(() => {
    const progress = (bubbleAnimation.value + 0.6) % 1;
    const y = interpolate(progress, [0, 1], [105, 50], Extrapolation.CLAMP);
    const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0], Extrapolation.CLAMP);
    return { cy: y, opacity };
  });

  const animatedBubble4 = useAnimatedProps(() => {
    const progress = (bubbleAnimation.value + 0.8) % 1;
    const y = interpolate(progress, [0, 1], [98, 48], Extrapolation.CLAMP);
    const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0], Extrapolation.CLAMP);
    return { cy: y, opacity };
  });

  const animatedBubble5 = useAnimatedProps(() => {
    const progress = (bubbleAnimation.value + 0.4) % 1;
    const y = interpolate(progress, [0, 1], [92, 42], Extrapolation.CLAMP);
    const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0], Extrapolation.CLAMP);
    return { cy: y, opacity };
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <WaterDropIcon />
        </View>
        <Text style={styles.title}>Water</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <Svg width="180" height="180" viewBox="0 0 140 140">
          <Defs>
            <ClipPath id="circleClip">
              <Circle cx="70" cy="70" r="55" />
            </ClipPath>
            <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#4A9EFF" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#007AFF" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          
          {/* Background circle */}
          <Circle
            cx="70"
            cy="70"
            r="55"
            fill="none"
            stroke="#2C2C2E"
            strokeWidth="2.5"
          />
          
          {/* Animated water waves */}
          <AnimatedPath
            animatedProps={animatedWaveProps}
            fill="url(#waterGradient)"
            clipPath="url(#circleClip)"
            opacity="0.8"
          />
          <AnimatedPath
            animatedProps={animatedWaveProps2}
            fill="#4A9EFF"
            clipPath="url(#circleClip)"
            opacity="0.5"
          />
          
          {/* Animated bubbles */}
          <AnimatedCircle
            cx="55"
            cy="85"
            r="2"
            fill="#87CEEB"
            animatedProps={animatedBubble1}
            clipPath="url(#circleClip)"
          />
          <AnimatedCircle
            cx="85"
            cy="80"
            r="1.5"
            fill="#87CEEB"
            animatedProps={animatedBubble2}
            clipPath="url(#circleClip)"
          />
          <AnimatedCircle
            cx="75"
            cy="90"
            r="1"
            fill="#87CEEB"
            animatedProps={animatedBubble3}
            clipPath="url(#circleClip)"
          />
          <AnimatedCircle
            cx="95"
            cy="65"
            r="2.5"
            fill="#87CEEB"
            animatedProps={animatedBubble4}
            clipPath="url(#circleClip)"
          />
          <AnimatedCircle
            cx="65"
            cy="75"
            r="1"
            fill="#87CEEB"
            animatedProps={animatedBubble5}
            clipPath="url(#circleClip)"
          />
          
          {/* Circle border */}
          <Circle
            cx="70"
            cy="70"
            r="55"
            fill="none"
            stroke="#4A9EFF"
            strokeWidth="3"
            opacity="0.8"
          />
        </Svg>
        
        <View style={styles.centerContent}>
          <Text style={styles.litersValue}>{liters}</Text>
          <Text style={styles.litersLabel}>Liters</Text>
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
    height: 240,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#2C4A5A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  title: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  litersValue: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  litersLabel: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default WaterCard;