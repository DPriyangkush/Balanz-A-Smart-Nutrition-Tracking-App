import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Input, XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

const MealSearchInput = ({ placeholder = "Find your healthy meal...", onChangeText, value }) => {
  return (
    <XStack style={styles.searchContainer} gap="$2" alignItems="center">
      <XStack style={styles.searchInputContainer} flex={1} alignItems="center">
        <Ionicons name="search" size={24} color="#666" style={styles.searchIcon} />
        <Input
          flex={1}
          placeholder={placeholder}
          placeholderTextColor="#999"
          size={'$5'}
          backgroundColor="transparent"
          borderWidth={0}
          fontSize={16}
          color="#333"
          value={value}
          onChangeText={onChangeText}
        />
      </XStack>
             
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="#333" />
      </TouchableOpacity>
    </XStack>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 24,
    color: '#666',
    marginRight: -10
  },
  menuButton: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default MealSearchInput;