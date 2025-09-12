import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { ProgressWrapper } from '../components/ScreenWrappers'
import CircularProgress from 'ProgressComponents/CircularProgress'
import EnergySourcesCard from 'ProgressComponents/EnergySources'
import StepsCard from 'ProgressComponents/StepsCard'
import SleepCard from 'ProgressComponents/SleepCard'
import ExerciseCard from 'ProgressComponents/ExerciseCard'
import HeartCard from 'ProgressComponents/HeartCard'
import WaterCard from 'ProgressComponents/WaterCard'
import CaloriesCard from 'ProgressComponents/CaloriesCard'
import CyclingCard from 'ProgressComponents/CyclingCard'

const ProgressScreen = () => {
  const { width } = Dimensions.get('window');

  return (
    <ProgressWrapper>
      <View style={styles.container}>
        <CircularProgress
          percentage={100}
          size={Math.min(width * 0.6, 250)}
          strokeWidth={12}
          gradientColors={['#4CAF50', '#8BC34A']}
          scaleSteps={[0, 100, 200, 300]}
          animationDuration={1500}
          centerTitle="Average Kcal Consumed / Day"
          showScaleLabels={true}
        />

        {/* ✅ Reduced gap using marginTop */}
        <View style={{ marginTop: -120 }}>
          <EnergySourcesCard />
        </View>

        <TouchableOpacity onPress={() => console.log('Steps Card Pressed')}>
        <StepsCard />
        </TouchableOpacity>
        <SleepCard />

        <ExerciseCard />

        <HeartCard />

        <WaterCard />

        <CaloriesCard />

        <CyclingCard />
        
      </View>
    </ProgressWrapper>
  )
}

export default ProgressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    
  },
})
