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
  disabled = false, // ✅ Add disabled prop
}) => {
  return (
    <YStack width="100%" px="$4">
      <Button
        size="$6"
        backgroundColor={disabled ? '#1e1e1e' : color} // ✅ dim color if disabled
        color={textColor}
        onPress={disabled ? null : onPress} // ✅ block action if disabled
        width="100%"
        borderRadius="$6"
        borderWidth={bordered ? 0.8 : 0}
        borderColor={bordered ? borderColor : 'transparent'}
        disabled={disabled} // ✅ pass to Button
        opacity={disabled ? 0.5 : 1} // ✅ add visual feedback
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
