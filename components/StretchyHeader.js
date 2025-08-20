// components/StretchyHeader.js
import React from "react";
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 160;

export default function StretchyHeader({
  title,
  children,
  headerHeight = HEADER_HEIGHT,
  backgroundColor = "#1e1e1e",
  titleColor = "#fff",
  showSafeArea = true,
  gradientColors = ['#667eea', '#764ba2'],
  blurIntensity = 100 // iOS-style blur intensity
}) {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: headerHeight + Math.max(-scrollY.value, 0),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, headerHeight],
            [0, -headerHeight / 30],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const minScale = 0.9;
    const maxScale = 1.2;
    
    const scale = interpolate(
      scrollY.value,
      [0, headerHeight * 0.6],
      [maxScale, minScale],
      Extrapolate.CLAMP
    );

    // Title starts hidden (opacity 0) and becomes visible when scrolling
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.15], // Start showing title after 15% scroll
      [1, 1], // From completely hidden to fully visible
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight * 0.6],
      [0, -20],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [
        { scale },
        { translateY }
      ],
    };
  });

  // Animated style for text color - starts dark (#1e1e1e), becomes white (#fff) on scroll
  const titleColorStyle = useAnimatedStyle(() => {
    const colorProgress = interpolate(
      scrollY.value,
      [0, headerHeight * 0.25], // Change color after 25% scroll
      [0, 1], // From 0 (dark) to 1 (white)
      Extrapolate.CLAMP
    );
    
    // Interpolate between #1e1e1e (30, 30, 30) and #ffffff (255, 255, 255)
    const red = interpolate(colorProgress, [0, 1], [30, 255], Extrapolate.CLAMP);
    const green = interpolate(colorProgress, [0, 1], [30, 255], Extrapolate.CLAMP);
    const blue = interpolate(colorProgress, [0, 1], [30, 255], Extrapolate.CLAMP);
    
    return {
      color: `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`,
    };
  });

  // Solid background - visible initially, fades out on scroll
  const solidBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.2],
      [1, 0], // Start fully visible, fade out when scrolling
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  // Animated gradient - starts invisible, becomes visible on scroll (original behavior)
  const gradientStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.3],
      [0, 1], // From completely transparent to fully visible
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  // Animated style for blur effects - starts invisible, becomes visible on scroll (original behavior)
  const blurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.9],
      [0, 1], // From completely transparent to fully visible
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  // Animated style for overlay - starts invisible, becomes visible on scroll
  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.4],
      [0, 0.15], // From transparent to subtle overlay
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* Header with iOS-style Blur */}
      <Animated.View style={[styles.headerContainer, headerStyle]}>
        {/* Solid background - visible initially, fades out on scroll */}
        <Animated.View style={[styles.solidBackground, solidBackgroundStyle]} />

        {/* Base gradient layer - Animated opacity (original behavior) */}
        <Animated.View style={[styles.gradientContainer, gradientStyle]}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.headerGradient}
          />
        </Animated.View>
        
        {/* iOS-style BlurView - Animated opacity (original behavior) */}
        <Animated.View style={[styles.blurContainer, blurStyle]}>
          <BlurView 
            intensity={blurIntensity}
            tint="systemMaterialDark" // Back to original tint
            style={styles.iosBlur}
          />
        </Animated.View>

        {/* Secondary blur layer for extra iOS effect - Animated opacity */}
        <Animated.View style={[styles.secondaryBlurContainer, blurStyle]}>
          <BlurView 
            intensity={60}
            tint="systemUltraThinMaterialDark"
            style={styles.secondaryBlur}
          />
        </Animated.View>
        
        {/* Subtle overlay for better text contrast - Animated opacity */}
        <Animated.View style={[styles.overlay, overlayStyle]} />
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerHeight }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Animated.ScrollView>

      {/* Title Overlay */}
      <Animated.View style={[styles.titleContainer, titleStyle]}>
        {showSafeArea && <SafeAreaView />}
        <View style={styles.titleWrapper}>
          <Animated.Text style={[styles.title, titleColorStyle]}>{title}</Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    zIndex: 1,
    overflow: 'hidden',
  },
  solidBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFF8E8", // Light solid color - change this to your preferred initial color
  },
  gradientContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  blurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iosBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  secondaryBlurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  secondaryBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  titleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  titleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: 'center',
    fontFamily: "Inter",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    // Color is now handled by titleColorStyle animation
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "transparent",
  },
});