// BreakfastScreen.js - Fixed version
import React, { memo, useMemo, useRef } from "react";
import {
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Dimensions,
    Alert,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { BreakfastWrapper } from "../components/ScreenWrappers";
import HeaderSection from "../components/HeaderSection";
import PromoCard from "../components/PromoCard";
import NutritionCategories from "../components/NutritionCategories";
import RecommendedSection from "../components/BreakfastRecommendedSection";
import SunriseSunLensUltra from "../animatedScenes/SunriseScene";
import MealSearchInput from "../components/MealSearchInput";

// Performance: Memoize screen dimensions outside component
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Memoize the component to prevent unnecessary re-renders
const BreakfastScreen = memo(() => {
    // Memoize StatusBar props to prevent recreation
    const statusBarProps = useMemo(() => ({
        barStyle: "light-content",
        backgroundColor: "transparent",
    }), []);
    
    const scrollViewRef = useRef(null);
    
    // Memoize responsive configuration
    const responsiveConfig = useMemo(() => {
        const isTablet = screenWidth >= 768;
        const isLargeScreen = screenWidth >= 1024;

        return {
            isTablet,
            isLargeScreen,
            horizontalPadding: Math.min(Math.max(screenWidth * 0.04, 16), 24),
            sectionSpacing: Math.min(Math.max(screenWidth * 0.03, 16), 24),
            gradientWidth: Math.min(Math.max(screenWidth * 0.08, 30), 60),
        };
    }, []);
    
    // Category handlers
    const handleCategoryPress = (category) => {
        Alert.alert("Category", `Selected: ${category.name}`);
    };

    const handleCategorySeeAll = () => {
        Alert.alert("Categories", "View all categories");
    };

    // Recommended section handlers
    const handleItemPress = (item) => {
        Alert.alert("Food Item", `Selected: ${item.name}`);
    };

    const handleRecommendedSeeAll = () => {
        Alert.alert("Recommended", "View all recommended items");
    };

    // Search handlers
    const handleSearchTextChange = (text) => {
        console.log("Search text:", text);
    };

    const handleSearchSubmit = () => {
        Alert.alert("Search", "Performing search...");
    };

    // Memoize responsive styles
    const responsiveStyles = useMemo(() => StyleSheet.create({
        foggyWrapper: {
            position: 'relative',
            marginHorizontal: responsiveConfig.isTablet ? 0 : -responsiveConfig.horizontalPadding * 0.5,
        },
        gradientOverlay: {
            position: 'absolute',
            top: 0,
            bottom: 30,
            width: responsiveConfig.gradientWidth,
            zIndex: 10,
            pointerEvents: 'none',
        },
        leftGradient: {
            left: 0,
        },
        rightGradient: {
            right: 0,
        },
    }), [responsiveConfig]);

    return (
        <BreakfastWrapper>
            <StatusBar {...statusBarProps} />
            <SafeAreaView style={styles.container}>
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                >
                    <SunriseSunLensUltra />
                    
                    {/* White Background Section */}
                    <View style={styles.whiteSection}>
                        <View style={responsiveStyles.foggyWrapper}>
                            {/* Category Section */}
                            <NutritionCategories 
                                onCategoryPress={handleCategoryPress}
                                onSeeAllPress={handleCategorySeeAll}
                            />

                            {/* Left Gradient Overlay */}
                            <LinearGradient
                                colors={[
                                    '#ffa245ff',
                                    'rgba(255, 197, 61, 0.8)',
                                    'rgba(255, 179, 0, 0.4)',
                                    'transparent'
                                ]}
                                locations={[0, 0.3, 0.7, 1]}
                                style={[responsiveStyles.gradientOverlay, responsiveStyles.leftGradient]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                pointerEvents="none"
                            />
                            
                            {/* Right Gradient Overlay */}
                            <LinearGradient
                                colors={[
                                    'transparent',
                                    'rgba(255,248,232,0.4)',
                                    'rgba(255,248,232,0.8)',
                                    '#ffa245ff'
                                ]}
                                locations={[0, 0.3, 0.7, 1]}
                                style={[responsiveStyles.gradientOverlay, responsiveStyles.rightGradient]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                pointerEvents="none"
                            />
                        </View>

                        {/* Search Input */}
                        <MealSearchInput 
                            placeholder="Find your healthy meal..."
                            onChangeText={handleSearchTextChange}
                            onSubmitEditing={handleSearchSubmit}
                        />
                        
                        {/* Recommended Section */}
                        <RecommendedSection 
                            onItemPress={handleItemPress}
                            onSeeAllPress={handleRecommendedSeeAll}
                        />
                        
                        {/* Extra space for better scrolling */}
                        <View style={styles.bottomSpace} />
                    </View>
                </ScrollView>
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
        backgroundColor: "#ffa245ff", // Orange background
    },
    scrollContainer: {
        flex: 1,
    },
    whiteSection: {
        backgroundColor: '#ffa245ff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 16,
        marginTop: 20,
        minHeight: screenHeight * 0.6,
        paddingTop: 10,
    },
    bottomSpace: {
        height: 100, // Extra space at bottom
    },
});