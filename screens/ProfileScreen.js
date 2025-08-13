import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import BottomNav from 'components/BottomNav';
import ProfileCard from '../Cards/ProfileCard'; // <-- Import your card

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      {/* Main content */}
      <View style={styles.content}>
        {/* Show the profile card at the top */}
        <ProfileCard />

        {/* Optional: Title or other content */}
        <Text style={styles.title}>Profile Screen</Text>
      </View>

      
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "flex-start", // Push content to top
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
});
