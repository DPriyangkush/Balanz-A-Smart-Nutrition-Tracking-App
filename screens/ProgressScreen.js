import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { ProgressWrapper } from '../components/ScreenWrappers'
import CircularProgress from 'ProgressComponents/CircularProgress'
import EnergySourcesCard from 'ProgressComponents/EnergySources'

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
