import { View, Text } from 'react-native'
import React from 'react'
import { MealWrapper } from '../components/ScreenWrappers'

const MealScreen = () => {
  return (
    <MealWrapper>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, color: '#fff' }}>Meal Screen</Text>
      </View>
    </MealWrapper>
  )
}

export default MealScreen