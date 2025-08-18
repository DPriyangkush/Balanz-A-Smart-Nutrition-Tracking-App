import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle } from 'react-native-svg';
import { DashboardWrapper } from '../components/ScreenWrappers';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CircularOverlay = () => {
  const size = 800;
  const center = size / 5;
  const radii = [100, 200, 300, 400, 500];
  
  return (
    <Svg
      height={size}
      width={size}
      style={{
        position: 'absolute',
        top: -size / 6,
        left: '50%',
        transform: [{ translateX: -center }],
        zIndex: 1,
      }}
    >
      {radii.map((r, i) => (
        <Circle
          key={i}
          cx={center}
          cy={center}
          r={r}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={1.5}
          fill="none"
        />
      ))}
    </Svg>
  );
};

const DashboardScreen = () => {
  return (
    <DashboardWrapper>
      <LinearGradient
        colors={['#151514', '#2A2A28']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        
        style={styles.gradient}
      >
         {/**  <CircularOverlay /> */}

        <View style={styles.content}>
          <Text style={styles.subtitle}>Good Morning, Jacob</Text>
          


          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Overview</Text>
            <Text style={styles.cardText}>Your daily summary goes here</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            <Text style={styles.cardText}>Your recent activities</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quick Stats</Text>
            <Text style={styles.cardText}>Key metrics and statistics</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recommendations</Text>
            <Text style={styles.cardText}>Personalized suggestions for you</Text>
          </View>

          {Array.from({ length: 8 }, (_, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.cardTitle}>Section {i + 1}</Text>
              <Text style={styles.cardText}>
                This is additional content to demonstrate the scrolling effect 
                and how the stretchy header works. The header image will stretch 
                when you pull down and collapse when you scroll up.
              </Text>
            </View>
          ))}

          <View style={styles.spacer} />
        </View>
      </LinearGradient>
    </DashboardWrapper>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  gradient: {
    minHeight: screenHeight * 1.2,
    width: screenWidth,
    position: 'relative',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#CCFCCB"
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 2,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
    backdropFilter: 'blur(10px)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  spacer: {
    height: 100,
  },
});