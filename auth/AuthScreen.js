import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  ActivityIndicator,
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
  
  // Local loading state for UI feedback only - prevents black screen
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  // Zustand store - removed isLoading from destructuring to prevent global loading
  const {
    form,
    errors,
    error,
    updateForm,
    clearForm,
    clearError,
    signUp,
    signIn,
  } = useAuthStore();

  const switchTab = (tab) => {
    if (isLocalLoading) return; // Prevent tab switching during operations
    
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
    if (isLocalLoading) return; // Prevent double taps
    
    setIsLocalLoading(true);
    clearError();
    
    try {
      const result = await signUp();
      
      if (result.success) {
        console.log("✅ Signup Successful! Auth state will handle navigation...");
        // Don't navigate manually - let auth state change handle it automatically
        // The MainNavigator will detect the new authenticated user and show onboarding
      } else if (result.error) {
        Alert.alert('Sign Up Failed', result.error);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Sign Up Failed', 'An unexpected error occurred');
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleLogin = async () => {
    if (isLocalLoading) return; // Prevent double taps
    
    setIsLocalLoading(true);
    clearError();
    
    try {
      const result = await signIn();
      
      if (result.success) {
        console.log("✅ Login Successful! Auth state will handle navigation...");
        // Don't navigate manually - let auth state change handle it automatically
        // The MainNavigator will detect the authenticated user and show appropriate screen
      } else if (result.error) {
        Alert.alert('Login Failed', result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'An unexpected error occurred');
    } finally {
      setIsLocalLoading(false);
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
        editable={!isLocalLoading}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <PasswordInput
        value={form.password}
        onChangeText={(val) => updateForm('password', val)}
        placeholder="Enter your password"
        editable={!isLocalLoading}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TouchableOpacity 
        onPress={() => navigation.navigate("ForgotPasswordScreen")}
        disabled={isLocalLoading}
      >
        <Text style={[styles.forgotPassword, isLocalLoading && styles.disabledText]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      
      <FullWidthButton
        title={isLocalLoading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={isLocalLoading}
        loading={isLocalLoading}
        icon={isLocalLoading ? <ActivityIndicator size="small" color="#fff" /> : null}
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
        editable={!isLocalLoading}
      />
      {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

      <FullWidthInput 
        mb="$3"
        value={form.email}
        onChangeText={(val) => updateForm('email', val)}
        placeholder="Enter your email"
        hasError={!!errors.email}
        editable={!isLocalLoading}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <FullWidthInput 
        mb="$3"
        value={form.phone}
        onChangeText={(val) => updateForm('phone', val)}
        placeholder="Enter your phone"
        keyboardType="phone-pad"
        hasError={!!errors.phone}
        editable={!isLocalLoading}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      <PasswordInput
        value={form.password}
        onChangeText={(val) => updateForm('password', val)}
        placeholder="Enter your password"
        editable={!isLocalLoading}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <FullWidthButton
        title={isLocalLoading ? "Creating Account..." : "Sign Up"}
        onPress={handleSignUp}
        disabled={isLocalLoading}
        loading={isLocalLoading}
        icon={isLocalLoading ? <ActivityIndicator size="small" color="#fff" /> : null}
      />
    </>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          disabled={isLocalLoading}
        >
          <Entypo 
            name="chevron-left" 
            size={28} 
            color={isLocalLoading ? "#ccc" : "black"} 
          />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Welcome</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.globalErrorText}>{error}</Text>
          <TouchableOpacity 
            onPress={clearError}
            disabled={isLocalLoading}
          >
            <Text style={[styles.dismissError, isLocalLoading && styles.disabledText]}>
              Dismiss
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tabContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={styles.tab} 
            onPress={() => switchTab('login')}
            disabled={isLocalLoading}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'login' && styles.activeTab,
              isLocalLoading && styles.disabledText
            ]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tab} 
            onPress={() => switchTab('signup')}
            disabled={isLocalLoading}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'signup' && styles.activeTab,
              isLocalLoading && styles.disabledText
            ]}>
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
          disabled={isLocalLoading}
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
          disabled={isLocalLoading}
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
          disabled={isLocalLoading}
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
  disabledText: {
    opacity: 0.5,
  },
});