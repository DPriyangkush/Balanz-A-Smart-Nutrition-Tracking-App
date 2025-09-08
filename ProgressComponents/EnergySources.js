import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');

const EnergySourcesCard = ({ 
  title = 'Main uses of energy sources',
  data = [
    { label: 'Protien', percentage: 36, color: '#4CAF50' },
    { label: 'Carbs', percentage: 17, color: '#2196F3' },
    { label: 'Fats', percentage: 12, color: '#9E9E9E' },
  ],
  onPress,
  cardWidth = width - 40,
  showArrow = true,
  backgroundColor = 'white',
  shadowEnabled = true,
  borderRadius = 16,
  padding = 20,
  titleColor = '#333',
  titleSize = 16,
  percentageSize = 24,
  labelSize = 14,
  labelColor = '#666',
  spacing = 'space-between', // 'space-between', 'space-around', 'space-evenly'
}) => {
  
  const CardContent = (
    <View style={[
      styles.card, 
      {
        width: cardWidth,
        backgroundColor,
        borderRadius,
        padding,
        ...(shadowEnabled && styles.shadow)
      }
    ]}>
      <View style={styles.header}>
        <Text style={[styles.title, { 
          color: titleColor,
          fontSize: titleSize 
        }]}>
          {title}
        </Text>
        {showArrow && (
          <Text style={styles.arrow}>→</Text>
        )}
      </View>
      
      <View style={[styles.sourcesContainer, {
        justifyContent: spacing
      }]}>
        {data.map((source, index) => (
          <View key={index} style={[
            styles.sourceItem,
            { flex: spacing === 'space-between' ? 1 : 0 }
          ]}>
            <Text style={[
              styles.percentage, 
              { 
                color: source.color,
                fontSize: percentageSize
              }
            ]}>
              {source.percentage}%
            </Text>
            <Text style={[
              styles.label, 
              { 
                color: labelColor,
                fontSize: labelSize
              }
            ]}>
              {source.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: '500',
    flex: 1,
    textAlign: "center"
  },
  arrow: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  sourcesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  percentage: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  label: {
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default EnergySourcesCard;