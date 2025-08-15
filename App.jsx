import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, useColorScheme, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import 'react-native-gesture-handler';

import { TamaguiProvider } from 'tamagui';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import config from './tamagui.config';
import MainNavigator from './navigation/MainNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const [appReady, setAppReady] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // ✅ Custom dark theme that isn't pure black
  const customDarkTheme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: '#121212', // dark gray instead of pure black
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
      },
    }),
    []
  );

  const theme = isDarkMode ? customDarkTheme : customLightTheme;

  useEffect(() => {
    if (fontsLoaded) {
      setAppReady(true);
    }
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) return null;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background, // ✅ Prevent system black background
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
  );
}
