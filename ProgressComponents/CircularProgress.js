import React, { useEffect, useRef } from 'react';
import { View, Text as RnText, StyleSheet, Dimensions, Animated } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
  Line,
  G,
} from 'react-native-svg';

const { width } = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);

const CircularProgress = ({
  percentage = 63,
  size = Math.min(width * 0.8, 300),
  strokeWidth = 20,
  backgroundColor = '#E8E8E8',
  gradientColors = ['#4CAF50', '#8BC34A'],
  outerGradientColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'],
  scaleSteps = [0, 100, 200, 300, 400],
  maxValue = 400,
  animationDuration = 1500,
  centerTitle = 'Average Kcal Consumed',
  showScaleLabels = true,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const outerAnimatedValue = useRef(new Animated.Value(0)).current;

  // Convert absolute value to percentage
  const progressPercentage = Math.min((percentage / maxValue) * 100, 100);
  const displayValue = percentage > maxValue ? maxValue : percentage;

  useEffect(() => {
    animatedValue.setValue(0);
    outerAnimatedValue.setValue(0);
    
    // Animate the main progress
    Animated.timing(animatedValue, {
      toValue: progressPercentage,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();

    // Animate the outer colorful arc with a slight delay
    Animated.timing(outerAnimatedValue, {
      toValue: 100,
      duration: animationDuration + 500,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage, animationDuration]);

  // Calculate dimensions with proper bounds for outer arc
  const outerStrokeWidth = 6;
  const outerArcOffset = strokeWidth + 8;
  const radius = (size - strokeWidth) / 2;
  const outerRadius = radius + outerArcOffset;
  const labelOffset = 15;
  
  // Calculate the maximum horizontal extent needed
  const maxHorizontalRadius = outerRadius + outerStrokeWidth/2 + labelOffset + 20;
  const svgWidth = maxHorizontalRadius * 2 + 40; // Extra padding
  const svgHeight = size + 80; // Extra height for labels
  
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2 - 20; // Slight offset for better positioning

  // Shift arc downward
  const arcYOffset = size * 0.1; 
  const shiftedCenterY = centerY + arcYOffset;

  // Helper functions
  const polarToCartesian = (cx, cy, r, angle) => {
    const angleRad = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  const createArcPath = (r, startAngle, endAngle) => {
    const start = polarToCartesian(centerX, shiftedCenterY, r, startAngle);
    const end = polarToCartesian(centerX, shiftedCenterY, r, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  // Arc configuration
  const startAngle = 270;
  const totalArcAngle = 180;
  const endAngle = startAngle + totalArcAngle;

  // Create paths
  const backgroundPath = createArcPath(radius, startAngle, endAngle);
  const outerPath = createArcPath(outerRadius, startAngle, endAngle);
  
  // Calculate arc lengths
  const arcLength = (totalArcAngle / 360) * 2 * Math.PI * radius;
  const outerArcLength = (totalArcAngle / 360) * 2 * Math.PI * outerRadius;

  const labels = scaleSteps;
  const minorTickCount = 20;

  // Keep center content based on center position
  const centerContentTop = centerY - radius * 0.3;

  return (
    <View style={[styles.wrapper, { width: svgWidth, height: svgHeight }]}>
      <Svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={gradientColors[0]} stopOpacity="1" />
            <Stop offset="100%" stopColor={gradientColors[1]} stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {outerGradientColors.map((color, index) => (
              <Stop 
                key={index} 
                offset={`${(index / (outerGradientColors.length - 1)) * 100}%`} 
                stopColor={color} 
                stopOpacity="0.8" 
              />
            ))}
          </LinearGradient>
        </Defs>

        {/* outer colorful animated arc */}
        <AnimatedPath
          d={outerPath}
          stroke="url(#outerGradient)"
          strokeWidth={outerStrokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={outerArcLength}
          strokeDashoffset={outerAnimatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: [outerArcLength, 0],
          })}
          opacity={0.9}
        />

        {/* background arc */}
        <Path
          d={backgroundPath}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* progress arc */}
        <AnimatedPath
          d={backgroundPath}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: [arcLength, 0],
          })}
        />

        {/* ticks */}
        <G>
          {Array.from({ length: minorTickCount + 1 }).map((_, i) => {
            const angle = startAngle + (i / minorTickCount) * totalArcAngle;
            const outer = polarToCartesian(centerX, shiftedCenterY, radius + strokeWidth / 2, angle);
            const inner = polarToCartesian(centerX, shiftedCenterY, radius - strokeWidth / 2 - 6, angle);
            return (
              <Line
                key={`tick-${i}`}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="#ddd"
                strokeWidth={i % (minorTickCount / 4) === 0 ? 2 : 1}
                strokeLinecap="round"
              />
            );
          })}
        </G>

        {/* labels */}
        {showScaleLabels && labels.map((label, idx) => {
          const angle = startAngle + (idx / (labels.length - 1)) * totalArcAngle;
          const pos = polarToCartesian(centerX, shiftedCenterY, outerRadius + labelOffset, angle);
          return (
            <SvgText
              key={`label-${label}`}
              x={pos.x}
              y={pos.y}
              fontSize={Math.max(10, Math.round(size * 0.04))}
              fill="#666"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {label}
            </SvgText>
          );
        })}
      </Svg>

      {/* center content */}
      <View style={[styles.centerContent, { top: centerContentTop }]}>
        <RnText style={[styles.percentageText, { fontSize: size * 0.2 }]}>
          {displayValue}
        </RnText>
        <RnText style={[styles.titleText, { fontSize: size * 0.04 }]}>
          {centerTitle}
        </RnText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  percentageText: {
    fontWeight: '700',
    color: '#4CAF50',
    textAlign: 'center',
  },
  titleText: {
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
    marginTop: 4,
  },
});

export default CircularProgress;