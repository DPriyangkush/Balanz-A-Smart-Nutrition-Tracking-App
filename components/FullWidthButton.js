import React from 'react'
import { Button, YStack, XStack } from 'tamagui'

const FullWidthButton = ({
  title = "Login",
  onPress,
  color = '#1e1e1e',
  textColor = '#fff',
  icon = null,
  bordered = false, // 👈 optional prop to toggle border style
  borderColor = '#1e1e1e',
}) => {
  return (
    <YStack width="100%" px="$4">
      <Button
        size="$6"
        backgroundColor={color}
        color={textColor}
        onPress={onPress}
        width="100%"
        borderRadius="$6"
        borderWidth={bordered ? 0.8 : 0}
        borderColor={bordered ? borderColor : 'transparent'}
      >
        <XStack alignItems="center" gap="$2">
          {icon && icon}
          <Button.Text color={textColor}>{title}</Button.Text>
        </XStack>
      </Button>
    </YStack>
  )
}

export default FullWidthButton
