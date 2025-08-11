import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const tabs = [
  { name: "Home", icon: "home" },
  { name: "Meal", icon: "rest" },
  { name: "AI", icon: "API" },
  { name: "Progress", icon: "linechart" },
  { name: "Profile", icon: "user" },
];

export default function BottomNav() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabWidth = width / tabs.length;
  const pillWidth = tabWidth - 20;

  // Shared value for pill animation
  const progress = useSharedValue(activeIndex);

  const pillStyle = useAnimatedStyle(() => {
    // More precise calculation for pill centering
    const translateX = interpolate(
      progress.value,
      tabs.map((_, i) => i), // [0, 1, 2, 3, 4]
      tabs.map((_, i) => i * tabWidth + (tabWidth - pillWidth) / 2) // Center each pill
    );

    // Distance from nearest integer (used for stretch)
    const fractionalPart = Math.abs(progress.value - Math.round(progress.value));

    // Width stretches when moving between tabs
    const animatedWidth = interpolate(
      fractionalPart,
      [0, 0.5, 1],
      [pillWidth, pillWidth + 30, pillWidth]
    );

    // Slight vertical squish
    const scaleY = interpolate(
      fractionalPart,
      [0, 0.5, 1],
      [1, 0.9, 1]
    );

    return {
      transform: [{ translateX }, { scaleY }],
      width: animatedWidth,
    };
  });

  const handlePress = (index) => {
    setActiveIndex(index);
    progress.value = withSpring(index, {
      damping: 15,
      stiffness: 150,
    });
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={70} tint="light" style={styles.blurContainer}>
        
        {/* Gooey Pill */}
        <Animated.View
          style={[
            styles.pill,
            pillStyle,
          ]}
        />

        {tabs.map((tab, index) => {
          const isActive = activeIndex === index;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => handlePress(index)}
            >
              <AntDesign
                name={tab.icon}
                size={24}
                color={isActive ? "#fff" : "#555"}
              />
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
  blurContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
    width: width,
    paddingVertical: 0,
    backgroundColor: "red",
    height: 80,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    zIndex: 1,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
    color: "#555",
    textAlign: "center",
  },
  activeLabel: {
    color: "#fff",
    fontWeight: "600",
  },
  pill: {
    position: "absolute",
    height: 50,
    backgroundColor: "#3C3F41",
    borderRadius: 25,
    top: 15, // (80 - 50) / 2 = 15 for perfect centering
    zIndex: 0,
  },
});