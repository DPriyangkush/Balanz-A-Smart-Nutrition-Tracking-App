import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from 'components/BottomNav';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CircularOverlay = () => {
  const size = 800;
  const center = size / 2;
  const radii = [100, 200, 300, 400, 500];
  
  return (
    <Svg
      height={size}
      width={size}
      style={{
        position: 'absolute',
        top: -size / 1.5,
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
  const insets = useSafeAreaInsets();
  

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        <LinearGradient
          colors={['#81C784', '#E8F5E9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          <CircularOverlay />

          {/* No paddingTop here — just marginTop on title */}
          <View style={styles.content}>
            <Text style={[styles.title, { marginTop: insets.top }]}>Dashboard</Text>

            <Text style={styles.subtitle}>Welcome to your dashboard</Text>

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
                  and how the frosted header stays on top with blur effect. 
                  The content should scroll completely behind the header.
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#81C784',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradient: {
    minHeight: screenHeight * 1.5,
    width: screenWidth,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 120,
    zIndex: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 30,
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
});
