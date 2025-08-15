import React, { useState } from 'react'
import { Pressable } from 'react-native'
import { Input, XStack, YStack, Text } from 'tamagui'

const PasswordInput = ({ value, onChangeText, placeholder, ...props }) => {
  const [secure, setSecure] = useState(true)

  return (
    <YStack width="100%" paddingHorizontal="$4" mb="$4">
      <XStack
        alignItems="center"
        borderWidth={1}
        borderColor="#1e1e1e"
        borderRadius="$6"
        backgroundColor="#fff"
        paddingHorizontal="$3"
      >
        <Input
          flex={1}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secure}
          color="black"
          backgroundColor="transparent"
          borderWidth={0}
          size="$5"
          paddingLeft={0}  
          {...props}
        />
        <Pressable onPress={() => setSecure(!secure)}>
          <Text color="white" fontSize={16}>
            {secure ? '🙈' : '👁️'}
          </Text>
        </Pressable>
      </XStack>
    </YStack>
  )
}

export default PasswordInput
