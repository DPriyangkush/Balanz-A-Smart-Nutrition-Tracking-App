// components/StretchyHeader.js - Enhanced with Back Button
import React from "react";
import { View, Text, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons'; // or your preferred icon library
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
  blurIntensity = 100,
  // New back button props
  showBackButton = false,
  onBackPress = null,
  backButtonColor = "#1e1e1e", // Default dark color
  backButtonSize = 24,
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

    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.15],
      [1, 1],
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

  const titleColorStyle = useAnimatedStyle(() => {
    const colorProgress = interpolate(
      scrollY.value,
      [0, headerHeight * 0.25],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    const red = interpolate(colorProgress, [0, 1], [30, 255], Extrapolate.CLAMP);
    const green = interpolate(colorProgress, [0, 1], [30, 255], Extrapolate.CLAMP);
    const blue = interpolate(colorProgress, [0, 1], [30, 255], Extrapolate.CLAMP);
    
    return {
      color: `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`,
    };
  });

  // Back button color animation - matches title color animation
  const backButtonColorStyle = useAnimatedStyle(() => {
    const colorProgress = interpolate(
      scrollY.value,
      [0, headerHeight * 0.25],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    const red = interpolate(colorProgress, [0, 1], [30, 255], Extrapolate.CLAMP);
    const green = interpolate(colorProgress, [0, 1], [30, 255], Extrapolate.CLAMP);
    const blue = interpolate(colorProgress, [0, 1], [30, 255], Extrapolate.CLAMP);
    
    return {
      color: `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`,
    };
  });

  const solidBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.2],
      [1, 0],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  const gradientStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.3],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  const blurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.9],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.4],
      [0, 0.15],
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
        <Animated.View style={[styles.solidBackground, solidBackgroundStyle]} />

        <Animated.View style={[styles.gradientContainer, gradientStyle]}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.headerGradient}
          />
        </Animated.View>
        
        <Animated.View style={[styles.blurContainer, blurStyle]}>
          <BlurView 
            intensity={blurIntensity}
            tint="systemMaterialDark"
            style={styles.iosBlur}
          />
        </Animated.View>

        <Animated.View style={[styles.secondaryBlurContainer, blurStyle]}>
          <BlurView 
            intensity={60}
            tint="systemUltraThinMaterialDark"
            style={styles.secondaryBlur}
          />
        </Animated.View>
        
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

      {/* Title and Back Button Overlay */}
      <Animated.View style={[styles.titleContainer, titleStyle]}>
        {showSafeArea && <SafeAreaView />}
        <View style={styles.titleWrapper}>
          {/* Back Button - positioned absolutely on the left */}
          {showBackButton && onBackPress && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={onBackPress}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Animated.View style={backButtonColorStyle}>
                <Ionicons 
                  name="chevron-back" 
                  size={backButtonSize} 
                  color={backButtonColor}
                />
              </Animated.View>
            </TouchableOpacity>
          )}
          
          {/* Title - centered */}
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
    backgroundColor: "#FFF8E8",
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
    width: '100%',
    flexDirection: 'row', // Enable horizontal layout
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 3,
    padding: 8, // Increased touch target
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle background
    backdropFilter: 'blur(10px)', // iOS-style backdrop blur effect
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
    flex: 1, // Take remaining space to stay centered
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "transparent",
  },
});