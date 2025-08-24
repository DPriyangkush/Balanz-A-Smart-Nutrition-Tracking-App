// LogButton.js
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Button,
  Text,
  XStack,
  YStack,
  styled,
  useTheme,
} from 'tamagui';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// Animated components
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// Styled Tamagui components
const LogButtonContainer = styled(YStack, {
  name: 'LogButtonContainer',
  borderRadius: 20,
  overflow: 'hidden',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.25,
  shadowRadius: 16,
  elevation: 8,
});

const LogButton = ({ 
  title = "Log Progress",
  subtitle = "Track your journey",
  icon = "add-circle",
  onPress,
  disabled = false,
  variant = "primary",
  size = "medium",
  showRipple = true,
  gradientColors,
  style,
  ...props 
}) => {
  const theme = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  const glowIntensity = useSharedValue(0);

  // Variant configurations
  const variants = {
    primary: {
      colors: gradientColors || ['#FF8A50', '#FF6B35', '#E55A2B'],
      textColor: '#FFFFFF',
      iconColor: '#FFFFFF',
      blurTint: 'light',
    },
    secondary: {
      colors: gradientColors || ['#6366F1', '#4F46E5', '#3730A3'],
      textColor: '#FFFFFF',
      iconColor: '#FFFFFF',
      blurTint: 'light',
    },
    success: {
      colors: gradientColors || ['#10B981', '#059669', '#047857'],
      textColor: '#FFFFFF',
      iconColor: '#FFFFFF',
      blurTint: 'light',
    },
    warning: {
      colors: gradientColors || ['#F59E0B', '#D97706', '#B45309'],
      textColor: '#FFFFFF',
      iconColor: '#FFFFFF',
      blurTint: 'light',
    },
  };

  // Size configurations
  const sizes = {
    small: {
      height: 50,
      paddingHorizontal: 20,
      titleSize: 14,
      subtitleSize: 12,
      iconSize: 20,
      borderRadius: 16,
    },
    medium: {
      height: 65,
      paddingHorizontal: 24,
      titleSize: 16,
      subtitleSize: 13,
      iconSize: 24,
      borderRadius: 20,
    },
    large: {
      height: 75,
      paddingHorizontal: 28,
      titleSize: 18,
      subtitleSize: 14,
      iconSize: 28,
      borderRadius: 24,
    },
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  // Animation handlers
  const handlePressIn = () => {
    if (disabled) return;
    
    setIsPressed(true);
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 200,
    });
    
    glowIntensity.value = withTiming(1, { duration: 200 });
    
    if (showRipple) {
      rippleScale.value = 0;
      rippleOpacity.value = 0.6;
      rippleScale.value = withTiming(2, { duration: 600 });
      rippleOpacity.value = withTiming(0, { duration: 600 });
    }
  };

  const handlePressOut = () => {
    setIsPressed(false);
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
    glowIntensity.value = withTiming(0, { duration: 300 });
  };

  const handlePress = () => {
    if (disabled || !onPress) return;
    
    // Haptic feedback for iOS
    if (Platform.OS === 'ios') {
      const { HapticFeedback } = require('expo-haptics');
      HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);
    }
    
    onPress();
  };

  // Animated styles
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: disabled ? 0.6 : opacity.value,
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(
      glowIntensity.value,
      [0, 1],
      [0, 0.4],
      Extrapolate.CLAMP
    );
    
    return {
      opacity: glowOpacity,
      transform: [{ scale: interpolate(glowIntensity.value, [0, 1], [1, 1.05]) }],
    };
  });

  const animatedRippleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: rippleScale.value }],
      opacity: rippleOpacity.value,
    };
  });

  return (
    <LogButtonContainer style={[{ height: currentSize.height }, style]} {...props}>
      {/* Glow effect */}
      <Animated.View style={[styles.glowContainer, animatedGlowStyle]}>
        <LinearGradient
          colors={[currentVariant.colors[0] + '40', currentVariant.colors[1] + '20', 'transparent']}
          style={styles.glow}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      {/* Main button */}
      <AnimatedPressable
        style={[styles.button, animatedButtonStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
      >
        {/* Background blur effect */}
        <BlurView
          intensity={20}
          style={styles.blurBackground}
          tint={currentVariant.blurTint}
        >
          {/* Gradient overlay */}
          <AnimatedLinearGradient
            colors={currentVariant.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.gradientBackground,
              { borderRadius: currentSize.borderRadius }
            ]}
          >
            {/* Ripple effect */}
            {showRipple && (
              <Animated.View style={[styles.ripple, animatedRippleStyle]}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)', 'transparent']}
                  style={styles.rippleGradient}
                  start={{ x: 0.5, y: 0.5 }}
                  end={{ x: 1, y: 1 }}
                />
              </Animated.View>
            )}

            {/* Content */}
            <XStack
              alignItems="center"
              justifyContent="center"
              space="$3"
              paddingHorizontal={currentSize.paddingHorizontal}
              height="100%"
            >
              {/* Icon */}
              <Ionicons
                name={icon}
                size={currentSize.iconSize}
                color={currentVariant.iconColor}
                style={styles.icon}
              />

              {/* Text content */}
              <YStack flex={1} alignItems="flex-start">
                <Text
                  fontSize={currentSize.titleSize}
                  fontWeight="700"
                  color={currentVariant.textColor}
                  numberOfLines={1}
                >
                  {title}
                </Text>
                {subtitle && (
                  <Text
                    fontSize={currentSize.subtitleSize}
                    fontWeight="500"
                    color={currentVariant.textColor}
                    opacity={0.8}
                    numberOfLines={1}
                  >
                    {subtitle}
                  </Text>
                )}
              </YStack>

              {/* Arrow indicator */}
              <Ionicons
                name="chevron-forward"
                size={currentSize.iconSize - 4}
                color={currentVariant.iconColor}
                style={[styles.arrow, { opacity: 0.7 }]}
              />
            </XStack>
          </AnimatedLinearGradient>
        </BlurView>
      </AnimatedPressable>
    </LogButtonContainer>
  );
};

const styles = StyleSheet.create({
  glowContainer: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    zIndex: 0,
  },
  glow: {
    flex: 1,
    borderRadius: 50,
  },
  button: {
    flex: 1,
    borderRadius: 50,
    overflow: 'hidden',
  },
  blurBackground: {
    flex: 1,
    borderRadius: 20,
  },
  gradientBackground: {
    flex: 1,
    position: 'relative',
  },
  ripple: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 100,
    marginTop: -50,
    marginLeft: -50,
    borderRadius: 50,
    zIndex: 1,
  },
  rippleGradient: {
    flex: 1,
    borderRadius: 50,
  },
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  arrow: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default LogButton;