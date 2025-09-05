// NightMoonScene.js
import React, { memo, useEffect, useMemo } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Circle, Path, Rect, LinearGradient } from "react-native-svg";
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

const { width: W, height: H } = Dimensions.get("window");
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const NightMoonScene = React.memo(({ 
  width = W, 
  height = Math.min(H * 0.6, 400),
  autoStart = true,
}) => {
  // Shared values for animations
  const masterProgress = useSharedValue(0);
  const breathingProgress = useSharedValue(0);
  const time = useSharedValue(0);
  
  // Pre-calculate layout values - useMemo for performance
  const { centerX, moonStartY, moonEndY, arcPath, starPositions } = useMemo(() => {
    const centerX = width * 0.7; // Position moon slightly to the right
    const moonStartY = height + 100;
    const moonEndY = height * 0.25; // Higher position for moon
    const arcPath = `M0,${height} Q${centerX},${height * 1.25} ${width},${height} L${width},${height} L0,${height} Z`;
    
    // Stars instead of lens flares
    const starPositions = [
      { cx: width * 0.15, cy: height * 0.15, r: 3, opacity: 0.9 },
      { cx: width * 0.25, cy: height * 0.35, r: 2.5, opacity: 0.8 },
      { cx: width * 0.35, cy: height * 0.2, r: 2, opacity: 0.7 },
      { cx: width * 0.85, cy: height * 0.4, r: 2.5, opacity: 0.8 },
      { cx: width * 0.9, cy: height * 0.2, r: 2, opacity: 0.75 },
      { cx: width * 0.1, cy: height * 0.5, r: 2, opacity: 0.6 },
    ];

    return { centerX, moonStartY, moonEndY, arcPath, starPositions };
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
          duration: 2000, // Slower breathing for moon
          easing: Easing.bezier(0.37, 0, 0.63, 1) 
        }),
        withTiming(0, { 
          duration: 2000, 
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
  const moonAnimatedProps = useAnimatedProps(() => {
    'worklet';
    const progress = masterProgress.value;
    const breathing = breathingProgress.value;
    
    const y = interpolate(progress, [0, 1], [moonStartY, moonEndY]);
    const baseRadius = interpolate(progress, [0, 1], [35, 45]); // Smaller than sun
    const breathingRadius = interpolate(breathing, [0, 1], [0, 4]); // Subtle breathing
    const floatOffset = Math.sin(time.value * 0.0006) * 1.5; // Gentle float
    
    return {
      cy: y + floatOffset,
      r: baseRadius + breathingRadius,
    };
  });

  const moonGlowAnimatedProps = useAnimatedProps(() => {
    'worklet';
    const progress = masterProgress.value;
    const breathing = breathingProgress.value;
    
    const opacity = interpolate(progress, [0, 1], [0.1, 0.4]); // Softer glow
    const baseRadius = interpolate(progress, [0, 1], [80, 95]);
    const breathingRadius = interpolate(breathing, [0, 1], [0, 8]);
    const pulseRadius = Math.sin(time.value * 0.0008) * 5;
    
    return {
      r: baseRadius + breathingRadius + pulseRadius,
      opacity: opacity + Math.sin(time.value * 0.0005) * 0.05,
    };
  });

  const skyAnimatedProps = useAnimatedProps(() => {
    'worklet';
    const progress = masterProgress.value;
    const opacity = interpolate(progress, [0, 1], [0.1, 0.95]); // Darker sky
    
    return {
      opacity,
    };
  });

  // Memoize static elements to prevent re-renders
  const gradientDefs = useMemo(() => (
    <Defs>
      <RadialGradient id="moonCore" cx="30%" cy="30%" r="70%">
        <Stop offset="0" stopColor="#F5F5F5" stopOpacity="1" />
        <Stop offset="0.15" stopColor="#EEEEEE" stopOpacity="1" />
        <Stop offset="0.25" stopColor="#E0E0E0" stopOpacity="0.98" />
        <Stop offset="0.35" stopColor="#D0D0D0" stopOpacity="0.95" />
        <Stop offset="0.45" stopColor="#C0C0C0" stopOpacity="0.92" />
        <Stop offset="0.6" stopColor="#B0B0B0" stopOpacity="0.85" />
        <Stop offset="0.75" stopColor="#A0A0A0" stopOpacity="0.75" />
        <Stop offset="0.85" stopColor="#909090" stopOpacity="0.6" />
        <Stop offset="0.95" stopColor="rgba(128,128,128,0.3)" stopOpacity="0.3" />
        <Stop offset="1" stopColor="rgba(112,112,112,0)" stopOpacity="0" />
      </RadialGradient>

      <RadialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
        <Stop offset="0" stopColor="rgba(220,230,255,0.4)" stopOpacity="0.4" />
        <Stop offset="0.2" stopColor="rgba(200,220,255,0.3)" stopOpacity="0.3" />
        <Stop offset="0.4" stopColor="rgba(180,210,255,0.2)" stopOpacity="0.2" />
        <Stop offset="0.6" stopColor="rgba(160,200,255,0.15)" stopOpacity="0.15" />
        <Stop offset="0.8" stopColor="rgba(140,190,255,0.1)" stopOpacity="0.1" />
        <Stop offset="1" stopColor="rgba(120,180,255,0)" stopOpacity="0" />
      </RadialGradient>

      <RadialGradient id="starGlow" cx="50%" cy="50%" r="50%">
        <Stop offset="0" stopColor="rgba(255,255,255,0.8)" stopOpacity="0.8" />
        <Stop offset="0.4" stopColor="rgba(240,245,255,0.5)" stopOpacity="0.5" />
        <Stop offset="0.7" stopColor="rgba(220,230,255,0.3)" stopOpacity="0.3" />
        <Stop offset="1" stopColor="rgba(200,220,255,0)" stopOpacity="0" />
      </RadialGradient>

      <LinearGradient id="nightGround" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#1A1A2E" stopOpacity="1" />
        <Stop offset="20%" stopColor="#16213E" stopOpacity="1" />
        <Stop offset="40%" stopColor="#0F3460" stopOpacity="1" />
        <Stop offset="60%" stopColor="#0E2954" stopOpacity="1" />
        <Stop offset="80%" stopColor="#0A1F3B" stopOpacity="1" />
        <Stop offset="100%" stopColor="#061528" stopOpacity="1" />
      </LinearGradient>

      <LinearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#0B1426" stopOpacity="1" />
        <Stop offset="30%" stopColor="#1A1A2E" stopOpacity="1" />
        <Stop offset="60%" stopColor="#16213E" stopOpacity="1" />
        <Stop offset="100%" stopColor="#0F3460" stopOpacity="1" />
      </LinearGradient>
    </Defs>
  ), []);

  // Memoize static stars
  const staticStars = useMemo(() => 
    starPositions.map((star, index) => (
      <Circle
        key={`star-${index}`}
        cx={star.cx}
        cy={star.cy}
        r={star.r}
        fill="url(#starGlow)"
        opacity={star.opacity}
      />
    )), [starPositions]);

  // Memoize container style
  const containerStyle = useMemo(() => [
    styles.container, 
    { width, height }
  ], [width, height]);

  return (
    <View style={containerStyle}>
      <Svg width={width} height={height}>
        {gradientDefs}
        
        {/* Animated night sky background */}
        <AnimatedRect
          x={0}
          y={0}
          width={width}
          height={height * 0.75}
          fill="url(#nightSky)"
          animatedProps={skyAnimatedProps}
        />
        
        {/* Moon glow */}
        <AnimatedCircle
          cx={centerX}
          cy={moonEndY}
          fill="url(#moonGlow)"
          animatedProps={moonGlowAnimatedProps}
        />

        {/* Moon body */}
        <AnimatedCircle
          cx={centerX}
          fill="url(#moonCore)"
          animatedProps={moonAnimatedProps}
        />

        {/* Static stars */}
        {staticStars}

        {/* Night ground arc */}
        <Path d={arcPath} fill="url(#nightGround)" />
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0B1426",
    borderBottomEndRadius: W * 0.5,
    borderBottomStartRadius: W * 0.5,
    overflow: 'hidden',
  },
});

// Add display name for better debugging
NightMoonScene.displayName = 'NightMoonScene';

export default NightMoonScene;