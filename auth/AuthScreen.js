import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import FullWidthInput from 'components/FullWidthInput';
import PasswordInput from 'components/PasswordInput';
import FullWidthButton from 'components/FullWidthButton';
import { YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';

const AuthScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('login');
  const slideAnim = useRef(new Animated.Value(0)).current;

  const switchTab = (tab) => {
    setActiveTab(tab);
    Animated.timing(slideAnim, {
      toValue: tab === 'login' ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const renderLoginForm = () => (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email or Phone</Text>
        <FullWidthInput />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <PasswordInput />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <FullWidthButton title="Login" />
    </>
  );

  const renderSignUpForm = () => (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <FullWidthInput />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <FullWidthInput />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <FullWidthInput />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <PasswordInput />
      </View>

      <FullWidthButton title="Sign Up"  />
    </>
  );

  const underlineTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'],
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Entypo name="chevron-left" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Welcome</Text>
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tab} onPress={() => switchTab('login')}>
            <Text style={[styles.tabText, activeTab === 'login' && styles.activeTab]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => switchTab('signup')}>
            <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTab]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            styles.animatedUnderline,
            {
              transform: [{ translateX: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 200] }) }],
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
    padding: 20,
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
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    paddingLeft: 20,
    color: '#333',
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
    marginTop: 30,
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  
});
