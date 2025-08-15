import React from "react";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

// Screens
import SplashScreen from "../screens/SplashScreen";
import Onboarding from "OnboardingScreen";
import AuthScreen from "auth/AuthScreen";
import ForgotPasswordScreen from "screens/ForgotPasswordScreen";
import VerifyOTPScreen from "screens/VerifyOTPScreen";
import PasswordCreationScreen from "screens/PasswordCreationScreen";
import PersonalInfoScreen from "screens/PersonalInfoScreen";
import GoalPreferenceScreen from "screens/GoalPreferenceScreen";
import DietPreferenceScreen from "screens/DietPreferenceScreen";
import DashboardScreen from "screens/DashboardScreen";
import Overview from "../screens/overview";
import Details from "../screens/details";
import ProgressScreen from "screens/ProgressScreen";
import ProfileScreen from "screens/ProfileScreen";
import MealScreen from "screens/MealScreen";
import AIScreen from "screens/AIScreen";

// Components
import BottomNav from "../components/BottomNav";
import FrostedHeader from "../components/FrostedHeader";
import { BackButton } from "../components/BackButton";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab navigator with fixed frosted header
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
      {/* Frosted glass header */}
      {/**<FrostedHeader
        title={screenTitles[routeName]}
        navigation={navigation}
        showBack={false}
      />*/}

      {/* Tabs */}
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

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      {/* Auth / Onboarding Screens */}
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{ headerShown: false, animation: "reveal_from_bottom" }}
      />
      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{ headerShown: false, animation: "reveal_from_bottom" }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ headerShown: false, animation: "reveal_from_bottom" }}
      />
      <Stack.Screen
        name="VerifyOTPScreen"
        component={VerifyOTPScreen}
        options={{ headerShown: false, animation: "reveal_from_bottom" }}
      />
      <Stack.Screen
        name="PasswordCreationScreen"
        component={PasswordCreationScreen}
        options={{ headerShown: false, animation: "reveal_from_bottom" }}
      />
      <Stack.Screen
        name="PersonalInfoScreen"
        component={PersonalInfoScreen}
        options={{ headerShown: false, animation: "reveal_from_bottom" }}
      />
      <Stack.Screen
        name="GoalPreferenceScreen"
        component={GoalPreferenceScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="DietPreferenceScreen"
        component={DietPreferenceScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />

      {/* Main app */}
      <Stack.Screen
        name="App"
        component={AppTabs}
        options={{ headerShown: false, animation: "fade" }}
      />

      {/* Modal / detail screens */}
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
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  tabsWrapper: {
    flex: 1,
    marginTop: 0, // height of the frosted header
  },
});

export default MainNavigator;
