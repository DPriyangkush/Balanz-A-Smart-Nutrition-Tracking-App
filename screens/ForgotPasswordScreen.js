import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { sendOtpToEmail } from '../FirebaseFunctions';
import FullWidthInput from '../components/FullWidthInput';
import FullWidthButton from '../components/FullWidthButton';
import { setTimerEnd, getTimerEnd } from '../otpTimerStore';
import { useEffect } from 'react';


const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigation = useNavigation();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const end = getTimerEnd();
      if (!end) return;
      const remaining = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setTimeLeft(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, []);



  const handleSendOtp = async () => {
    const cleanedEmail = email.trim().toLowerCase();
    if (!cleanedEmail) {
      alert('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      console.log('🚀 About to call sendOtpToEmail with:', cleanedEmail);
      const res = await sendOtpToEmail(cleanedEmail);

      if (res?.success) {
        const newEnd = Date.now() + 10 * 60 * 1000; // 10 min
        console.log('✅ OTP sent successfully, showing confirmation popup');
        setTimerEnd(newEnd);
        setShowPopup(true); // show modal
      } else {
        throw new Error(res?.error || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('💥 Send OTP Error:', err);
      alert(err.message || 'Something went wrong while sending OTP');
    } finally {
      setLoading(false);
    }
  };




  const handleDone = () => {
    setShowPopup(false);
    navigation.navigate('VerifyOTPScreen', { email });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.fullScreen}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Entypo name="chevron-left" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Top Dark Section */}
          <View style={styles.topContainer}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email account to reset password
            </Text>
          </View>

          {/* White Bottom Section */}
          <View style={styles.bottomContainer}>
            <FullWidthInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FullWidthButton
              title={
                loading
                  ? 'Sending OTP...'
                  : timeLeft > 0
                    ? `Resend in ${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                      .toString()
                      .padStart(2, '0')}`
                    : 'Continue'
              }
              onPress={handleSendOtp}
              disabled={loading || timeLeft > 0}
              textColor={
                loading
                  ? '#999'       // Dim gray
                  : timeLeft > 0
                    ? '#000'     // Gray for "Resend in"
                    : '#fff'     // White for "Continue"
              }
            />

          </View>

          {/* Confirmation Popup */}
          <Modal
            transparent
            visible={showPopup}
            animationType="slide"
            onRequestClose={() => { }}
          >
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
              <View style={styles.popupContainer}>
                <View style={styles.popupBox}>
                  <View style={styles.iconBubble}>
                    <Text style={styles.iconBubbleText}>💬</Text>
                  </View>
                  <Text style={styles.popupTitle}>Check your email</Text>
                  <Text style={styles.popupSubtitle}>
                    We have sent instructions to recover your password to your email
                  </Text>
                  <Pressable style={styles.doneButton} onPress={handleDone}>
                    <Text style={styles.doneButtonText}>Done</Text>
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

export default ForgotPasswordScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: 50,
  },
  fullScreen: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 10,
  },
  backButton: {
    padding: 4,
    marginLeft: 20,
  },
  topContainer: {
    paddingTop: 120,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#D3D3D3',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 40,
    padding: 24,
    gap: 16,
  },

  // Popup Styles
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
  iconBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#000',
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
