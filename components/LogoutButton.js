import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useAuthStore from "../stores/authStore"; // Import your Zustand store

export default function LogoutButton() {
  const { signOut } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              // No need for navigation here - auth state listener will handle it
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      activeOpacity={0.8}
      style={styles.buttonWrapper}
    >
      <LinearGradient
        colors={["#ffb347", "#ff7e5f"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    marginTop: 20,
    borderRadius: 25,
    overflow: "hidden",
    alignSelf: "center",
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});