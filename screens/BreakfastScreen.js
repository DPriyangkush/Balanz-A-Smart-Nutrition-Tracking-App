// BreakfastScreen.js - Optimized without layout changes
import React, { memo, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { BreakfastWrapper } from "components/ScreenWrappers";
import SunriseScene from "animatedScenes/SunriseScene";

// Memoize the component to prevent unnecessary re-renders
const BreakfastScreen = memo(() => {
    // Memoize StatusBar props to prevent recreation
    const statusBarProps = useMemo(() => ({
        barStyle: "dark-content"
    }), []);

    return (
        <BreakfastWrapper>
            
            <SafeAreaView style={styles.container}>
                <StatusBar {...statusBarProps} />
                <SunriseScene/>
            </SafeAreaView>
        </BreakfastWrapper>
    );
});

// Add display name for debugging
BreakfastScreen.displayName = 'BreakfastScreen';

export default BreakfastScreen;

// Move styles outside component - they're created once and reused
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffa246ff",
        paddingHorizontal: 16,
        alignItems: "center"
    },
    SearchContainer: {
        paddingTop: 20,
    }
});