import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

// Calculate dimensions based on screen size
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const maxWidth = Math.min(screenWidth - 32, 500);
const isSmallScreen = screenWidth < 375; // iPhone SE size threshold

// Import your local images (adjust paths as needed)
const HomeIcon = require('../assets/Home.png');
const MealIcon = require('../assets/Meal.png');
const AIIcon = require('../assets/AI.png');
const ProgressIcon = require('../assets/Progress.png');
const ProfileIcon = require('../assets/User.png');

const BottomNav = ({ state, descriptors, navigation }) => {
  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef(null);
  const tabRefs = useRef([]);
  
  const pillLeft = useSharedValue(0);
  const pillWidth = useSharedValue(isSmallScreen ? 70 : 80);
  const labelScale = useSharedValue(0);

  const navItems = [
    { name: 'Home', screenName: 'Dashboard', icon: HomeIcon },
    { name: 'Meal', screenName: 'Meal', icon: MealIcon },
    { name: 'AI', screenName: 'AI', icon: AIIcon },
    { name: 'Progress', screenName: 'Progress', icon: ProgressIcon },
    { name: 'Profile', screenName: 'Profile', icon: ProfileIcon }
  ];

  const updatePillPosition = (index, stretch = false) => {
    if (tabRefs.current[index] && containerRef.current) {
      tabRefs.current[index].measureLayout(
        containerRef.current,
        (left, top, width, height) => {
          const pillW = stretch ? (isSmallScreen ? 120 : 140) : (isSmallScreen ? 70 : 90);
          const newLeft = left + (width - pillW) / 2;
          
          pillLeft.value = withTiming(newLeft, {
            duration: 300,
            easing: Easing.out(Easing.ease),
          });
          pillWidth.value = withTiming(pillW, {
            duration: 300,
            easing: Easing.out(Easing.ease),
          });
        },
        () => console.log('measurement failed')
      );
    }
  };

  // Update activeTab and animate pill when navigation state changes
  useEffect(() => {
    if (state && state.index !== activeTab) {
      setActiveTab(state.index);
      
      // Animate pill to new position
      setTimeout(() => {
        updatePillPosition(state.index, true);
        
        labelScale.value = withTiming(1.15, {
          duration: 150,
          easing: Easing.out(Easing.ease),
        });
        
        setTimeout(() => {
          updatePillPosition(state.index, false);
        }, 150);
      }, 50);
    }
  }, [state?.index]);

  // Initial pill position setup
  useEffect(() => {
    const timer = setTimeout(() => {
      updatePillPosition(activeTab);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTabPress = (index) => {
    if (index === activeTab) return;
    
    // Use the tab navigation instead of general navigation
    const route = state.routes[index];
    const isFocused = state.index === index;

    if (!isFocused) {
      navigation.navigate(route.name);
    }
  };

  const animatedPillStyle = useAnimatedStyle(() => {
    return {
      left: pillLeft.value,
      width: pillWidth.value,
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: labelScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <BlurView intensity={90} tint="light" style={styles.blurContainer}>
        <View 
          ref={containerRef}
          style={styles.navContainer}
          onLayout={() => updatePillPosition(activeTab)}
        >
          <Animated.View style={[styles.pill, animatedPillStyle]}>
            <LinearGradient
              colors={['#e0e0e0ff','#515151ff', '#111111ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}
            >
              <View style={styles.tubelightGlow} />
            </LinearGradient>
          </Animated.View>
          
          {navItems.map((item, index) => (
            <TouchableOpacity
              key={item.name}
              ref={(el) => (tabRefs.current[index] = el)}
              onPress={() => handleTabPress(index)}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Image 
                source={item.icon} 
                style={[
                  styles.icon,
                  activeTab === index && styles.activeIcon
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      </BlurView>

      <View style={styles.labelsContainer}>
        {navItems.map((item, index) => (
          <View key={`label-${index}`} style={styles.labelWrapper}>
            <Animated.Text style={[
              styles.labelText,
              activeTab === index && styles.activeLabelText,
              activeTab === index && animatedLabelStyle
            ]}>
              {item.name}
            </Animated.Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: isSmallScreen ? 16 : 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
    paddingHorizontal: isSmallScreen ? 8 : 12,
  },
  blurContainer: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 30,
    overflow: 'hidden',
    height: isSmallScreen ? 56 : 60,
    backgroundColor: "green",
    alignItems: 'center',
    
  },
  navContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.2)',
    borderRadius: 20,
    paddingVertical: isSmallScreen ? 14 : 18,
    paddingHorizontal: isSmallScreen ? 6 : 8,
    overflow: 'hidden',
    position: 'relative',
  },
  pill: {
    position: 'absolute',
    height: isSmallScreen ? 50 : 54,
    borderRadius: 30,
    top: '50%',
    transform: [{ translateY: isSmallScreen ? -12 : -10 }],
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 4,
  },
  gradient: {
    flex: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tubelightGlow: {
    position: 'absolute',
    top: -1,
    width: 28,
    height: 2,
    backgroundColor: '#000000ff',
    borderRadius: 1,
    shadowColor: '#60a5fa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 2,
  },
  icon: {
    width: isSmallScreen ? 22 : 24,
    height: isSmallScreen ? 22 : 24,
    tintColor: '#1e1e1e',
  },
  activeIcon: {
    tintColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  labelsContainer: {
    width: '100%',
    maxWidth: 500,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
    paddingHorizontal: isSmallScreen ? 6 : 8,
  },
  labelWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  labelText: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: '400',
    color: '#1e1e1e',
    textAlign: 'center',
    display: "none"
  },
  activeLabelText: {
    fontWeight: '600',
    color: '#1b4a0fff',
  },
});

export default BottomNav;