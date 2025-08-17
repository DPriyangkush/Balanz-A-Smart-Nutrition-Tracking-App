import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useAuthStore from "../stores/authStore"; // Import your Zustand store
import LogoutConfirmationModal from "./LogoutConfirmationModal"; // Import the modal component

export default function LogoutButton() {
  const { signOut } = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      // Close modal after successful logout
      setModalVisible(false);
      setLoading(false);
      // No need for navigation here - auth state listener will handle it
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
      setModalVisible(false);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  const handleCancelLogout = () => {
    if (!loading) {
      setModalVisible(false);
    }
  };

  return (
    <>
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

      <LogoutConfirmationModal
        visible={modalVisible}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        loading={loading}
        title="Logout"
        message="Are you sure you want to logout from your account?"
      />
    </>
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