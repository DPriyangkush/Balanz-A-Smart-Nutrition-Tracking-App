import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import BottomNav from 'components/BottomNav'

const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.title}>Dashboard</Text>
      </View>

      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  )
}

export default DashboardScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});