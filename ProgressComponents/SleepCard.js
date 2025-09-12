import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const SleepCard = ({ hours = 7, minutes = 30 }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="bed" size={16} color="white" />
        </View>
        <Text style={styles.title}>Sleep</Text>
      </View>
            
      <View style={styles.timeContainer}>
        <Text style={styles.hours}>{hours}</Text>
        <Text style={styles.hoursLabel}>h</Text>
        <Text style={styles.minutes}>{minutes}</Text>
        <Text style={styles.minutesLabel}>m</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    width: 180,
    height: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    backgroundColor: "#4ECDC4",
    padding: 4,
    borderRadius: 8,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Inter-SemiBold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  hours: {
    color: 'white',
    fontSize: 40,
    fontWeight: '100',
    fontFamily: 'Inter',
  },
  hoursLabel: {
    color: '#8E8E93',
    fontSize: 24,
    fontWeight: '100',
    marginRight: 8,
    fontFamily: 'Inter',
  },
  minutes: {
    color: 'white',
    fontSize: 40,
    fontWeight: '100',
    fontFamily: 'Inter',
  },
  minutesLabel: {
    color: '#8E8E93',
    fontSize: 24,
    fontWeight: '100',
    marginLeft: 2,
    fontFamily: "Inter",
  },
});

export default SleepCard;