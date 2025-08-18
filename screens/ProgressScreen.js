import { View, Text } from 'react-native'
import React from 'react'
import { ProgressWrapper } from '../components/ScreenWrappers'

const ProgressScreen = () => {
  return (
    <ProgressWrapper>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, color: '#fff' }}>Progress Screen </Text>
      </View>
    </ProgressWrapper>
  )
}

export default ProgressScreen