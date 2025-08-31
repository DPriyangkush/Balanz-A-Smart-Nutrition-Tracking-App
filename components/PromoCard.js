// PromoCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const PromoCard = ({ 
    title = "Happy Sunday", 
    subtitle = "Get 50%+ Discount!", 
    buttonText = "Get Now",
    onPress,
    imageSource = 'https://images.unsplash.com/photo-1585515656892-31b89d145c2c?w=200&h=150&fit=crop'
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.textSection}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                    <TouchableOpacity style={styles.button} onPress={onPress}>
                        <Text style={styles.buttonText}>{buttonText}</Text>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.imageSection}>
                    <Image source={{ uri: imageSource }} style={styles.image} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 25,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    content: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
    },
    textSection: {
        flex: 1,
        paddingRight: 15,
    },
    imageSection: {
        flex: 0.6,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#8B4513',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 5,
    },
    arrow: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 80,
        borderRadius: 15,
        resizeMode: 'cover',
    },
});

export default PromoCard;