import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 200;
const AVATAR_SIZE = 126;
const CARD_BORDER_RADIUS = 24;

export default function ProfileCard() {
  const [userData, setUserData] = useState(null);

  const bgImage =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80";
  const avatarImage =
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80";

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) return; // User not logged in

    const userRef = doc(db, "users", currentUser.uid);

    // Real-time listener
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.data());
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header background */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: bgImage }} style={styles.headerImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)"]}
          style={styles.headerGradient}
        />
      </View>

      {/* Main profile card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarImage }} style={styles.avatar} />
          </View>

          {/* Profile content */}
          <View style={styles.profileContent}>
            <View style={styles.profileHeader}>
              <View style={styles.profileInfo}>
                <Text style={styles.name}>
                  {userData ? userData.fullName : "Loading..."}
                </Text>
                
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="mail-outline" size={18} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followText}>Follow</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                <Text style={styles.statNumber}>217</Text>
                <Text style={styles.statLabel}> Following </Text>
                <Text style={styles.dot}>• </Text>
                <Text style={styles.statNumber}>590</Text>
                <Text style={styles.statLabel}> Followers</Text>
              </Text>
            </View>

            {/* Bio */}
            <Text style={styles.bio}>
              Designer focused on creating impactful, user-centered digital
              experiences and branding.
            </Text>

            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                <Text style={[styles.tabText, styles.activeTabText]}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>Replies</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>Media</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>Likes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  headerContainer: { height: HEADER_HEIGHT, width: "100%", position: "relative" },
  headerImage: { width: "100%", height: "100%", resizeMode: "cover" },
  headerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  cardContainer: { flex: 1, marginTop: -CARD_BORDER_RADIUS },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: CARD_BORDER_RADIUS,
    borderTopRightRadius: CARD_BORDER_RADIUS,
    paddingTop: AVATAR_SIZE / 2 + 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarContainer: {
    position: "absolute",
    top: -AVATAR_SIZE / 2,
    left: 16,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: "#fff",
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  avatar: { width: "100%", height: "100%", resizeMode: "cover" },
  profileContent: { paddingHorizontal: 16, paddingBottom: 16 },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  profileInfo: { flex: 1 },
  name: { fontSize: 22, fontWeight: "700", color: "#000", marginBottom: 2 },
  username: { fontSize: 15, color: "#666", marginBottom: 8 },
  actionButtons: { flexDirection: "row", alignItems: "center" },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e1e5e9",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  followButton: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
  },
  followText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  statsContainer: { marginBottom: 12 },
  statsText: { fontSize: 15 },
  statNumber: { fontWeight: "700", color: "#000" },
  statLabel: { color: "#666", fontWeight: "400" },
  dot: { color: "#666" },
  bio: { fontSize: 15, color: "#333", lineHeight: 20, marginBottom: 20 },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  tab: { flex: 1, paddingVertical: 16, alignItems: "center" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#000" },
  tabText: { fontSize: 15, color: "#666", fontWeight: "500" },
  activeTabText: { color: "#000", fontWeight: "600" },
  postsContainer: { flex: 1, backgroundColor: "#fff" },
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  postAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 12 },
  postHeaderInfo: { flex: 1, flexDirection: "row", alignItems: "center" },
  postName: { fontSize: 15, fontWeight: "600", color: "#000", marginRight: 6 },
  postTime: { fontSize: 14, color: "#666" },
  postText: { fontSize: 15, color: "#333", lineHeight: 20, marginBottom: 12 },
  postActions: { flexDirection: "row", justifyContent: "space-between", paddingRight: 60 },
  postAction: { padding: 8 },
});
