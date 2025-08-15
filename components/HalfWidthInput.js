import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Input, YStack, Text } from 'tamagui';

const HalfWidthInput = ({ value, onChangeText, placeholder, hasError, ...props }) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (hasError) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 3, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -3, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [hasError]);

  return (
    <YStack  width="70%" paddingRight="$2" position="relative" marginLeft="$2.5">
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        size="$5"
        backgroundColor="#fff"
        color="#1e1e1e"
        borderColor={hasError ? 'red' : '#1e1e1e'}
        borderWidth={1}
        borderRadius="$6"
        paddingHorizontal="$3"
        {...props}
      />
      {hasError && (
        <Animated.View
          style={{
            position: 'absolute',
            right: 10,
            top: 20,
            transform: [{ translateX: shakeAnim }],
          }}
        >
          <Text fontSize={16}>⚠️</Text>
        </Animated.View>
      )}
    </YStack>
  );
};

export default HalfWidthInput;
