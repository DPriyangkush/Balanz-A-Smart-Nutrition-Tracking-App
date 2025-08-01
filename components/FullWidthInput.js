import React from 'react'
import { Input, YStack } from 'tamagui'

const FullWidthInput = ({ value, onChangeText, placeholder, ...props }) => {
  return (
    <YStack width="100%" paddingHorizontal="$4">
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        size="$6"
        backgroundColor="#fff"
        color="#1e1e1e"
        borderColor="#1e1e1e"
        borderWidth={1}
        borderRadius="$6"
        paddingHorizontal="$3"
        {...props}
      />
    </YStack>
  )
}

export default FullWidthInput
