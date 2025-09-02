import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, InteractionManager, UIManager, Platform } from "react-native";
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "../stores/authStore";

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Import skeleton loaders
import { AuthScreenSkeleton, HomeScreenSkeleton, GenericSkeleton } from "../components/SkeletonLoader";

// Screens - Lazy load for better performance
const SplashScreen = React.lazy(() => import("../screens/SplashScreen"));
const Onboarding = React.lazy(() => import("../OnboardingScreen"));
const AuthScreen = React.lazy(() => import("../auth/AuthScreen"));
const ForgotPasswordScreen = React.lazy(() => import("../screens/ForgotPasswordScreen"));
const VerifyOTPScreen = React.lazy(() => import("../screens/VerifyOTPScreen"));
const PasswordCreationScreen = React.lazy(() => import("../screens/PasswordCreationScreen"));
const PersonalInfoScreen = React.lazy(() => import("../screens/PersonalInfoScreen"));
const GoalPreferenceScreen = React.lazy(() => import("../screens/GoalPreferenceScreen"));
const DietPreferenceScreen = React.lazy(() => import("../screens/DietPreferenceScreen"));
const DashboardScreen = React.lazy(() => import("../screens/DashboardScreen"));
const Overview = React.lazy(() => import("../screens/overview"));
const Details = React.lazy(() => import("../screens/details"));
const ProgressScreen = React.lazy(() => import("../screens/ProgressScreen"));
const ProfileScreen = React.lazy(() => import("../screens/ProfileScreen"));
const MealScreen = React.lazy(() => import("../screens/MealScreen"));
const AIScreen = React.lazy(() => import("../screens/AIScreen"));
const BreakfastScreen = React.lazy(() => import("screens/BreakfastScreen"));
const MealDetailsScreen = React.lazy(() => import("screens/MealDetailsScreen"));

// Components
import BottomNav from "../components/BottomNav";
import FrostedHeader from "../components/FrostedHeader";
import { BackButton } from "../components/BackButton";

// Create navigators with optimized configurations
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// PERFORMANCE OPTIMIZED TRANSITION CONFIGURATIONS
const ULTRA_SMOOTH_TRANSITION = {
  gestureEnabled: true,
  gestureResponseDistance: 35,
  gestureVelocityImpact: 0.2,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        useNativeDriver: true,
      },
    },
    close: {
      animation: 'spring',
      config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        useNativeDriver: true,
      },
    },
  },
};

const MODAL_SMOOTH_TRANSITION = {
  ...TransitionPresets.ModalPresentationIOS,
  gestureEnabled: true,
  cardOverlayEnabled: true,
  gestureResponseDistance: 400,
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        stiffness: 800,
        damping: 40,
        mass: 1,
        useNativeDriver: true,
      },
    },
    close: {
      animation: 'spring',
      config: {
        stiffness: 800,
        damping: 40,
        mass: 1,
        useNativeDriver: true,
      },
    },
  },
};

const INSTANT_TRANSITION = {
  cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
  transitionSpec: {
    open: { animation: 'timing', config: { duration: 0, useNativeDriver: true } },
    close: { animation: 'timing', config: { duration: 0, useNativeDriver: true } },
  },
};

// Optimized default screen options with native driver
const DEFAULT_STACK_OPTIONS = {
  headerShown: false,
  cardStyle: { backgroundColor: 'transparent' },
  presentation: 'card',
  animationEnabled: true,
  // Remove unnecessary properties that can cause performance issues
  detachPreviousScreen: false, // Keep previous screen in memory for smooth back navigation
  ...ULTRA_SMOOTH_TRANSITION,
};

const DEFAULT_TAB_OPTIONS = {
  headerShown: false,
  unmountOnBlur: false, // Keep tabs mounted for instant switching
  lazy: false, // Disable lazy loading for instant tab switches
  freezeOnBlur: false, // Don't freeze for better performance
  // Add performance optimizations
  tabBarHideOnKeyboard: Platform.OS === 'ios', // Only hide on iOS for better performance
};

// Pre-rendered components to avoid re-renders during navigation
// Replace your existing MealStackNavigator with this updated version:
const MealStackNavigator = React.memo(() => {
  const stackNavigator = useMemo(() => (
    <Stack.Navigator 
      screenOptions={{
        ...DEFAULT_STACK_OPTIONS,
        cardStyle: { backgroundColor: '#fff' },
        animationEnabled: true,
        gestureEnabled: true,
        headerShown: false,
      }}
      initialRouteName="MealMain"
      headerMode="none"
    >
      <Stack.Screen 
        name="MealMain" 
        component={MealScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 0, useNativeDriver: true } },
            close: { animation: 'timing', config: { duration: 0, useNativeDriver: true } },
          },
        }}
      />
      <Stack.Screen 
        name="Breakfast" 
        component={BreakfastScreen} 
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          presentation: 'card',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          gestureResponseDistance: 50,
          gestureVelocityImpact: 0.3,
          transitionSpec: {
            open: {
              animation: 'spring',
              config: {
                stiffness: 300,
                damping: 30,
                mass: 1,
                useNativeDriver: true,
              },
            },
            close: {
              animation: 'spring',
              config: {
                stiffness: 300,
                damping: 30,
                mass: 1,
                useNativeDriver: true,
              },
            },
          },
          cardStyle: { 
            backgroundColor: '#fff',
          },
        }}
      />
      {/* Add the MealDetailsScreen here */}
      <Stack.Screen 
        name="MealDetails" 
        component={MealDetailsScreen}
        options={{
          // Use a modal-like vertical transition for meal details
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          gestureResponseDistance: 200,
          gestureVelocityImpact: 0.3,
          transitionSpec: {
            open: {
              animation: 'spring',
              config: {
                stiffness: 200,
                damping: 35,
                mass: 1,
                useNativeDriver: true,
              },
            },
            close: {
              animation: 'spring',
              config: {
                stiffness: 200,
                damping: 35,
                mass: 1,
                useNativeDriver: true,
              },
            },
          },
          cardStyle: { 
            backgroundColor: '#fff',
          },
        }}
      />
    </Stack.Navigator>
  ), []);

  return stackNavigator;
});

MealStackNavigator.displayName = 'MealStackNavigator';

// Ultra-optimized AppTabs with performance enhancements
const AppTabs = React.memo(({ navigation, route }) => {
  // Pre-render bottom nav to avoid re-renders
  const bottomNavComponent = useCallback((props) => <BottomNav {...props} />, []);
  
  const tabNavigator = useMemo(() => (
    <Tab.Navigator
      tabBar={bottomNavComponent}
      screenOptions={{
        ...DEFAULT_TAB_OPTIONS,
        // Optimize tab bar performance
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
          backgroundColor: '#ffffff',
        },
      }}
      initialRouteName="Dashboard"
      // Performance optimizations
      sceneContainerStyle={{ backgroundColor: 'transparent' }}
      screenListeners={{
        // Optimize focus/blur events
        focus: (e) => {
          // Use InteractionManager for smooth transitions
          InteractionManager.runAfterInteractions(() => {
            // Any post-transition logic here
          });
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          ...DEFAULT_TAB_OPTIONS,
          unmountOnBlur: false, // Keep dashboard always mounted
          freezeOnBlur: false,
        }}
      />
      <Tab.Screen 
        name="Meal" 
        component={MealStackNavigator}
        options={{
          ...DEFAULT_TAB_OPTIONS,
          unmountOnBlur: false, // Keep meal stack mounted
        }}
      />
      <Tab.Screen 
        name="AI" 
        component={AIScreen}
        options={DEFAULT_TAB_OPTIONS}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={DEFAULT_TAB_OPTIONS}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={DEFAULT_TAB_OPTIONS}
      />
    </Tab.Navigator>
  ), [bottomNavComponent]);

  return (
    <View style={styles.appContainer}>
      <View style={styles.tabsWrapper}>
        {tabNavigator}
      </View>
    </View>
  );
});

AppTabs.displayName = 'AppTabs';

// Optimized LoadingScreen with reduced re-renders
const LoadingScreen = React.memo(({ context = "generic" }) => {
  const skeletonContent = useMemo(() => {
    switch (context) {
      case "auth":
        return <AuthScreenSkeleton />;
      case "dashboard":
        return <HomeScreenSkeleton />;
      case "onboarding":
        return (
          <GenericSkeleton>
            <View style={styles.onboardingSkeleton}>
              <View style={styles.skeletonHeader}>
                <View style={[styles.skeletonBox, { width: 200, height: 28 }]} />
                <View style={[styles.skeletonBox, { width: '80%', height: 16, marginTop: 12 }]} />
              </View>
              <View style={styles.skeletonForm}>
                <View style={[styles.skeletonBox, { width: '100%', height: 50, marginBottom: 20 }]} />
                <View style={[styles.skeletonBox, { width: '100%', height: 50, marginBottom: 20 }]} />
                <View style={[styles.skeletonBox, { width: '100%', height: 50, marginBottom: 30 }]} />
                <View style={[styles.skeletonBox, { width: '100%', height: 50 }]} />
              </View>
            </View>
          </GenericSkeleton>
        );
      default:
        return (
          <GenericSkeleton>
            <View style={styles.genericSkeleton}>
              <View style={[styles.skeletonBox, { width: '60%', height: 24, marginBottom: 20 }]} />
              <View style={[styles.skeletonBox, { width: '100%', height: 100, marginBottom: 20 }]} />
              <View style={[styles.skeletonBox, { width: '80%', height: 16, marginBottom: 12 }]} />
              <View style={[styles.skeletonBox, { width: '70%', height: 16, marginBottom: 12 }]} />
              <View style={[styles.skeletonBox, { width: '90%', height: 16 }]} />
            </View>
          </GenericSkeleton>
        );
    }
  }, [context]);

  return skeletonContent;
});

LoadingScreen.displayName = 'LoadingScreen';

// Performance-optimized wrapper components
const createWrapperComponent = (Component) => {
  return React.memo((props) => {
    const { user } = useAuthStore();
    
    // Memoize route params to prevent unnecessary re-renders
    const routeWithParams = useMemo(() => {
      if (!user?.uid) return props.route;
      
      return {
        ...props.route,
        params: {
          ...props.route?.params,
          userId: user.uid
        }
      };
    }, [props.route, user?.uid]);

    // Use InteractionManager for smoother loading
    const [isReady, setIsReady] = useState(!!user?.uid);

    useEffect(() => {
      if (user?.uid && !isReady) {
        InteractionManager.runAfterInteractions(() => {
          setIsReady(true);
        });
      }
    }, [user?.uid, isReady]);

    if (!user?.uid || !isReady) {
      return <LoadingScreen context="onboarding" />;
    }

    return <Component {...props} route={routeWithParams} />;
  });
};

// Properly created wrapper components outside of useMemo
const PersonalInfoWrapper = createWrapperComponent(PersonalInfoScreen);
const GoalPreferenceWrapper = createWrapperComponent(GoalPreferenceScreen);
const DietPreferenceWrapper = createWrapperComponent(DietPreferenceScreen);

// Main Navigator with ultra-performance optimizations
const MainNavigator = () => {
  // App states with performance considerations
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [appInitialized, setAppInitialized] = useState(false);
  
  // Track splash state - once hidden, never show again
  const [splashVisible, setSplashVisible] = useState(true);
  const splashHiddenPermanently = useRef(false);
  
  const { 
    user, 
    userProfile,
    isLoading, 
    isInitialized, 
    hasCompletedOnboarding,
    isProfileLoaded,
    initializeAuthListener 
  } = useAuthStore();

  const isAuthenticated = !!user && !!user.uid;

  // Optimized initialization with better performance
  const initializeApp = useCallback(async () => {
    console.log('🚀 Initializing app...');
    
    try {
      // Batch async operations
      const [onboardingSeen, authUnsubscribe] = await Promise.all([
        AsyncStorage.getItem('hasSeenOnboarding'),
        initializeAuthListener()
      ]);
      
      setHasSeenOnboarding(onboardingSeen === 'true');
      
      console.log('✅ App initialization complete');
      
      // Use requestAnimationFrame for smoother initialization
      requestAnimationFrame(() => {
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            setAppInitialized(true);
          }, 1000); // Reduced further for better performance
        });
      });

      return authUnsubscribe;
      
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      setHasSeenOnboarding(false);
      setAppInitialized(true);
      return null;
    }
  }, [initializeAuthListener]);

  // Initialize app ONCE on mount
  useEffect(() => {
    let authUnsubscribe;
    
    const init = async () => {
      authUnsubscribe = await initializeApp();
    };

    init();

    return () => {
      if (authUnsubscribe) authUnsubscribe();
    };
  }, [initializeApp]);

  // Optimized splash hiding with animation frame
  useEffect(() => {
    const authSetupComplete = isInitialized && (!isAuthenticated || isProfileLoaded);
    
    if (appInitialized && authSetupComplete && !splashHiddenPermanently.current) {
      console.log('🎬 Hiding splash screen permanently');
      
      requestAnimationFrame(() => {
        InteractionManager.runAfterInteractions(() => {
          setSplashVisible(false);
          splashHiddenPermanently.current = true;
        });
      });
    }
  }, [appInitialized, isInitialized, isAuthenticated, isProfileLoaded]);

  // Optimized failsafe timer
  useEffect(() => {
    const failsafeTimer = setTimeout(() => {
      if (!splashHiddenPermanently.current) {
        console.log('⚠️ Failsafe: Hiding splash after 6 seconds');
        requestAnimationFrame(() => {
          setSplashVisible(false);
          splashHiddenPermanently.current = true;
        });
      }
    }, 6000); // Reduced for better UX

    return () => clearTimeout(failsafeTimer);
  }, []);

  // Pre-rendered navigation stacks for maximum performance
  const authenticatedUserStack = useMemo(() => (
    <Stack.Navigator
      screenOptions={{
        ...DEFAULT_STACK_OPTIONS,
        detachPreviousScreen: false, // Keep previous screen for smooth back navigation
        cardOverlayEnabled: false,
      }}
      initialRouteName="MainTabs"
      headerMode="none"
    >
      <Stack.Screen
        name="MainTabs"
        component={AppTabs}
        options={INSTANT_TRANSITION}
      />
      
      <Stack.Screen
        name="Details"
        component={Details}
        options={({ navigation }) => ({
          header: () => (
            <FrostedHeader
              title="Details"
              navigation={navigation}
              showBack={true}
            />
          ),
          ...ULTRA_SMOOTH_TRANSITION,
        })}
      />
    </Stack.Navigator>
  ), []);

  const onboardingStack = useMemo(() => (
    <Stack.Navigator 
      initialRouteName="PersonalInfoScreen"
      screenOptions={DEFAULT_STACK_OPTIONS}
      headerMode="none"
    >
      <Stack.Screen 
        name="PersonalInfoScreen" 
        component={PersonalInfoWrapper}
        options={INSTANT_TRANSITION}
      />
      <Stack.Screen 
        name="GoalPreferenceScreen" 
        component={GoalPreferenceWrapper}
        options={ULTRA_SMOOTH_TRANSITION}
      />
      <Stack.Screen 
        name="DietPreferenceScreen" 
        component={DietPreferenceWrapper}
        options={ULTRA_SMOOTH_TRANSITION}
      />
    </Stack.Navigator>
  ), []);

  const newUserStack = useMemo(() => (
    <Stack.Navigator 
      initialRouteName="Onboarding"
      screenOptions={DEFAULT_STACK_OPTIONS}
      headerMode="none"
    >
      <Stack.Screen 
        name="Onboarding" 
        component={Onboarding}
        options={INSTANT_TRANSITION}
      />
      <Stack.Screen 
        name="AuthScreen" 
        component={AuthScreen} 
        options={MODAL_SMOOTH_TRANSITION}
      />
      <Stack.Screen 
        name="ForgotPasswordScreen" 
        component={ForgotPasswordScreen}
        options={ULTRA_SMOOTH_TRANSITION}
      />
      <Stack.Screen 
        name="VerifyOTPScreen" 
        component={VerifyOTPScreen}
        options={ULTRA_SMOOTH_TRANSITION}
      />
      <Stack.Screen 
        name="PasswordCreationScreen" 
        component={PasswordCreationScreen}
        options={ULTRA_SMOOTH_TRANSITION}
      />
      <Stack.Screen 
        name="PersonalInfoScreen" 
        component={PersonalInfoWrapper}
        options={ULTRA_SMOOTH_TRANSITION}
      />
      <Stack.Screen 
        name="GoalPreferenceScreen" 
        component={GoalPreferenceWrapper}
        options={ULTRA_SMOOTH_TRANSITION}
      />
      <Stack.Screen 
        name="DietPreferenceScreen" 
        component={DietPreferenceWrapper}
        options={ULTRA_SMOOTH_TRANSITION}
      />
    </Stack.Navigator>
  ), []);

  const returningUserStack = useMemo(() => (
    <Stack.Navigator 
      initialRouteName="AuthScreen"
      screenOptions={DEFAULT_STACK_OPTIONS}
      headerMode="none"
    >
      <Stack.Screen 
        name="AuthScreen" 
        component={AuthScreen}
        options={INSTANT_TRANSITION}
      />
      <Stack.Screen 
        name="ForgotPasswordScreen" 
        component={ForgotPasswordScreen} 
        options={MODAL_SMOOTH_TRANSITION}
      />
      <Stack.Screen 
        name="VerifyOTPScreen" 
        component={VerifyOTPScreen} 
        options={MODAL_SMOOTH_TRANSITION}
      />
      <Stack.Screen 
        name="PasswordCreationScreen" 
        component={PasswordCreationScreen} 
        options={MODAL_SMOOTH_TRANSITION}
      />
      <Stack.Screen 
        name="PersonalInfoScreen" 
        component={PersonalInfoWrapper}
        options={ULTRA_SMOOTH_TRANSITION}
      />
      <Stack.Screen 
        name="GoalPreferenceScreen" 
        component={GoalPreferenceWrapper}
        options={ULTRA_SMOOTH_TRANSITION}
      />
      <Stack.Screen 
        name="DietPreferenceScreen" 
        component={DietPreferenceWrapper}
        options={ULTRA_SMOOTH_TRANSITION}
      />
    </Stack.Navigator>
  ), []);

  console.log('🔍 App State:', {
    splashVisible,
    appInitialized,
    hasSeenOnboarding,
    isAuthenticated,
    isInitialized,
    isProfileLoaded,
    hasCompletedOnboarding,
    authSetupComplete: isInitialized && (!isAuthenticated || isProfileLoaded)
  });

  // Show splash ONLY if it hasn't been permanently hidden
  if (splashVisible && !splashHiddenPermanently.current) {
    console.log('🌟 Showing splash screen');
    return <SplashScreen />;
  }

  // Show skeleton loading if auth is not initialized OR if user is authenticated but profile not loaded
  if (!isInitialized || (isAuthenticated && !isProfileLoaded)) {
    const loadingContext = !isInitialized ? 'auth' : 'dashboard';
    const loadingReason = !isInitialized ? 'auth initialization' : 'profile loading';
    console.log(`⏳ Showing skeleton loading (${loadingReason})...`);
    return <LoadingScreen context={loadingContext} />;
  }

  // ========== AUTHENTICATED USER FLOWS ==========
  if (isAuthenticated) {
    console.log('👤 User authenticated, onboarding status:', hasCompletedOnboarding);
    
    if (hasCompletedOnboarding) {
      console.log('✅ Showing main app - user completed onboarding');
      return authenticatedUserStack;
    } else {
      console.log('📝 User needs onboarding - showing PersonalInfoScreen');
      return onboardingStack;
    }
  }

  // ========== UNAUTHENTICATED USER FLOWS ==========
  if (!hasSeenOnboarding) {
    console.log('🎬 New user - showing onboarding flow');
    return newUserStack;
  }

  console.log('🔄 Returning user - showing auth');
  return returningUserStack;
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabsWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  // Skeleton styles
  onboardingSkeleton: {
    flex: 1,
    paddingTop: 60,
  },
  skeletonHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  skeletonForm: {
    paddingHorizontal: 20,
  },
  genericSkeleton: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  skeletonBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});

export default MainNavigator;