import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, useColorScheme, StatusBar, LogBox } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { enableLayoutAnimations } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Enable optimizations - do this BEFORE any components import
enableScreens(); // Enable native screens for better performance

// Conditionally enable layout animations (better for performance)
// enableLayoutAnimations(true); // Comment out or use conditionally

// Optional: Suppress specific warnings
LogBox.ignoreLogs([
  'Reanimated 2', // Reanimated warnings
  'Sending `onAnimatedValueUpdate`', // Common animation warning
]);

// Now import other components
import { TamaguiProvider } from 'tamagui';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import config from './tamagui.config';
import MainNavigator from './navigation/MainNavigator';
import useAuthStore from './stores/authStore';
import { AuthScreenSkeleton } from './components/SkeletonLoader';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const [appReady, setAppReady] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Auth store
  const { initializeAuthListener, isLoading: authLoading, isAuthenticated } = useAuthStore();

  // ✅ Custom dark theme that isn't pure black
  const customDarkTheme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: '#121212', // dark gray instead of pure black
        card: '#1E1E1E', // darker card background
        border: '#2D2D2D', // border color
        text: '#FFFFFF', // white text
      },
    }),
    []
  );

  const customLightTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: '#FFFFFF', // ensure white background
        card: '#F5F5F5', // light card background
        border: '#E0E0E0', // light border
        text: '#000000', // black text
      },
    }),
    []
  );

  const theme = isDarkMode ? customDarkTheme : customLightTheme;

  // Initialize Firebase auth listener
  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  }, [initializeAuthListener]);

  useEffect(() => {
    if (fontsLoaded) {
      // Small delay to ensure everything is ready
      setTimeout(() => setAppReady(true), 100);
    }
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    // Hide splash screen once fonts are loaded and app is ready
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  // Show nothing while fonts are loading (splash screen is still visible)
  if (!appReady) return null;

  // Show skeleton while auth is loading
  if (authLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.background,
          }}
          onLayout={onLayoutRootView}
        >
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          />
          <TamaguiProvider config={config}>
            <AuthScreenSkeleton />
          </TamaguiProvider>
        </View>
      </GestureHandlerRootView>
    );
  }

  // Main app with navigation
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
        onLayout={onLayoutRootView}
      >
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <TamaguiProvider config={config}>
          <NavigationContainer theme={theme}>
            <MainNavigator />
          </NavigationContainer>
        </TamaguiProvider>
      </View>
    </GestureHandlerRootView>
  );
}