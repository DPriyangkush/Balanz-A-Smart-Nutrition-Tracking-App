import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import FullWidthButton from 'components/FullWidthButton';
import FullWidthInput from 'components/FullWidthInput';
import PasswordInput from 'components/PasswordInput';
import { YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../stores/authStore';

const AuthScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('login');
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Zustand store
  const {
    form,
    errors,
    isLoading,
    error,
    updateForm,
    clearForm,
    clearError,
    signUp,
    signIn,
  } = useAuthStore();

  const switchTab = (tab) => {
    setActiveTab(tab);
    Animated.timing(slideAnim, {
      toValue: tab === 'login' ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
    clearForm();
    clearError();
  };

  const handleSignUp = async () => {
    const result = await signUp();
    if (result.success) {
      // Navigate to onboarding for new users
      navigation.navigate('PersonalInfoScreen', { userId: result.userId });
      console.log("Signup Successful! Starting onboarding...");
    } else if (result.error) {
      Alert.alert('Sign Up Failed', result.error);
    }
  };

  const handleLogin = async () => {
    const result = await signIn();
    if (result.success) {
      console.log("Login Successful!", result.user.uid);
      // Navigation will be handled by MainNavigator based on onboarding status
    } else if (result.error) {
      Alert.alert('Login Failed', result.error);
    }
  };

  const renderLoginForm = () => (
    <>
      <FullWidthInput 
        mb="$3"
        value={form.email}
        onChangeText={(val) => updateForm('email', val)}
        placeholder="Enter your email"
        hasError={!!errors.email}
        editable={!isLoading}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <PasswordInput
        value={form.password}
        onChangeText={(val) => updateForm('password', val)}
        placeholder="Enter your password"
        editable={!isLoading}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TouchableOpacity 
        onPress={() => navigation.navigate("ForgotPasswordScreen")}
        disabled={isLoading}
      >
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <FullWidthButton 
        title={isLoading ? "Logging in..." : "Login"} 
        onPress={handleLogin}
        disabled={isLoading}
      />
    </>
  );

  const renderSignUpForm = () => (
    <>
      <FullWidthInput 
        mb="$3"
        value={form.fullName}
        onChangeText={(val) => updateForm('fullName', val)}
        placeholder="Enter your name"
        hasError={!!errors.fullName}
        editable={!isLoading}
      />
      {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

      <FullWidthInput 
        mb="$3"
        value={form.email}
        onChangeText={(val) => updateForm('email', val)}
        placeholder="Enter your email"
        hasError={!!errors.email}
        editable={!isLoading}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <FullWidthInput 
        mb="$3"
        value={form.phone}
        onChangeText={(val) => updateForm('phone', val)}
        placeholder="Enter your phone"
        keyboardType="phone-pad"
        hasError={!!errors.phone}
        editable={!isLoading}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      <PasswordInput
        value={form.password}
        onChangeText={(val) => updateForm('password', val)}
        placeholder="Enter your password"
        editable={!isLoading}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <FullWidthButton 
        title={isLoading ? "Creating Account..." : "Sign Up"} 
        onPress={handleSignUp}
        disabled={isLoading}
      />
    </>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Entypo name="chevron-left" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Welcome</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.globalErrorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.dismissError}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tabContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={styles.tab} 
            onPress={() => switchTab('login')}
            disabled={isLoading}
          >
            <Text style={[styles.tabText, activeTab === 'login' && styles.activeTab]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tab} 
            onPress={() => switchTab('signup')}
            disabled={isLoading}
          >
            <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTab]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            styles.animatedUnderline,
            {
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 200],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {activeTab === 'login' ? renderLoginForm() : renderSignUpForm()}

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

      <YStack mb="$3">
        <FullWidthButton
          title="Continue with Google"
          onPress={() => console.log('Google')}
          color="#fff"
          textColor="#000"
          icon={<AntDesign name="google" size={20} color="black" />}
          bordered
          disabled={isLoading}
        />
      </YStack>

      <YStack mb="$3">
        <FullWidthButton
          title="Continue with Apple"
          onPress={() => console.log('Apple')}
          color="#fff"
          textColor="#000"
          icon={<AntDesign name="apple1" size={20} color="black" />}
          bordered
          disabled={isLoading}
        />
      </YStack>

      <YStack mb="$3">
        <FullWidthButton
          title="Continue with OTP"
          onPress={() => console.log('OTP')}
          color="#fff"
          textColor="#000"
          icon={<FontAwesome name="mobile-phone" size={22} color="black" />}
          bordered
          disabled={isLoading}
        />
      </YStack>

      <Text style={styles.termsText}>
        By continuing, you agree to our{' '}
        <Text style={styles.link}>Terms of Service</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </ScrollView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 50,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 30,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'inter',
    flex: 1,
    textAlign: 'center',
    marginRight: 34,
  },
  tabContainer: {
    marginBottom: 30,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tab: {
    width: 140,
    alignItems: 'center',
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 18,
    color: '#888',
    fontFamily: 'inter',
    fontWeight: '600',
  },
  activeTab: {
    color: '#000',
  },
  animatedUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    width: 140,
    backgroundColor: '#000',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: 20,
    color: '#1e1e1e',
    marginBottom: 20,
    fontSize: 13,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    color: '#666',
  },
  termsText: {
    textAlign: 'center',
    alignSelf: 'center',
    width: '50%',
    fontSize: 12,
    color: '#777',
    marginTop: 15,
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 26,
    marginBottom: 8,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  globalErrorText: {
    color: '#c62828',
    fontSize: 14,
    flex: 1,
  },
  dismissError: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '600',
  },
});