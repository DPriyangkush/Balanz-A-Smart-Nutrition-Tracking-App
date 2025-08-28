// SunriseSunLensUltraOptimized.js - Skia-level Performance with SVG
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View, Dimensions } from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Circle,
  Path,
  Mask,
  Rect,
  G,
} from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Easing,
  useDerivedValue,
  runOnUI,
  cancelAnimation,
} from "react-native-reanimated";

const { width: W, height: H } = Dimensions.get("window");

// Pre-create animated components with display names for better performance
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
AnimatedCircle.displayName = 'AnimatedCircle';

// Performance constants - optimized for 60fps
const PERF_CONFIG = {
  RISE_DURATION: 3200, // Slightly faster for snappier feel
  BREATHING_DURATION: 1600, // Reduced for smoother breathing
  SHIMMER_DURATION: 2400, // Separate shimmer timing
  SUN_BASE_RADIUS: 60,
  SUN_BREATHING_RANGE: 8, // More pronounced breathing
  GLOW_BASE_RADIUS: 115,
  GLOW_PULSE_RANGE: 12,
  FLOAT_AMPLITUDE: 2.5, // Subtle floating motion
};

const SunriseSunLensUltra = React.memo(({ 
  width = W, 
  height = Math.min(H * 0.6, 400),
  autoStart = true,
}) => {
  // High-performance shared values
  const masterProgress = useSharedValue(0);
  const breathingCycle = useSharedValue(0);
  const shimmerCycle = useSharedValue(0);
  const clockTime = useSharedValue(0);
  
  const animationRef = useRef(null);
  const isUnmounted = useRef(false);

  // Ultra-optimized layout calculations - computed once
  const layout = useMemo(() => {
    const centerX = width * 0.5;
    const sunStartY = height + 100;
    const sunEndY = height * 0.4; // Slightly higher for better visibility
    const arcCurveY = height * 1.25; // More pronounced curve
    
    return {
      centerX,
      sunStartY,
      sunEndY,
      glowEndY: height * 0.42,
      arcPath: `M0,${height} Q${centerX},${arcCurveY} ${width},${height} L${width},${height} L0,${height} Z`,
      // Pre-calculate lens flare positions for static rendering
      flarePositions: [
        { cx: width * 0.28, cy: height * 0.32, r: 24, opacity: 0.16 },
        { cx: width * 0.72, cy: height * 0.38, r: 19, opacity: 0.13 },
        { cx: width * 0.22, cy: height * 0.62, r: 16, opacity: 0.11 },
        { cx: width * 0.78, cy: height * 0.28, r: 14, opacity: 0.09 },
      ],
    };
  }, [width, height]);

  // High-precision clock for ultra-smooth effects
  const startHighPrecisionClock = useCallback(() => {
    const startTime = performance.now();
    
    const updateClock = () => {
      if (isUnmounted.current) return;
      
      clockTime.value = performance.now() - startTime;
      animationRef.current = requestAnimationFrame(updateClock);
    };
    
    animationRef.current = requestAnimationFrame(updateClock);
  }, [clockTime]);

  // Ultra-smooth animation setup
  useEffect(() => {
    if (!autoStart) return;

    // Start high-precision clock immediately
    startHighPrecisionClock();

    // Staggered animation start for natural feel
    const startAnimations = () => {
      // Main rise animation with custom bezier curve
      masterProgress.value = withTiming(1, {
        duration: PERF_CONFIG.RISE_DURATION,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94), // Custom easing for natural motion
      });

      // Delayed breathing animation for realism
      setTimeout(() => {
        breathingCycle.value = withRepeat(
          withSequence(
            withTiming(1, {
              duration: PERF_CONFIG.BREATHING_DURATION,
              easing: Easing.bezier(0.37, 0, 0.63, 1), // Smooth in-out
            }),
            withTiming(0, {
              duration: PERF_CONFIG.BREATHING_DURATION,
              easing: Easing.bezier(0.37, 0, 0.63, 1),
            })
          ),
          -1,
          true
        );
      }, PERF_CONFIG.RISE_DURATION * 0.7);

      // Shimmer effect with different timing
      setTimeout(() => {
        shimmerCycle.value = withRepeat(
          withTiming(1, {
            duration: PERF_CONFIG.SHIMMER_DURATION,
            easing: Easing.bezier(0.45, 0, 0.55, 1),
          }),
          -1,
          true
        );
      }, PERF_CONFIG.RISE_DURATION * 0.5);
    };

    // Micro-delay for smoother start
    setTimeout(startAnimations, 100);

    return () => {
      isUnmounted.current = true;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      cancelAnimation(masterProgress);
      cancelAnimation(breathingCycle);
      cancelAnimation(shimmerCycle);
    };
  }, [autoStart, masterProgress, breathingCycle, shimmerCycle, startHighPrecisionClock]);

  // Ultra-optimized derived values with minimal calculations
  const sunPosition = useDerivedValue(() => {
    const baseY = interpolate(
      masterProgress.value,
      [0, 1],
      [layout.sunStartY, layout.sunEndY]
    );
    
    // Subtle floating motion using high-precision clock
    const floatOffset = Math.sin(clockTime.value * 0.0008) * PERF_CONFIG.FLOAT_AMPLITUDE;
    
    return baseY + floatOffset;
  }, [masterProgress, clockTime, layout]);

  const sunRadius = useDerivedValue(() => {
    // Base radius with growth
    const baseRadius = interpolate(
      masterProgress.value,
      [0, 1],
      [PERF_CONFIG.SUN_BASE_RADIUS - 8, PERF_CONFIG.SUN_BASE_RADIUS]
    );
    
    // Breathing effect
    const breathingOffset = interpolate(
      breathingCycle.value,
      [0, 1],
      [0, PERF_CONFIG.SUN_BREATHING_RANGE]
    );
    
    // Shimmer using high-precision timing
    const shimmerOffset = Math.sin(clockTime.value * 0.0012) * 1.2;
    
    return Math.max(baseRadius + breathingOffset + shimmerOffset, 45);
  }, [masterProgress, breathingCycle, clockTime]);

  const glowProps = useDerivedValue(() => {
    const baseRadius = interpolate(
      masterProgress.value,
      [0, 1],
      [PERF_CONFIG.GLOW_BASE_RADIUS - 15, PERF_CONFIG.GLOW_BASE_RADIUS]
    );
    
    const pulseOffset = Math.sin(clockTime.value * 0.0009) * PERF_CONFIG.GLOW_PULSE_RANGE;
    const breathingOffset = interpolate(breathingCycle.value, [0, 1], [0, 6]);
    
    const radius = baseRadius + pulseOffset + breathingOffset;
    const opacity = interpolate(masterProgress.value, [0, 1], [0.2, 0.65]);
    const dynamicOpacity = opacity + Math.sin(clockTime.value * 0.0007) * 0.08;
    
    return {
      r: Math.max(radius, 85),
      opacity: Math.max(Math.min(dynamicOpacity, 0.75), 0.15),
    };
  }, [masterProgress, breathingCycle, clockTime]);

  // Memoized animated props with minimal object creation
  const sunAnimatedProps = useAnimatedProps(() => ({
    r: sunRadius.value,
    cy: sunPosition.value,
  }), [sunRadius, sunPosition]);

  const glowAnimatedProps = useAnimatedProps(() => ({
    r: glowProps.value.r,
    cy: sunPosition.value,
    opacity: glowProps.value.opacity,
  }), [glowProps, sunPosition]);

  // Ultra-realistic gradient definitions - memoized for performance
  const gradientDefs = useMemo(() => (
    <Defs>
      {/* Ultra-realistic 10-stop sun gradient */}
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

      {/* Dynamic atmosphere glow with multiple layers */}
      <RadialGradient id="dynamicAtmosphere" cx="50%" cy="50%" r="50%">
        <Stop offset="0" stopColor="rgba(255,240,220,0.75)" stopOpacity="0.75" />
        <Stop offset="0.2" stopColor="rgba(255,220,180,0.6)" stopOpacity="0.6" />
        <Stop offset="0.4" stopColor="rgba(255,195,140,0.45)" stopOpacity="0.45" />
        <Stop offset="0.6" stopColor="rgba(255,170,100,0.3)" stopOpacity="0.3" />
        <Stop offset="0.8" stopColor="rgba(255,145,70,0.15)" stopOpacity="0.15" />
        <Stop offset="1" stopColor="rgba(255,120,40,0)" stopOpacity="0" />
      </RadialGradient>

      {/* Corona effect */}
      <RadialGradient id="coronaEffect" cx="50%" cy="50%" r="70%">
        <Stop offset="0" stopColor="rgba(255,255,255,0.4)" stopOpacity="0.4" />
        <Stop offset="0.3" stopColor="rgba(255,250,235,0.3)" stopOpacity="0.3" />
        <Stop offset="0.6" stopColor="rgba(255,235,200,0.2)" stopOpacity="0.2" />
        <Stop offset="1" stopColor="rgba(255,220,180,0)" stopOpacity="0" />
      </RadialGradient>

      {/* Premium lens flare */}
      <RadialGradient id="premiumFlare" cx="50%" cy="50%" r="50%">
        <Stop offset="0" stopColor="rgba(255,255,245,0.6)" stopOpacity="0.6" />
        <Stop offset="0.4" stopColor="rgba(255,245,220,0.4)" stopOpacity="0.4" />
        <Stop offset="0.7" stopColor="rgba(255,230,190,0.2)" stopOpacity="0.2" />
        <Stop offset="1" stopColor="rgba(255,215,160,0)" stopOpacity="0" />
      </RadialGradient>

      {/* Enhanced ground gradient */}
      <LinearGradient id="premiumGround" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#FF7A47" stopOpacity="1" />
        <Stop offset="20%" stopColor="#FF8C59" stopOpacity="1" />
        <Stop offset="40%" stopColor="#FF9D6B" stopOpacity="1" />
        <Stop offset="60%" stopColor="#E8751A" stopOpacity="1" />
        <Stop offset="80%" stopColor="#D6640F" stopOpacity="1" />
        <Stop offset="100%" stopColor="#C55500" stopOpacity="1" />
      </LinearGradient>

      {/* Optimized mask */}
      <Mask id="sunMask">
        <Rect width={width} height={height} fill="white" />
        <Path d={layout.arcPath} fill="black" />
      </Mask>
    </Defs>
  ), [width, height, layout.arcPath]);

  // Static lens flares - rendered once for performance
  const staticFlares = useMemo(() => 
    layout.flarePositions.map((flare, index) => (
      <Circle
        key={`flare-${index}`}
        cx={flare.cx}
        cy={flare.cy}
        r={flare.r}
        fill="url(#premiumFlare)"
        opacity={flare.opacity}
      />
    )), [layout.flarePositions]);

  // Optimized container style
  const containerStyle = useMemo(() => ({
    width,
    height,
    backgroundColor: "#FFF8E8",
    borderBottomEndRadius: width * 0.5,
    borderBottomStartRadius: width * 0.5,
    overflow: 'hidden',
  }), [width, height]);

  return (
    <View style={containerStyle}>
      <Svg width={width} height={height} style={{ backgroundColor: 'transparent' }}>
        {gradientDefs}
        
        {/* Sky background with subtle gradient */}
        <Rect 
          x={0} 
          y={0} 
          width={width} 
          height={height * 0.75}
          fill="rgba(255,248,240,0.3)"
        />
        
        <G mask="url(#sunMask)">
          {/* Outer atmosphere glow - animated */}
          <AnimatedCircle
            cx={layout.centerX}
            fill="url(#dynamicAtmosphere)"
            animatedProps={glowAnimatedProps}
          />

          {/* Corona effect layer */}
          <AnimatedCircle
            cx={layout.centerX}
            cy={sunPosition}
            r={sunRadius}
            fill="url(#coronaEffect)"
            opacity={0.6}
            transform={`scale(1.3)`}
          />

          {/* Main sun body - ultra-realistic */}
          <AnimatedCircle
            cx={layout.centerX}
            fill="url(#ultraSunCore)"
            animatedProps={sunAnimatedProps}
          />

          {/* Static lens flares */}
          {staticFlares}

          {/* Dynamic highlight for 3D effect */}
          <AnimatedCircle
            cx={layout.centerX - 15}
            cy={sunPosition}
            r={sunRadius}
            fill="rgba(255,255,255,0.25)"
            opacity={0.4}
            transform={`translate(-8, -8) scale(0.6)`}
          />
        </G>

        {/* Ground arc with premium gradient */}
        <Path d={layout.arcPath} fill="url(#premiumGround)" />
      </Svg>
    </View>
  );
});

SunriseSunLensUltra.displayName = 'SunriseSunLensUltra';

export default SunriseSunLensUltra;