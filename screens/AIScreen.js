import { View, Text } from 'react-native'
import React from 'react'
import { AIWrapper } from '../components/ScreenWrappers'

const AIScreen = () => {
  return (
    <AIWrapper>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, color: '#fff' }}>AI Assistant Screen</Text>
      </View>
    </AIWrapper>
  )
}

export default AIScreen