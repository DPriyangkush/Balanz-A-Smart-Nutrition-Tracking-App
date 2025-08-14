import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_HEIGHT = 450;

export default function ProfileCard({ style }) {
  const profileImage =
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe";

  return (
    <View style={[styles.container, style]}>
      {/* Background Image */}
      <Image source={{ uri: profileImage }} style={styles.image} />

      {/* Blurred bottom section */}
      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={
          <LinearGradient
            colors={["transparent", "black"]}
            locations={[0.5, 0.8, 1]}
            style={StyleSheet.absoluteFill}
          />
        }
      >
        <BlurView intensity={60} style={StyleSheet.absoluteFill} />
      </MaskedView>

      {/* Bottom Content */}
      <View style={styles.contentContainer}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.subtitle}>Photographer • Traveler</Text>
          <Text style={styles.description} numberOfLines={2}>
            Capturing moments from around the globe and telling stories through my lens.
          </Text>
        </View>
        <TouchableOpacity style={styles.followBtn}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  contentContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    zIndex: 10000,
  },
  name: {
    color: "#1e1e1e",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#ddd",
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 18,
    maxWidth: width * 0.55,
  },
  followBtn: {
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: "#fff",
  },
  followText: {
    fontWeight: "bold",
    color: "#fff",
  },
});
