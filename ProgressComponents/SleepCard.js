import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const SleepCard = ({ hours = 7, minutes = 30 }) => {
  const totalMinutes = hours * 60 + minutes;
  const sleepAngle = (totalMinutes / (8 * 60)) * 270; // 270 degrees for 8 hours
  
  const createArc = (startAngle, endAngle, radius) => {
    const start = polarToCartesian(50, 50, radius, endAngle);
    const end = polarToCartesian(50, 50, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };
  
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>😴</Text>
        <Text style={styles.title}>Sleep</Text>
      </View>
      
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{hours}:{minutes.toString().padStart(2, '0')}</Text>
        <Text style={styles.timeLabel}>hr</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
    width: 180,
    height: 140,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  time: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
  },
  timeLabel: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  
});

export default SleepCard;