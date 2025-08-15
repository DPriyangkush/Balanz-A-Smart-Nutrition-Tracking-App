import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, BackHandler, StatusBar, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationState, useNavigation } from "@react-navigation/native";

function FrostedHeader({ scrollY, showThreshold = 150 }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  // Don't render header at all initially when in dynamic mode
  const [shouldRender, setShouldRender] = React.useState(!scrollY);
  
  React.useEffect(() => {
    if (scrollY) {
      const listener = scrollY.addListener(({ value }) => {
        setShouldRender(value > 50); // Start rendering when scroll begins
      });
      return () => scrollY.removeListener(listener);
    }
  }, [scrollY]);

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

  // Default behavior based on whether scrollY is provided
  let headerTranslateY = scrollY ? -100 : 0; // Hidden by default if dynamic
  let headerOpacity = scrollY ? 0 : 1; // Transparent by default if dynamic

  if (scrollY) {
    // Animated values for header appearance
    headerTranslateY = scrollY.interpolate({
      inputRange: [0, showThreshold],
      outputRange: [-100, 0], // Slide down from top
      extrapolate: 'clamp',
    });

    headerOpacity = scrollY.interpolate({
      inputRange: [showThreshold - 20, showThreshold],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
  }

  // Don't render anything if in dynamic mode and shouldn't render yet
  if (scrollY && !shouldRender) {
    return (
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />
    );
  }

  const HeaderContainer = scrollY ? Animated.View : View;

  return (
    <>
      {/* Set status bar to transparent */}
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />
      
      <HeaderContainer 
        style={[
          styles.headerContainer,
          scrollY && {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          }
        ]}
      >
        {/* Single BlurView covering entire header including status bar */}
        <BlurView intensity={70} tint="light" style={styles.blurWrapper}>
          {/* Content area with proper padding for status bar */}
          <View style={[styles.contentContainer, { paddingTop: insets.top }]}>
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
          </View>
        </BlurView>
      </HeaderContainer>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1000,
  },
  blurWrapper: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
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
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
});

export default React.memo(FrostedHeader);