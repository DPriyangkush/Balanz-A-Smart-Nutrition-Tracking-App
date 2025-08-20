import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons'; // For the refresh icon
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
  const handleNotifications = () => {
    // Add your notifications logic here
    console.log('Opening notifications...');
  };

  return (
    <DashboardWrapper>
      <LinearGradient
        colors={['#FFF8E8', '#FFF8E8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
         {/**  <CircularOverlay /> */}
         
        <View style={styles.content}>
          {/* Updated Greeting Section */}
          <View style={styles.greetingContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JJ</Text>
              </View>
            </View>
            <View style={styles.greetingContent}>
              <Text style={styles.greetingLabel}>Good Morning,</Text>
              <Text style={styles.userName}>Priyangkush Debnath</Text>
            </View>
            <TouchableOpacity 
              style={styles.notificationButton} 
              onPress={handleNotifications}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="notifications-outline" 
                size={24} 
                color="#8B7355" 
              />
            </TouchableOpacity>
          </View>
                       
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
       
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 2,
       
  },
  // New greeting section styles
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 30,
    backgroundColor: '#8B7355',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF8E8',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  greetingContent: {
    flex: 1,
  },
  greetingLabel: {
    fontSize: 16,
    color: '#8B7355',
    fontFamily: 'Inter',
    fontWeight: '400',
    
  },
  userName: {
    fontSize: 24,
    color: '#2D2419',
    fontFamily: 'Inter',
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 115, 85, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Keep existing styles
  subtitle: {
    fontSize: 18,
    color: '#0F0C05',
    textAlign: "center",
    marginBottom: 30,
    fontWeight: '500',
    fontFamily: "Inter",
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