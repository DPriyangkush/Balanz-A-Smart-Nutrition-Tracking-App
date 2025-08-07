import React, { useRef, useState } from 'react';
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

} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { verifyOtp } from '../FirebaseFunctions';
import { Entypo } from '@expo/vector-icons';
import { getTimerEnd } from '../otpTimerStore';
import { useEffect } from 'react';
import { clearTimerEnd } from '../otpTimerStore';

const VerifyOTPScreen = () => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;
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



  const handleChangeText = (text, index) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otpDigits];
      newOtp[index] = text;
      setOtpDigits(newOtp);

      if (index < 5) {
        inputsRef.current[index + 1].focus();
      } else {
        Keyboard.dismiss();
      }
    } else if (text === '') {
      const newOtp = [...otpDigits];
      newOtp[index] = '';
      setOtpDigits(newOtp);
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const isOtpComplete = otpDigits.every((digit) => digit !== '');

  const handleVerify = async () => {
    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      alert('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      if (res?.success) {
        clearTimerEnd();
        navigation.navigate('PasswordCreationScreen', { email });
      } else {
        throw new Error(res?.error || 'OTP verification failed');
      }
    } catch (err) {
      console.error('OTP Verify Error:', err);
      alert(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>Enter the code sent to your email</Text>
          </View>

          {/* Bottom container */}
          <View style={styles.bottomContainer}>
            <View style={styles.otpContainer}>
              {otpDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChangeText(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  ref={(ref) => (inputsRef.current[index] = ref)}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { opacity: isOtpComplete && !loading ? 1 : 0.5 },
              ]}
              onPress={handleVerify}
              disabled={!isOtpComplete || loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Text>
            </TouchableOpacity>

            {timeLeft > 0 && (
              <Text style={{ textAlign: 'center', marginTop: 12, color: '#555' }}>
                OTP expires in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </Text>
            )}

          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView >
  );
};

export default VerifyOTPScreen;

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
    fontSize: 44,
    fontWeight: 'bold',
    color: '#fff',
    paddingTop: 100,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 4,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 50,
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
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
});
