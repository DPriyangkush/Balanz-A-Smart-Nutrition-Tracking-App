import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Svg, Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import ProfileTabs from "../components/ProfileTabs";


const { width } = Dimensions.get("window");

const CircularOverlay = () => {
  const size = 800;
  const center = size / 2;
  const radii = [100, 200, 300, 400, 500];

  return (
    <Svg
      height={size}
      width={size}
      style={{
        position: "absolute",
        top: -size / 1.9,
        left: "50%",
        transform: [{ translateX: -center }],
      }}
    >
      {radii.map((r, i) => (
        <Circle
          key={i}
          cx={center}
          cy={center}
          r={r}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={2}
          fill="none"
        />
      ))}
    </Svg>
  );
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const unsub = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      });
      return () => unsub();
    }
  }, []);

  const workouts = [
    {
      id: "1",
      title: "INTENSIVE CARDIO",
      date: "27 june",
      time: "3 PM",
      duration: "1:10",
      difficulty: "hard",
      image:
        "https://images.unsplash.com/photo-1599058917212-d750089bc07b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "2",
      title: "TRX SYSTEM",
      date: "27 june",
      time: "5 PM",
      duration: "1:20",
      difficulty: "",
      image:
        "https://images.unsplash.com/photo-1583454110554-bb2d6123ed8b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "3",
      title: "HIGH WEIGHT",
      date: "2 july",
      time: "6 PM",
      duration: "1:25",
      difficulty: "",
      image:
        "https://images.unsplash.com/photo-1571019613578-2b22c76fd955?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const renderWorkoutCard = ({ item }) => (
    <View style={styles.workoutCard}>
      <Image source={{ uri: item.image }} style={styles.workoutImage} />
      <View style={styles.workoutDetails}>
        <Text style={styles.workoutTitle}>{item.title}</Text>
        <View style={styles.workoutMeta}>
          <Text style={styles.workoutDuration}>{item.duration}</Text>
          {item.difficulty ? (
            <Text style={styles.workoutDifficulty}>{item.difficulty}</Text>
          ) : null}
        </View>
      </View>
      <View>
        <Text style={styles.workoutDate}>{item.date}</Text>
        <Text style={styles.workoutTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Orange-to-dark background */}
      <LinearGradient
        colors={["#ff6a00ff", "#f29350ff",  "#1a1a1a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />

      <CircularOverlay />
      <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.minimalGlassOverlay} />

      {/* Profile Header */}
      <View style={[styles.header, { paddingTop: insets.top + 30 }]}>
        <Image
          source={{
            uri:
              userData?.avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
          }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>
            {userData?.fullName || "JAMES ANDERSON"}
          </Text>
        </View>
        <TouchableOpacity style={styles.editIcon}>
          <Ionicons name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Age</Text>
          <Text style={styles.statValue}>
            {userData?.personalInfo?.age ? `${userData.personalInfo?.age} yr's` : "21 yo"}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Height</Text>
          <Text style={styles.statValue}>
            {userData?.personalInfo?.height ? `${userData?.personalInfo?.height} ${userData?.personalInfo?.heightUnit}` : "5,97 ft"}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Weight</Text>
          <Text style={styles.statValue}>
            {userData?.personalInfo?.weight ? `${userData.personalInfo?.weight} ${userData?.personalInfo?.weightUnit}` : "80 kilo"}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <ProfileTabs onTabChange={setActiveTab} />

      {/* Workout List */}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  minimalGlassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 36,
    width: "60%",
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  },
  editIcon: {
    position: "absolute",
    bottom: 25,
    right: 30,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    marginBottom: 10,
  },
  statBox: { alignItems: "center" },
  statValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
  },
  statLabel: {
    color: "#1e1e1e",
    fontSize: 12,
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: { color: "#fff", fontWeight: "500" },
  activeTabText: { color: "#000" },
  workoutCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
  },
  workoutImage: {
    width: 75,
    height: 75,
    borderRadius: 12,
    marginRight: 12,
  },
  workoutDetails: { flex: 1 },
  workoutTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  workoutMeta: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  workoutDuration: { color: "#aaa", fontSize: 13 },
  workoutDifficulty: {
    color: "red",
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "bold",
  },
  workoutDate: { color: "#fff", fontSize: 14, textAlign: "right" },
  workoutTime: { color: "#aaa", fontSize: 13, textAlign: "right" },
});
