import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationState, useNavigation } from "@react-navigation/native";

function FrostedHeader() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  
  
  const activeTabName = useNavigationState((state) => {
    const tabState = state.routes[state.index]?.state;
    return tabState
      ? tabState.routes[tabState.index]?.name
      : state.routes[state.index]?.name;
  });
  
  const title = useMemo(() => {
    const titles = {
      Dashboard: "Home",
      Meal: "Meal Plan",
      AI: "AI Assistant",
      Progress: "Progress",
      Profile: "Profile",
    };
    return titles[activeTabName] || activeTabName || "App";
  }, [activeTabName]);
  
  const handleBackPress = () => {
    if (activeTabName !== "Dashboard") {
      navigation.navigate("App", { screen: "Dashboard" });
    } else {
      if (Platform.OS === "android") {
        BackHandler.exitApp();
      } else {
        navigation.goBack();
      }
    }
  };
  
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 6 }]}>
      <BlurView intensity={70} tint="light" style={styles.blurWrapper}>
        {navigation.canGoBack() && (
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute', // Make header float above content
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "transparent", // Remove red background
    zIndex: 1000, // Ensure header stays on top
  },
  blurWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  backButton: {
    padding: 6,
    zIndex: 2,
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
  },
});

export default React.memo(FrostedHeader);