import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "../stores/authStore";

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
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Dashboard";

  const screenTitles = {
    Dashboard: "Dashboard",
    Meal: "Meal Plan",
    AI: "AI Assistant",
    Progress: "Progress",
    Profile: "Profile",
  };
  
  return (
    <View style={styles.appContainer}>
      <View style={styles.tabsWrapper}>
        <Tab.Navigator
          tabBar={(props) => <BottomNav {...props} />}
          screenOptions={{
            headerShown: false,
            unmountOnBlur: false,
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

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007BFF" />
  </View>
);

// Wrapper components with user ID
const createWrapperComponent = (Component) => (props) => {
  const { user } = useAuthStore();
  
  if (!user?.uid) {
    return <LoadingScreen />;
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
  const [appReady, setAppReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [initialSplashDone, setInitialSplashDone] = useState(false);
  
  const { 
    user, 
    isLoading, 
    isInitialized, 
    hasCompletedOnboarding,
    initializeAuthListener 
  } = useAuthStore();

  // Derive authentication status from user existence
  const isAuthenticated = !!user && !!user.uid;

  // Effect to handle authentication state changes
  useEffect(() => {
    // Once auth is initialized, hide splash for any auth state change
    if (isInitialized) {
      console.log('🔄 Auth initialized - hiding splash');
      setShowSplash(false);
    }
  }, [isInitialized]);

  useEffect(() => {
    let authUnsubscribe;
    
    const initializeApp = async () => {
      console.log('🚀 App starting...');
      
      try {
        // 🧹 TEMPORARY: Clear storage for testing (remove after testing!)
        // await AsyncStorage.multiRemove(['hasSeenOnboarding', 'auth-storage']);
        
        // Initialize auth listener
        authUnsubscribe = initializeAuthListener();
        
        // Check onboarding status
        const onboardingSeen = await AsyncStorage.getItem('hasSeenOnboarding');
        setHasSeenOnboarding(onboardingSeen === 'true');
        console.log('📱 Has seen onboarding:', onboardingSeen === 'true');
        
        // Show splash for minimum 2 seconds for initial load only
        setTimeout(() => {
          console.log('✅ Initial splash timer finished');
          setInitialSplashDone(true);
          // Don't hide splash here - let auth state handle it
        }, 2000);
        
        // Mark app as ready
        setAppReady(true);
        console.log('✅ App ready');
        
      } catch (error) {
        console.error('❌ App initialization error:', error);
        setHasSeenOnboarding(false);
        setShowSplash(false);
        setAppReady(true);
      }
    };

    initializeApp();

    return () => {
      if (authUnsubscribe) {
        authUnsubscribe();
      }
    };
  }, []);

  // Debug current state
  console.log('🔍 App State:', {
    appReady,
    showSplash,
    initialSplashDone,
    hasSeenOnboarding,
    isAuthenticated,
    isInitialized,
    isLoading,
    hasCompletedOnboarding,
    userExists: !!user
  });

  // Show splash screen only for initial app load
  if (!appReady || (showSplash && !isInitialized)) {
    console.log('🌟 Showing splash screen');
    return <SplashScreen />;
  }

  // Show loading only if auth is still loading AND we're not in an error state
  if (isLoading && isInitialized) {
    console.log('⏳ Showing loading screen');
    return <LoadingScreen />;
  }

  // Authenticated user
  if (isAuthenticated && user) {
    console.log('👤 Authenticated user detected');
    
    if (hasCompletedOnboarding) {
      console.log('✅ User has completed onboarding - showing main app');
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="MainTabs"
            component={AppTabs}
            options={{ headerShown: false }}
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
      console.log('📝 User needs profile onboarding');
      return (
        <Stack.Navigator 
          initialRouteName="PersonalInfoScreen"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoWrapper} />
          <Stack.Screen name="GoalPreferenceScreen" component={GoalPreferenceWrapper} />
          <Stack.Screen name="DietPreferenceScreen" component={DietPreferenceWrapper} />
        </Stack.Navigator>
      );
    }
  }

  // Unauthenticated user
  console.log('🚪 Unauthenticated user');
  
  if (!hasSeenOnboarding) {
    console.log('🎬 New user - showing onboarding');
    return (
      <Stack.Navigator 
        initialRouteName="Onboarding"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={Onboarding}
          options={{ animation: "fade" }} 
        />
        <Stack.Screen 
          name="AuthScreen" 
          component={AuthScreen}
          options={{ animation: "reveal_from_bottom" }} 
        />
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
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name="AuthScreen" 
        component={AuthScreen}
      />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} />
      <Stack.Screen name="PasswordCreationScreen" component={PasswordCreationScreen} />
      <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoWrapper} />
      <Stack.Screen name="GoalPreferenceScreen" component={GoalPreferenceWrapper} />
      <Stack.Screen name="DietPreferenceScreen" component={DietPreferenceWrapper} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  tabsWrapper: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default MainNavigator;