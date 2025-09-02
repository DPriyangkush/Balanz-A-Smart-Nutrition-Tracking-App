// HeaderSection.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HeaderSection = ({ userName = "Priyangkush", onSearchPress, onNotificationPress, onProfilePress }) => {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.leftSection}>
                    <Text style={styles.greeting}>Hi {userName},</Text>
                    <Text style={styles.subGreeting}>Good Morning!</Text>
                </View>
                <View style={styles.rightSection}>
                    <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
                        <Ionicons name="search" size={24} color="#1e1e1e" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress}>
                        <Ionicons name="notifications" size={24} color="#1e1e1e" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
                        <Image 
                            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.mainTitle}>Providing the best healthy breakfast for you! 🍽️</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    leftSection: {
        flex: 1,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    greeting: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e1e1e',
        marginBottom: 2,
    },
    subGreeting: {
        fontSize: 16,
        color: '#1e1e1e',
    },
    iconButton: {
        padding: 5,
    },
    profileButton: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e1e1e',
        lineHeight: 36,
        maxWidth: '80%',
    },
});

export default HeaderSection;