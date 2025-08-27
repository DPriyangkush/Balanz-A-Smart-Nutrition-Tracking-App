// BreakfastScreen.js
import React from "react";
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
import MealSearchInput from "components/MealSearchInput";

const breakfastData = [
    {
        id: "1",
        name: "Pancakes",
        description: "Fluffy pancakes with maple syrup",
        image:
            "https://images.unsplash.com/photo-1604908177225-2a50e7e8f3c8?w=800&q=80",
    },
    {
        id: "2",
        name: "Omelette",
        description: "Classic 3-egg omelette with veggies",
        image:
            "https://images.unsplash.com/photo-1585735513060-7d290d31f273?w=800&q=80",
    },
    {
        id: "3",
        name: "Smoothie Bowl",
        description: "Fresh fruits with granola and chia seeds",
        image:
            "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&q=80",
    },
];

const BreakfastScreen = () => {
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <BreakfastWrapper>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.SearchContainer}>
                    <TouchableOpacity>
                        
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </BreakfastWrapper>
    );
};

export default BreakfastScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8E8",
        paddingHorizontal: 16,
    },
    SearchContainer: {
        paddingTop: 20,
    }
});
