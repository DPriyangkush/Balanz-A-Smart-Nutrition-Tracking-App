// RecommendedSection.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const recommendedItems = [
    {
        id: 1,
        name: 'Mediterranean Bowl',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
        rating: 4.8,
        cookTime: '15 min',
        price: '$12.99',
        isFavorite: false,
    },
    {
        id: 2,
        name: 'Spaghetti Carbonara',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop',
        rating: 4.9,
        cookTime: '20 min',
        price: '$14.99',
        isFavorite: true,
    },
    {
        id: 3,
        name: 'Avocado Toast',
        image: 'https://images.unsplash.com/photo-1603046891726-36bfd957e0a4?w=300&h=200&fit=crop',
        rating: 4.7,
        cookTime: '10 min',
        price: '$8.99',
        isFavorite: false,
    },
];

const RecommendedSection = ({ onItemPress, onSeeAllPress }) => {
    const [favorites, setFavorites] = useState(
        recommendedItems.reduce((acc, item) => ({
            ...acc,
            [item.id]: item.isFavorite
        }), {})
    );

    const toggleFavorite = (itemId) => {
        setFavorites(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Recommended for you</Text>
                <TouchableOpacity onPress={onSeeAllPress}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.itemsContainer}
            >
                {recommendedItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.itemCard}
                        onPress={() => onItemPress?.(item)}
                    >
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                            <TouchableOpacity 
                                style={styles.favoriteButton}
                                onPress={() => toggleFavorite(item.id)}
                            >
                                <Ionicons 
                                    name={favorites[item.id] ? "heart" : "heart-outline"} 
                                    size={20} 
                                    color={favorites[item.id] ? "#FF6B9D" : "white"} 
                                />
                            </TouchableOpacity>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={styles.ratingText}>{item.rating}</Text>
                            </View>
                        </View>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <View style={styles.itemDetails}>
                                <Text style={styles.cookTime}>{item.cookTime}</Text>
                                <Text style={styles.price}>{item.price}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e1e1e',
        paddingHorizontal: 10,
    },
    seeAll: {
        fontSize: 16,
        color: '#1e1e1e',
        fontWeight: '600',
    },
    itemsContainer: {
        paddingHorizontal: 10,
        gap: 15,
    },
    itemCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: 200,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    imageContainer: {
        position: 'relative',
    },
    itemImage: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        resizeMode: 'cover',
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 20,
        padding: 8,
    },
    ratingBadge: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    ratingText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    itemInfo: {
        padding: 15,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    itemDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cookTime: {
        fontSize: 14,
        color: '#666',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF8C00',
    },
});

export default RecommendedSection;