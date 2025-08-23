// RecipeDetailTabs.js
import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

const RecipeDetailTabs = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef(null);
  const tabRefs = useRef([]);

  const pillLeft = useSharedValue(0);
  const pillWidth = useSharedValue(0);

  const tabs = ["Guidance", "Ingredients"];

  const updatePillPosition = (index) => {
    if (tabRefs.current[index] && containerRef.current) {
      tabRefs.current[index].measureLayout(
        containerRef.current,
        (left, top, width) => {
          pillLeft.value = withTiming(left, {
            duration: 300,
            easing: Easing.out(Easing.ease),
          });
          pillWidth.value = withTiming(width, {
            duration: 300,
            easing: Easing.out(Easing.ease),
          });
        },
        () => console.log("Measurement failed")
      );
    }
  };

  useEffect(() => {
    // Wait a tick for layout
    setTimeout(() => updatePillPosition(activeTab), 50);
  }, []);

  const handlePress = (index) => {
    setActiveTab(index);
    onTabChange && onTabChange(index);
    updatePillPosition(index);
  };

  const animatedPillStyle = useAnimatedStyle(() => {
    return {
      left: pillLeft.value,
      width: pillWidth.value,
    };
  });

  return (
    <View style={styles.wrapper}>
      <View ref={containerRef} style={styles.tabsContainer}>
        <Animated.View style={[styles.pill, animatedPillStyle]}>
          <LinearGradient
            colors={["#FF8A50", "#FF6B35"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </Animated.View>

        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            ref={(el) => (tabRefs.current[index] = el)}
            onPress={() => handlePress(index)}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginVertical: 15,
    marginHorizontal: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 25,
    padding: 4,
    position: "relative",
    overflow: "hidden",
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    flex: 1,
  },
  tabText: {
    color: "#666",
    fontWeight: "500",
    fontSize: 14,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "700",
  },
  pill: {
    position: "absolute",
    top: 4,
    bottom: 4,
    borderRadius: 20,
  },
  gradient: {
    flex: 1,
    borderRadius: 20,
  },
});

export default RecipeDetailTabs;