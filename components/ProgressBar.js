import React from 'react';
import { View } from 'react-native';
import { XStack, YStack } from 'tamagui';

const ProgressBar = ({ step }) => {
  const totalSteps = 3;
  return (
    <XStack alignItems="center" justifyContent="center" mb="$4">
      {[...Array(totalSteps)].map((_, i) => (
        <View
          key={i}
          style={{
            height: 6,
            width: 50,
            marginHorizontal: 5,
            borderRadius: 5,
            backgroundColor: i < step ? '#000' : '#ccc',
          }}
        />
      ))}
    </XStack>
  );
};

export default ProgressBar;
