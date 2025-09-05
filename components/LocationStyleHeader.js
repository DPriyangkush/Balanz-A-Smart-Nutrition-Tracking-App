// components/LocationStyleHeader.js - Location App Style Header
import React from "react";
import { View, Text, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity, Image, Platform, StatusBar } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

// Get status bar height for proper positioning
const getStatusBarHeight = () => {
  if (Platform.OS === 'ios') {
    return 44; // Standard iOS status bar height
  }
  return StatusBar.currentHeight || 24; // Android status bar height
};

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = 140; // Increased to account for safe area

export default function LocationStyleHeader({
  title,
  children,
  headerHeight = HEADER_HEIGHT,
  showSafeArea = true,
  // Profile avatar props
  profileImage = null, // Can be a URL string or require() statement
  onProfilePress = null,
  profileSize = 32,
  // Notification props  
  onNotificationPress = null,
  notificationColor = "#333",
  notificationSize = 24,
  hasNotificationBadge = false,
  // Styling
  backgroundColor = "#ffffff",
  titleColor = "#333333",
  subtitleColor = "#666666",
  // New blur and gradient props like old StretchyHeader
  gradientColors = ['#FFF8E8', '#FFFFFF', '#F0F0F0'],
  blurIntensity = 100,
}) {
  const scrollY = useSharedValue(0);
  const statusBarHeight = getStatusBarHeight();

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

  // Header content scaling animation - similar to original StretchyHeader
  const headerContentStyle = useAnimatedStyle(() => {
    const minScale = 0.85; // Minimum scale when scrolled
    const maxScale = 1.0;   // Maximum scale at top
    
    const scale = interpolate(
      scrollY.value,
      [0, headerHeight * 0.6],
      [maxScale, minScale],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight * 0.6],
      [0, -8],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { scale },
        { translateY }
      ],
    };
  });

  // Helper function to convert hex to RGB (runs on JS thread)
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 51, g: 51, b: 51 }; // Default fallback
  };

  // Pre-calculate RGB values on JS thread
  const titleRgb = React.useMemo(() => hexToRgb(titleColor), [titleColor]);
  const subtitleRgb = React.useMemo(() => hexToRgb(subtitleColor), [subtitleColor]);

  // Text color animation - updated to use passed colors
  const textColorStyle = useAnimatedStyle(() => {
    const shouldAnimate = titleColor === "#333333"; // Default color
    
    if (!shouldAnimate) {
      return {
        color: titleColor, // Use the passed color directly
      };
    }
    
    // Original animation for default colors using pre-calculated RGB
    const colorProgress = interpolate(
      scrollY.value,
      [0, headerHeight * 0.25],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    const red = interpolate(colorProgress, [0, 1], [titleRgb.r, 255], Extrapolate.CLAMP);
    const green = interpolate(colorProgress, [0, 1], [titleRgb.g, 255], Extrapolate.CLAMP);
    const blue = interpolate(colorProgress, [0, 1], [titleRgb.b, 255], Extrapolate.CLAMP);
    
    return {
      color: `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`,
    };
  });

  // Subtitle color animation - updated to use passed colors
  const subtitleColorStyle = useAnimatedStyle(() => {
    const shouldAnimate = subtitleColor === "#666666"; // Default color
    
    if (!shouldAnimate) {
      return {
        color: subtitleColor, // Use the passed color directly
      };
    }
    
    // Original animation for default colors using pre-calculated RGB
    const colorProgress = interpolate(
      scrollY.value,
      [0, headerHeight * 0.25],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    const red = interpolate(colorProgress, [0, 1], [subtitleRgb.r, 255], Extrapolate.CLAMP);
    const green = interpolate(colorProgress, [0, 1], [subtitleRgb.g, 255], Extrapolate.CLAMP);
    const blue = interpolate(colorProgress, [0, 1], [subtitleRgb.b, 255], Extrapolate.CLAMP);
    
    return {
      color: `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`,
    };
  });

  // Solid background animation
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

  // Gradient background animation
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

  // Blur effect animation
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

  // Overlay animation
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

  const shadowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [0, 0.1],
      Extrapolate.CLAMP
    );

    return {
      shadowOpacity: opacity,
      elevation: opacity * 10,
    };
  });

  // Default profile image if none provided
  const defaultProfileImage = { uri: 'https://via.placeholder.com/32x32/007AFF/FFFFFF?text=U' };
  const profileImageSource = profileImage || defaultProfileImage;

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* Header Container with iOS-style Blur Effects */}
      <Animated.View style={[styles.headerContainer, headerStyle, shadowStyle]}>
        
        {/* Solid Background */}
        <Animated.View style={[styles.solidBackground, solidBackgroundStyle, { backgroundColor }]} />

        {/* Gradient Background */}
        <Animated.View style={[styles.gradientContainer, gradientStyle]}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.headerGradient}
          />
        </Animated.View>
        
        {/* Primary Blur Effect */}
        <Animated.View style={[styles.blurContainer, blurStyle]}>
          <BlurView 
            intensity={blurIntensity}
            tint="systemMaterialDark"
            style={styles.iosBlur}
          />
        </Animated.View>

        {/* Secondary Blur Effect */}
        <Animated.View style={[styles.secondaryBlurContainer, blurStyle]}>
          <BlurView 
            intensity={60}
            tint="systemUltraThinMaterialDark"
            style={styles.secondaryBlur}
          />
        </Animated.View>
        
        {/* Dark Overlay */}
        <Animated.View style={[styles.overlay, overlayStyle]} />
        
        {/* Status Bar Spacer */}
        <View style={[styles.statusBarSpacer, { height: statusBarHeight }]} />
        
        {/* Header Content */}
        <Animated.View style={[styles.headerContent, headerContentStyle]}>
          {/* Left Side - Profile Avatar */}
          <TouchableOpacity 
            style={styles.profileContainer}
            onPress={onProfilePress}
            activeOpacity={0.7}
            disabled={!onProfilePress}
          >
            <Image 
              source={profileImageSource}
              style={[styles.profileImage, { width: profileSize, height: profileSize }]}
              defaultSource={defaultProfileImage}
            />
          </TouchableOpacity>

          {/* Center - Location Info */}
          <View style={styles.locationContainer}>
            <Animated.Text style={[styles.locationLabel, subtitleColorStyle]}>Location</Animated.Text>
            <View style={styles.titleRow}>
              <Ionicons name="location" size={16} color="#FF6B6B" style={styles.locationIcon} />
              <Animated.Text style={[styles.locationTitle, textColorStyle]} numberOfLines={1}>
                {title}
              </Animated.Text>
              <View style={styles.chevronContainer}>
                <Ionicons name="chevron-down" size={16} color="#999" style={styles.chevronIcon} />
              </View>
            </View>
          </View>

          {/* Right Side - Notification Icon */}
          <TouchableOpacity 
            style={styles.notificationContainer}
            onPress={onNotificationPress}
            activeOpacity={0.7}
            disabled={!onNotificationPress}
          >
            <View style={styles.notificationIconContainer}>
              <Ionicons 
                name="notifications-outline" 
                size={notificationSize} 
                color={notificationColor}
              />
              {hasNotificationBadge && <View style={styles.notificationBadge} />}
            </View>
          </TouchableOpacity>
        </Animated.View>
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
        bounces={true}
      >
        {children}
      </Animated.ScrollView>
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
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 0, // Will be animated
    overflow: 'hidden',
  },
  solidBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  statusBarSpacer: {
    backgroundColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    minHeight: 60,
  },
  
  // Profile Section
  profileContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  profileImage: {
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  
  // Location/Title Section
  locationContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon: {
    marginRight: 4,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 180,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  chevronContainer: {
    marginLeft: 4,
  },
  chevronIcon: {
    // Icon styling handled by parent container
  },
  
  // Notification Section
  notificationContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  notificationIconContainer: {
    position: 'relative',
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "transparent",
    paddingBottom: 50, // Add bottom padding for better scroll experience
  },
});