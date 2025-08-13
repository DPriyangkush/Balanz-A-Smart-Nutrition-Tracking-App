import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BackButton } from '../components/BackButton';

// Screens
import SplashScreen from '../screens/SplashScreen';
import Onboarding from 'OnboardingScreen';
import AuthScreen from 'auth/AuthScreen';
import ForgotPasswordScreen from 'screens/ForgotPasswordScreen';
import VerifyOTPScreen from 'screens/VerifyOTPScreen';
import PasswordCreationScreen from 'screens/PasswordCreationScreen';
import PersonalInfoScreen from 'screens/PersonalInfoScreen';
import GoalPreferenceScreen from 'screens/GoalPreferenceScreen';
import DietPreferenceScreen from 'screens/DietPreferenceScreen';
import DashboardScreen from 'screens/DashboardScreen';
import Overview from '../screens/overview';
import Details from '../screens/details';
import ProgressScreen from 'screens/ProgressScreen';  
import ProfileScreen from 'screens/ProfileScreen';

// Add your missing screens here
import MealScreen from 'screens/MealScreen'; // Create this screen if it doesn't exist
import AIScreen from 'screens/AIScreen'; // Create this screen if it doesn't exist

// Components
import BottomNav from '../components/BottomNav';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main App Tabs (screens that should show bottom nav)
const AppTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNav {...props} />} // Pass all tab navigator props
      screenOptions={{ 
        headerShown: false,
        unmountOnBlur: false
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
      />
      <Tab.Screen 
        name="Meal" 
        component={MealScreen}
      />
      <Tab.Screen 
        name="AI" 
        component={AIScreen}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      {/* Auth/Onboarding Screens (no bottom nav) */}
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{ 
          headerShown: false, 
          animation: "reveal_from_bottom" 
        }}
      />
      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{ 
          headerShown: false, 
          animation: "reveal_from_bottom" 
        }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ 
          headerShown: false, 
          animation: "reveal_from_bottom" 
        }}
      />
      <Stack.Screen
        name="VerifyOTPScreen"
        component={VerifyOTPScreen}
        options={{ 
          headerShown: false, 
          animation: "reveal_from_bottom" 
        }}
      />
      <Stack.Screen
        name="PasswordCreationScreen"
        component={PasswordCreationScreen}
        options={{ 
          headerShown: false, 
          animation: "reveal_from_bottom" 
        }}
      />
      <Stack.Screen
        name="PersonalInfoScreen"
        component={PersonalInfoScreen}
        options={{ 
          headerShown: false, 
          animation: "reveal_from_bottom" 
        }}
      />
      <Stack.Screen
        name="GoalPreferenceScreen"
        component={GoalPreferenceScreen}
        options={{ 
          headerShown: false, 
          animation: "slide_from_right" 
        }}
      />
      <Stack.Screen
        name="DietPreferenceScreen"
        component={DietPreferenceScreen}
        options={{ 
          headerShown: false, 
          animation: "slide_from_right" 
        }}
      />

      {/* Main App (with bottom nav) */}
      <Stack.Screen
        name="App"
        component={AppTabs}
        options={{ 
          headerShown: false,
          animation: "fade" // Smooth transition to main app
        }}
      />

      {/* Modal/Detail Screens (no bottom nav) */}
      <Stack.Screen
        name="Details"
        component={Details}
        options={({ navigation }) => ({
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          gestureEnabled: true,
          animation: "slide_from_right"
        })}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;