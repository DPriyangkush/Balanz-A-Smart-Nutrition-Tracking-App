import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Overview from '../screens/overview';
import Details from '../screens/details';
import { BackButton } from '../components/BackButton';
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

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }} // Customize as needed
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={({ navigation }) => ({
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{ headerShown: false, animation: "reveal_from_bottom"} }
      />
      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{ headerShown: false, animation: "reveal_from_bottom"} }
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ headerShown: false, animation: "reveal_from_bottom"} }
      />
      <Stack.Screen
        name="VerifyOTPScreen"
        component={VerifyOTPScreen}
        options={{ headerShown: false, animation: "reveal_from_bottom"} }
      />
      <Stack.Screen
        name="PasswordCreationScreen"
        component={PasswordCreationScreen}
        options={{ headerShown: false, animation: "reveal_from_bottom"} }
      />
      <Stack.Screen
        name="PersonalInfoScreen"
        component={PersonalInfoScreen}
        options={{ headerShown: false, animation: "reveal_from_bottom"} }
      />
      <Stack.Screen
        name="GoalPreferenceScreen"
        component={GoalPreferenceScreen}
        options={{ headerShown: false, animation: "slide_from_right"} }
      />
      <Stack.Screen
        name="DietPreferenceScreen"
        component={DietPreferenceScreen}
        options={{ headerShown: false, animation: "slide_from_right"} }
      />
      <Stack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{ headerShown: false, animation: "reveal_from_bottom"} }
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
