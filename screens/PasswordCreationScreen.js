import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { resetPassword } from '../FirebaseFunctions';
import { Entypo } from '@expo/vector-icons';
import { clearTimerEnd } from '../otpTimerStore';
import { BlurView } from 'expo-blur';
import LottieView from 'lottie-react-native';
import success from '../assets/animationLottie/Success.json';


const PasswordCreationScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params;

  const trimmedPassword = password.trim();
  const passwordsMatch = trimmedPassword === confirmPassword.trim();
  const isValidPassword = trimmedPassword.length >= 6;

  const getPasswordStrength = () => {
    const pwd = trimmedPassword;
    if (pwd.length < 6) return { label: 'Too Short', color: 'gray' };
    if (/^[a-zA-Z]+$/.test(pwd)) return { label: 'Weak', color: 'red' };
    if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(pwd)) return { label: 'Medium', color: 'orange' };
    if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(pwd)) return { label: 'Strong', color: 'green' };
    return { label: 'Weak', color: 'red' };
  };

  const handleReset = async () => {
    if (!isValidPassword) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    if (!passwordsMatch) {
      alert('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(email, trimmedPassword);

      if (res?.success) {
        clearTimerEnd();
        setShowSuccessModal(true); // Show modal instead of alert
      } else {
        throw new Error(res?.error || 'Password reset failed');
      }
    } catch (err) {
      console.error('Password Reset Error:', err);
      alert(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Top container */}
          <View style={styles.topContainer}>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Entypo name="chevron-left" size={28} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>Create New Password</Text>
            <Text style={styles.subtitle}>Set a strong password for your account</Text>
          </View>

          {/* Bottom container */}
          <View style={styles.bottomContainer}>
            {/* New password input */}
            <View style={styles.inputWrapper}>
              <TextInput
                secureTextEntry={!showPassword}
                placeholder="Enter new password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {/* Password strength */}
            {trimmedPassword.length > 0 && (
              <Text style={{ color: strength.color, marginBottom: 12 }}>
                Strength: {strength.label}
              </Text>
            )}

            {/* Confirm password input */}
            <View style={styles.inputWrapper}>
              <TextInput
                secureTextEntry={!showConfirmPassword}
                placeholder="Retype new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((prev) => !prev)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeText}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {/* Error message if passwords don’t match */}
            {confirmPassword.length > 0 && !passwordsMatch && (
              <Text style={{ color: 'red', marginBottom: 12 }}>
                Passwords do not match.
              </Text>
            )}

            {/* Reset Button */}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  opacity: isValidPassword && passwordsMatch && !loading ? 1 : 0.5,
                },
              ]}
              onPress={handleReset}
              disabled={!isValidPassword || !passwordsMatch || loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Success Modal */}
          <Modal
            transparent
            visible={showSuccessModal}
            animationType="slide"
            onRequestClose={() => { }}
          >
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
              <View style={modalStyles.popupContainer}>
                <View style={modalStyles.popupBox}>
                  <View style={modalStyles.lottieWrapper}>
                    <LottieView
                      source={success}
                      autoPlay
                      loop={false}
                      style={{ width: 80, height: 80, alignSelf: "center" }}
                    />
                  </View>
                  <Text style={modalStyles.popupTitle}>Password Updated</Text>
                  <Text style={modalStyles.popupSubtitle}>
                    Your password has been successfully updated.
                  </Text>
                  <Pressable
                    style={modalStyles.doneButton}
                    onPress={() => {
                      setShowSuccessModal(false);
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'AuthScreen' }],
                      });
                    }}
                  >
                    <Text style={modalStyles.doneButtonText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </BlurView>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default PasswordCreationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  topContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    paddingTop: 60,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#000',
    paddingRight: 45,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  eyeText: {
    fontSize: 20,
  },
  button: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 10,
  },
  backButton: {
    padding: 4,
    marginLeft: 0,
  },
});

const modalStyles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  popupBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  lottieWrapper: {
  width: 80,
  height: 80,
  marginBottom: 16,
},
  iconBubbleText: {
    color: 'white',
    fontSize: 20,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  popupSubtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
