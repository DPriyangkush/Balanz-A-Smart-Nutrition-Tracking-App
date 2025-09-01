// BreakfastScreen.js - Fixed scrolling without changing layout
import React, { memo, useMemo } from "react";
import {
    View,
    StyleSheet,
    StatusBar,
    Dimensions,
    Alert,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { BreakfastWrapper } from "../components/ScreenWrappers";
import HeaderSection from "../components/HeaderSection";
import PromoCard from "../components/PromoCard";
import NutritionCategories from "../components/NutritionCategories";
import SunriseSunLensUltra from "../animatedScenes/SunriseScene";
import MealSearchInput from "../components/MealSearchInput";

import FoodCardsGrid from "components/BreakfastRecommendedCards";

// Performance: Memoize screen dimensions outside component
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Memoize the component to prevent unnecessary re-renders
const BreakfastScreen = memo(() => {
    // Memoize StatusBar props to prevent recreation
    const statusBarProps = useMemo(() => ({
        barStyle: "light-content",
        backgroundColor: "transparent",
    }), []);
    
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

    // Food cards handlers
    const handleFoodItemPress = (item) => {
        Alert.alert("Recipe", `Selected: ${item.name}`);
    };

    const handleFoodCardsSeeAll = () => {
        Alert.alert("Popular Recipes", "View all popular recipes");
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

    // Promo card handler
    const handlePromoPress = () => {
        Alert.alert("Promo", "New recipe promotion activated!");
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
        promoSection: {
            marginTop: 10,
            marginBottom: 5,
        },
        InputSection: {
            paddingHorizontal: 5
        }
    }), [responsiveConfig]);

    return (
        <BreakfastWrapper>
            <StatusBar {...statusBarProps} />
            
            {/* Background Scene - Non-absolute positioning */}
            <View style={styles.backgroundSection}>
                <SunriseSunLensUltra />
            </View>
            
            {/* Main Content Section - This content will scroll */}
            <View style={styles.contentSection}>
                {/* Header Section */}
                <HeaderSection />
                
                {/* Promo Card */}
                <View style={responsiveStyles.promoSection}>
                    <PromoCard 
                        title="New recipe"
                        subtitle="When you order $20+, you'll automatically get applied."
                        buttonText="Lets Cook"
                        onPress={handlePromoPress}
                        imageSource="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop"
                    />
                </View>

                {/* Search Input */}
                <View style={responsiveStyles.InputSection}>
                <MealSearchInput 
                    placeholder="Search food, groceries, drink, etc..."
                    onChangeText={handleSearchTextChange}
                    onSubmitEditing={handleSearchSubmit}
                />
                </View>

                {/* Categories Section with Gradient Overlay */}
                <View style={responsiveStyles.foggyWrapper}>
                    <NutritionCategories 
                        categories={[
                            { id: 1, name: 'Steak', emoji: '🥩' },
                            { id: 2, name: 'Desserts', emoji: '🍰' },
                            { id: 3, name: 'Breakfast', emoji: '🥞' },
                            { id: 4, name: 'Fast Food', emoji: '🍔' },
                            { id: 5, name: 'Sea Food', emoji: '🦐' },
                            { id: 6, name: 'Pizza', emoji: '🍕' },
                        ]}
                        onCategoryPress={handleCategoryPress}
                        onSeeAllPress={handleCategorySeeAll}
                    />

                    {/* Left Gradient Overlay */}
                    <LinearGradient
                        colors={[
                            '#ffffff',
                            'rgba(255, 255, 255, 0.8)',
                            'rgba(255, 255, 255, 0.4)',
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
                            'rgba(255, 255, 255, 0.4)',
                            'rgba(255, 255, 255, 0.8)',
                            '#ffffff'
                        ]}
                        locations={[0, 0.3, 0.7, 1]}
                        style={[responsiveStyles.gradientOverlay, responsiveStyles.rightGradient]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        pointerEvents="none"
                    />

                
                </View>

                
                {/* Horizontal Food Cards Section */}
                <FoodCardsGrid
                    onItemPress={handleFoodItemPress}
                    onSeeAllPress={handleFoodCardsSeeAll}
                />
               
                
                
                
                
                {/* Test content for scrolling verification */}
                <View style={styles.additionalContent}>
                    <View style={styles.testCard}>
                        <View style={styles.testItem} />
                        <View style={styles.testItem} />
                        <View style={styles.testItem} />
                        <View style={styles.testItem} />
                        <View style={styles.testItem} />
                    </View>
                </View>
                
                {/* Bottom padding to ensure scrolling */}
                <View style={styles.bottomSpace} />
            </View>
        </BreakfastWrapper>
    );
});

// Add display name for debugging
BreakfastScreen.displayName = 'BreakfastScreen';

export default BreakfastScreen;

// Styles optimized for proper scrolling
const styles = StyleSheet.create({
    backgroundSection: {
        height: 200,
        width: '100%',
        // Remove absolute positioning to allow natural flow
        overflow: 'hidden',
    },
    contentSection: {
        backgroundColor: '#EDFDEE',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 20,
        marginTop: -25, // Overlap with background slightly
        // Remove any flex or height constraints
        paddingBottom: 20,
        // Add subtle shadow
        shadowColor: '#1e1e1e',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        paddingHorizontal: 10,
    },
    additionalContent: {
        backgroundColor: '#f8f9fa',
        marginTop: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    testCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 15,
        shadowColor: '#1e1e1e',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    testItem: {
        height: 80,
        backgroundColor: '#f0f2f5',
        marginBottom: 12,
        borderRadius: 8,
        // Visual feedback for scrollable content
        borderLeftWidth: 3,
        borderLeftColor: '#4CAF50',
    },
    bottomSpace: {
        height: 400, // Substantial bottom space to ensure scrolling
        backgroundColor: 'transparent',
    },
});