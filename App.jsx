import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, useColorScheme, StatusBar, LogBox, Text } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { enableLayoutAnimations } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView, Platform } from 'react-native';

// Enable optimizations - do this BEFORE any components import
enableScreens(); // Enable native screens for better performance

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

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontsError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const [appReady, setAppReady] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Auth store
  const { initializeAuthListener, isLoading: authLoading, isAuthenticated } = useAuthStore();

  // Custom dark theme
  const customDarkTheme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: '#121212',
        card: '#1E1E1E',
        border: '#2D2D2D',
        text: '#FFFFFF',
      },
    }),
    []
  );

  const customLightTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: '#FFFFFF',
        card: '#F5F5F5',
        border: '#E0E0E0',
        text: '#000000',
      },
    }),
    []
  );

  const theme = isDarkMode ? customDarkTheme : customLightTheme;

  // Initialize Firebase auth listener with timeout
  useEffect(() => {
    let unsubscribe = null;
    let timeoutId = null;

    const initAuth = async () => {
      try {
        unsubscribe = initializeAuthListener();
        setAuthInitialized(true);
      } catch (error) {
        console.warn('Auth initialization failed:', error);
        setAuthInitialized(true); // Still mark as initialized to prevent hanging
      }
    };

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      console.warn('Auth initialization timeout, proceeding anyway');
      setAuthInitialized(true);
    }, 5000); // 5 second timeout

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [initializeAuthListener]);

  // Set app ready when both fonts and auth are ready
  useEffect(() => {
    if ((fontsLoaded || fontsError) && authInitialized) {
      // Small delay to ensure everything is ready
      setTimeout(() => setAppReady(true), 200);
    }
  }, [fontsLoaded, fontsError, authInitialized]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn('Error hiding splash screen:', error);
      }
    }
  }, [appReady]);

  // Show loading text if fonts fail to load or taking too long
  if (fontsError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Font loading error. App will continue with default fonts.</Text>
      </View>
    );
  }

  // Show nothing while loading (splash screen is still visible)
  if (!appReady) {
    // Add a fallback in case splash screen doesn't show
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.colors.background 
      }}>
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </View>
    );
  }

  // Show skeleton while auth is loading
  if (authLoading && isAuthenticated === null) {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
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
      </KeyboardAvoidingView>
    );
  }

  // Main app with navigation
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={0}
    >
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
    </KeyboardAvoidingView>
  );
}