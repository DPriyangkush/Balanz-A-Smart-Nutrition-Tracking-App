import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "../stores/authStore";

// Import skeleton loaders
import { AuthScreenSkeleton, HomeScreenSkeleton, GenericSkeleton } from "../components/SkeletonLoader";

// Screens
import SplashScreen from "../screens/SplashScreen";
import Onboarding from "../OnboardingScreen";
import AuthScreen from "../auth/AuthScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyOTPScreen from "../screens/VerifyOTPScreen";
import PasswordCreationScreen from "../screens/PasswordCreationScreen";
import PersonalInfoScreen from "../screens/PersonalInfoScreen";
import GoalPreferenceScreen from "../screens/GoalPreferenceScreen";
import DietPreferenceScreen from "../screens/DietPreferenceScreen";
import DashboardScreen from "../screens/DashboardScreen";
import Overview from "../screens/overview";
import Details from "../screens/details";
import ProgressScreen from "../screens/ProgressScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MealScreen from "../screens/MealScreen";
import AIScreen from "../screens/AIScreen";

// Components
import BottomNav from "../components/BottomNav";
import FrostedHeader from "../components/FrostedHeader";
import { BackButton } from "../components/BackButton";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs = ({ navigation, route }) => {
  return (
    <View style={styles.appContainer}>
      <View style={styles.tabsWrapper}>
        <Tab.Navigator
          tabBar={(props) => <BottomNav {...props} />}
          screenOptions={{
            headerShown: false,
            unmountOnBlur: false,
            lazy: true,
            lazyPreloadDistance: 0,
          }}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Meal" component={MealScreen} />
          <Tab.Screen name="AI" component={AIScreen} />
          <Tab.Screen name="Progress" component={ProgressScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </View>
    </View>
  );
};

// Replace LoadingScreen with contextual skeleton loaders
const LoadingScreen = ({ context = "generic" }) => {
  switch (context) {
    case "auth":
      return <AuthScreenSkeleton />;
    case "dashboard":
      return <HomeScreenSkeleton />;
    case "onboarding":
      return (
        <GenericSkeleton>
          <View style={styles.onboardingSkeleton}>
            {/* Header skeleton */}
            <View style={styles.skeletonHeader}>
              <View style={[styles.skeletonBox, { width: 200, height: 28 }]} />
              <View style={[styles.skeletonBox, { width: '80%', height: 16, marginTop: 12 }]} />
            </View>
            
            {/* Form fields skeleton */}
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
};

// Wrapper components with user ID
const createWrapperComponent = (Component) => (props) => {
  const { user } = useAuthStore();
  
  if (!user?.uid) {
    return <LoadingScreen context="onboarding" />;
  }

  const routeWithParams = {
    ...props.route,
    params: {
      ...props.route?.params,
      userId: user.uid
    }
  };

  return <Component {...props} route={routeWithParams} />;
};

const PersonalInfoWrapper = createWrapperComponent(PersonalInfoScreen);
const GoalPreferenceWrapper = createWrapperComponent(GoalPreferenceScreen);
const DietPreferenceWrapper = createWrapperComponent(DietPreferenceScreen);

const MainNavigator = () => {
  // App states
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
    isProfileLoaded, // New flag from store
    initializeAuthListener 
  } = useAuthStore();

  const isAuthenticated = !!user && !!user.uid;

  // Initialize app ONCE on mount
  useEffect(() => {
    let authUnsubscribe;
    
    const initializeApp = async () => {
      console.log('🚀 Initializing app...');
      
      try {
        // Check if user has seen onboarding
        const onboardingSeen = await AsyncStorage.getItem('hasSeenOnboarding');
        setHasSeenOnboarding(onboardingSeen === 'true');
        
        // Initialize Firebase auth listener
        authUnsubscribe = initializeAuthListener();
        
        console.log('✅ App initialization complete');
        
        // Wait for auth to initialize, then hide splash
        setTimeout(() => {
          setAppInitialized(true);
        }, 2000);
        
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        setHasSeenOnboarding(false);
        setAppInitialized(true);
      }
    };

    initializeApp();

    return () => {
      if (authUnsubscribe) authUnsubscribe();
    };
  }, []);

  // Hide splash when app is ready AND auth is fully initialized
  useEffect(() => {
    // For authenticated users: wait for profile to be loaded
    // For non-authenticated users: just wait for auth to be initialized
    const authSetupComplete = isInitialized && (!isAuthenticated || isProfileLoaded);
    
    if (appInitialized && authSetupComplete && !splashHiddenPermanently.current) {
      console.log('🎬 Hiding splash screen permanently');
      setSplashVisible(false);
      splashHiddenPermanently.current = true;
    }
  }, [appInitialized, isInitialized, isAuthenticated, isProfileLoaded]);

  // Force hide splash if it's been more than 10 seconds (failsafe)
  useEffect(() => {
    const failsafeTimer = setTimeout(() => {
      if (!splashHiddenPermanently.current) {
        console.log('⚠️ Failsafe: Hiding splash after 10 seconds');
        setSplashVisible(false);
        splashHiddenPermanently.current = true;
      }
    }, 10000);

    return () => clearTimeout(failsafeTimer);
  }, []);

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
      return (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#fff' },
            presentation: 'card',
            animationEnabled: true,
            animationTypeForReplace: 'reveal_from_bottom',
            gestureEnabled: true,
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={AppTabs}
            options={{ 
              headerShown: false,
              animationEnabled: false,
              animation: "reveal_from_bottom"
            }}
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
              gestureEnabled: true,
              animation: "slide_from_right",
            })}
          />
        </Stack.Navigator>
      );
    } else {
      console.log('📝 User needs onboarding - showing PersonalInfoScreen');
      return (
        <Stack.Navigator 
          initialRouteName="PersonalInfoScreen"
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: '#fff' },
            animationEnabled: true,
            animationTypeForReplace: 'push',
          }}
        >
          <Stack.Screen 
            name="PersonalInfoScreen" 
            component={PersonalInfoWrapper}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen name="GoalPreferenceScreen" component={GoalPreferenceWrapper} />
          <Stack.Screen name="DietPreferenceScreen" component={DietPreferenceWrapper} />
        </Stack.Navigator>
      );
    }
  }

  // ========== UNAUTHENTICATED USER FLOWS ==========
  if (!hasSeenOnboarding) {
    console.log('🎬 New user - showing onboarding flow');
    return (
      <Stack.Navigator 
        initialRouteName="Onboarding"
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' },
          animationEnabled: true,
          animationTypeForReplace: 'slide_from_bottom',
        }}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={Onboarding}
          options={{ animationEnabled: false }}
        />
        <Stack.Screen name="AuthScreen" component={AuthScreen} options={{animation: "slide_from_bottom"}} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} />
        <Stack.Screen name="PasswordCreationScreen" component={PasswordCreationScreen} />
        <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoWrapper} />
        <Stack.Screen name="GoalPreferenceScreen" component={GoalPreferenceWrapper} />
        <Stack.Screen name="DietPreferenceScreen" component={DietPreferenceWrapper} />
      </Stack.Navigator>
    );
  }

  console.log('🔄 Returning user - showing auth');
  return (
    <Stack.Navigator 
      initialRouteName="AuthScreen"
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
        animationEnabled: true,
        animationTypeForReplace: 'push',
      }}
    >
      <Stack.Screen 
        name="AuthScreen" 
        component={AuthScreen}
        options={{ animationEnabled: false, animation: "reveal_from_bottom" } }
      />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{animation: "slide_from_bottom"}} />
      <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} options={{animation: "slide_from_bottom"}} />
      <Stack.Screen name="PasswordCreationScreen" component={PasswordCreationScreen} options={{animation: "slide_from_bottom"}} />
      <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoWrapper} />
      <Stack.Screen name="GoalPreferenceScreen" component={GoalPreferenceWrapper} />
      <Stack.Screen name="DietPreferenceScreen" component={DietPreferenceWrapper} />
    </Stack.Navigator>
  );
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