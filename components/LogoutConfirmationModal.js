import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const LogoutConfirmationModal = ({ 
  visible, 
  onConfirm, 
  onCancel, 
  loading = false,
  title = "Delete Track",
  message = "This will permanently delete your track from your account"
}) => {
  const [isMounted, setIsMounted] = useState(visible);

  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setIsMounted(true); // Mount modal
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
      });
    } else {
      // Animate down, then unmount
      opacity.value = withTiming(0, { duration: 150 });
      translateY.value = withSpring(height, {
        damping: 20,
        stiffness: 200,
      }, (finished) => {
        if (finished) {
          runOnJS(setIsMounted)(false);
        }
      });
    }
  }, [visible]);

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleConfirm = () => {
    if (!loading) onConfirm();
  };

  const handleCancel = () => {
    if (!loading) onCancel();
  };

  const handleBackdropPress = () => {
    if (!loading) onCancel();
  };

  if (!isMounted) return null;

  return (
    <Modal
      transparent
      visible={isMounted}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={handleCancel}
    >
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />

      {/* Backdrop with Blur + Gradient */}
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <BlurView intensity={20} tint="dark" style={styles.fullScreenBlur}>
          <LinearGradient
            colors={[
              'rgba(0,0,0,0.6)',
              'rgba(0,0,0,0.4)',
              'rgba(0,0,0,0.7)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.fullScreenBlur}
          />
        </BlurView>
        <TouchableOpacity 
          style={styles.touchableOverlay}
          activeOpacity={1}
          onPress={handleBackdropPress}
        />
      </Animated.View>

      {/* Modal Content */}
      <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
        <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
          <BlurView intensity={80} tint="dark" style={styles.glassContainer}>
            <LinearGradient
              colors={[
                'rgba(255,255,255,0.15)',
                'rgba(255,255,255,0.05)',
                'rgba(255,255,255,0.1)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientOverlay}
            >
              <View style={styles.dragHandle} />

              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#ff6b6b', '#ee5a52']}
                  style={styles.iconBackground}
                >
                  <Ionicons name="warning" size={24} color="#fff" />
                </LinearGradient>
              </View>

              <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={loading}
                >
                  <Text style={[
                    styles.cancelButtonText,
                    loading && styles.disabledText
                  ]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button, 
                    styles.confirmButton,
                    loading && styles.disabledButton
                  ]}
                  onPress={handleConfirm}
                  disabled={loading}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={styles.confirmButtonText}>
                        Logging out...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.confirmButtonText}>
                      Logout
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

export default LogoutConfirmationModal;

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  fullScreenBlur: {
    flex: 1,
  },
  touchableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
  },
  glassContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
  },
  gradientOverlay: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 34,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  message: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: 'Inter',
    paddingHorizontal: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  confirmButton: {
    backgroundColor: '#ef4444',
  },
  disabledButton: {
    backgroundColor: '#6B7280',
    opacity: 0.7,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Inter',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Inter',
  },
  disabledText: {
    opacity: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
