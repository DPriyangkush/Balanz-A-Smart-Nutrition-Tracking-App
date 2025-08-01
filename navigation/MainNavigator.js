import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Overview from '../screens/overview';
import Details from '../screens/details';
import { BackButton } from '../components/BackButton';
import SplashScreen from '../screens/SplashScreen';
import Onboarding from 'OnboardingScreen';
import AuthScreen from 'auth/AuthScreen';

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
    </Stack.Navigator>
  );
};

export default MainNavigator;
