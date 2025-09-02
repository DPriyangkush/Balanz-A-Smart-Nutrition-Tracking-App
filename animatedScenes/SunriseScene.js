// SunriseSunLensUltraReanimated.js
import React, { memo, useEffect, useMemo } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Circle, Path, Rect } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
  interpolate,
  useFrameCallback,
} from "react-native-reanimated";
import LinearGradient from "react-native-svg";

const { width: W, height: H } = Dimensions.get("window");
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const SunriseSunLensUltraReanimated = React.memo(({ 
  width = W, 
  height = Math.min(H * 0.6, 400),
  autoStart = true,
}) => {
  // Shared values for animations
  const masterProgress = useSharedValue(0);
  const breathingProgress = useSharedValue(0);
  const time = useSharedValue(0);
  
  // Pre-calculate layout values - useMemo for performance
  const { centerX, sunStartY, sunEndY, arcPath, flarePositions } = useMemo(() => {
    const centerX = width * 0.5;
    const sunStartY = height + 100;
    const sunEndY = height * 0.4;
    const arcPath = `M0,${height} Q${centerX},${height * 1.25} ${width},${height} L${width},${height} L0,${height} Z`;
    
    const flarePositions = [
      { cx: width * 0.28, cy: height * 0.32, r: 24, opacity: 0.16 },
      { cx: width * 0.72, cy: height * 0.38, r: 19, opacity: 0.13 },
      { cx: width * 0.22, cy: height * 0.62, r: 16, opacity: 0.11 },
      { cx: width * 0.78, cy: height * 0.28, r: 14, opacity: 0.09 },
    ];

    return { centerX, sunStartY, sunEndY, arcPath, flarePositions };
  }, [width, height]);

  // High-performance frame callback for smooth animations
  useFrameCallback((frameInfo) => {
    'worklet';
    time.value = frameInfo.timeSinceFirstFrame;
  }, autoStart);

  // Start animations
  useEffect(() => {
    if (!autoStart) return;

    masterProgress.value = withTiming(1, {
      duration: 3200,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    });

    breathingProgress.value = withRepeat(
      withSequence(
        withTiming(1, { 
          duration: 1600, 
          easing: Easing.bezier(0.37, 0, 0.63, 1) 
        }),
        withTiming(0, { 
          duration: 1600, 
          easing: Easing.bezier(0.37, 0, 0.63, 1) 
        })
      ),
      -1,
      true
    );

    return () => {
      cancelAnimation(masterProgress);
      cancelAnimation(breathingProgress);
    };
  }, [autoStart]);

  // Animated props using Reanimated's worklet functions
  const sunAnimatedProps = useAnimatedProps(() => {
    'worklet';
    const progress = masterProgress.value;
    const breathing = breathingProgress.value;
    
    const y = interpolate(progress, [0, 1], [sunStartY, sunEndY]);
    const baseRadius = interpolate(progress, [0, 1], [52, 60]);
    const breathingRadius = interpolate(breathing, [0, 1], [0, 8]);
    const floatOffset = Math.sin(time.value * 0.0008) * 2.5;
    
    return {
      cy: y + floatOffset,
      r: baseRadius + breathingRadius,
    };
  });

  const glowAnimatedProps = useAnimatedProps(() => {
    'worklet';
    const progress = masterProgress.value;
    const breathing = breathingProgress.value;
    
    const opacity = interpolate(progress, [0, 1], [0.2, 0.65]);
    const baseRadius = interpolate(progress, [0, 1], [100, 115]);
    const breathingRadius = interpolate(breathing, [0, 1], [0, 12]);
    const pulseRadius = Math.sin(time.value * 0.0009) * 8;
    
    return {
      r: baseRadius + breathingRadius + pulseRadius,
      opacity: opacity + Math.sin(time.value * 0.0007) * 0.08,
    };
  });

  const skyAnimatedProps = useAnimatedProps(() => {
    'worklet';
    const progress = masterProgress.value;
    const opacity = interpolate(progress, [0, 1], [0.1, 0.3]);
    
    return {
      opacity,
    };
  });

  // Memoize static elements to prevent re-renders
  const gradientDefs = useMemo(() => (
    <Defs>
      <RadialGradient id="ultraSunCore" cx="45%" cy="40%" r="60%">
        <Stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
        <Stop offset="0.15" stopColor="#FFFEF7" stopOpacity="1" />
        <Stop offset="0.25" stopColor="#FFF8E6" stopOpacity="0.98" />
        <Stop offset="0.35" stopColor="#FFF0C9" stopOpacity="0.95" />
        <Stop offset="0.45" stopColor="#FFE4A3" stopOpacity="0.92" />
        <Stop offset="0.6" stopColor="#FFD670" stopOpacity="0.85" />
        <Stop offset="0.75" stopColor="#FFBC42" stopOpacity="0.75" />
        <Stop offset="0.85" stopColor="#FF9500" stopOpacity="0.6" />
        <Stop offset="0.95" stopColor="rgba(255,140,0,0.3)" stopOpacity="0.3" />
        <Stop offset="1" stopColor="rgba(255,120,0,0)" stopOpacity="0" />
      </RadialGradient>

      <RadialGradient id="dynamicAtmosphere" cx="50%" cy="50%" r="50%">
        <Stop offset="0" stopColor="rgba(255,240,220,0.75)" stopOpacity="0.75" />
        <Stop offset="0.2" stopColor="rgba(255,220,180,0.6)" stopOpacity="0.6" />
        <Stop offset="0.4" stopColor="rgba(255,195,140,0.45)" stopOpacity="0.45" />
        <Stop offset="0.6" stopColor="rgba(255,170,100,0.3)" stopOpacity="0.3" />
        <Stop offset="0.8" stopColor="rgba(255,145,70,0.15)" stopOpacity="0.15" />
        <Stop offset="1" stopColor="rgba(255,120,40,0)" stopOpacity="0" />
      </RadialGradient>

      <RadialGradient id="premiumFlare" cx="50%" cy="50%" r="50%">
        <Stop offset="0" stopColor="rgba(255,255,245,0.6)" stopOpacity="0.6" />
        <Stop offset="0.4" stopColor="rgba(255,245,220,0.4)" stopOpacity="0.4" />
        <Stop offset="0.7" stopColor="rgba(255,230,190,0.2)" stopOpacity="0.2" />
        <Stop offset="1" stopColor="rgba(255,215,160,0)" stopOpacity="0" />
      </RadialGradient>

      <LinearGradient id="premiumGround" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#FF7A47" stopOpacity="1" />
        <Stop offset="20%" stopColor="#FF8C59" stopOpacity="1" />
        <Stop offset="40%" stopColor="#FF9D6B" stopOpacity="1" />
        <Stop offset="60%" stopColor="#E8751A" stopOpacity="1" />
        <Stop offset="80%" stopColor="#D6640F" stopOpacity="1" />
        <Stop offset="100%" stopColor="#C55500" stopOpacity="1" />
      </LinearGradient>
    </Defs>
  ), []);

  // Memoize static lens flares
  const staticFlares = useMemo(() => 
    flarePositions.map((flare, index) => (
      <Circle
        key={`flare-${index}`}
        cx={flare.cx}
        cy={flare.cy}
        r={flare.r}
        fill="url(#premiumFlare)"
        opacity={flare.opacity}
      />
    )), [flarePositions]);

  // Memoize container style
  const containerStyle = useMemo(() => [
    styles.container, 
    { width, height }
  ], [width, height]);

  return (
    <View style={containerStyle}>
      <Svg width={width} height={height}>
        {gradientDefs}
        
        {/* Animated sky background */}
        <AnimatedRect
          x={0}
          y={0}
          width={width}
          height={height * 0.75}
          fill="rgba(255,248,240)"
          animatedProps={skyAnimatedProps}
        />
        
        {/* Atmosphere glow */}
        <AnimatedCircle
          cx={centerX}
          cy={sunEndY}
          fill="url(#dynamicAtmosphere)"
          animatedProps={glowAnimatedProps}
        />

        {/* Sun body */}
        <AnimatedCircle
          cx={centerX}
          fill="url(#ultraSunCore)"
          animatedProps={sunAnimatedProps}
        />

        {/* Static lens flares */}
        {staticFlares}

        {/* Ground arc */}
        <Path d={arcPath} fill="url(#premiumGround)" />
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF8E8",
    borderBottomEndRadius: W * 0.5,
    borderBottomStartRadius: W * 0.5,
    overflow: 'hidden',
  },
});

// Add display name for better debugging
SunriseSunLensUltraReanimated.displayName = 'SunriseSunLensUltraReanimated';

export default SunriseSunLensUltraReanimated;