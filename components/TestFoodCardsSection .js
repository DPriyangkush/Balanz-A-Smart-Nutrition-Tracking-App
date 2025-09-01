// Minimal Debug Version - Step by Step Testing
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const TestFoodCardsSection = () => {
  // Step 1: Create simple items that are wider than screen
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8'];
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Horizontal Scroll Test</Text>
      
      {/* TEST 1: Most basic horizontal scroll */}
      <View style={styles.testSection}>
        <Text style={styles.testTitle}>Test 1: Basic Horizontal ScrollView</Text>
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={true} // Show indicator for debugging
          style={styles.basicScroll}
          contentContainerStyle={styles.basicContent}
        >
          {items.map((item, index) => (
            <View key={index} style={styles.basicItem}>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* TEST 2: ScrollView with explicit dimensions */}
      <View style={styles.testSection}>
        <Text style={styles.testTitle}>Test 2: ScrollView with Fixed Height</Text>
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          style={[styles.basicScroll, { height: 100 }]} // Explicit height
          contentContainerStyle={styles.basicContent}
        >
          {items.map((item, index) => (
            <View key={index} style={[styles.basicItem, { backgroundColor: '#e3f2fd' }]}>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* TEST 3: ScrollView inside container with flex */}
      <View style={styles.testSection}>
        <Text style={styles.testTitle}>Test 3: ScrollView in Flex Container</Text>
        <View style={{ flex: 0 }}> {/* Explicit flex: 0 */}
          <ScrollView 
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.basicContent}
            style={{ height: 100 }}
          >
            {items.map((item, index) => (
              <View key={index} style={[styles.basicItem, { backgroundColor: '#f3e5f5' }]}>
                <Text style={styles.itemText}>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* TEST 4: TouchableOpacity items */}
      <View style={styles.testSection}>
        <Text style={styles.testTitle}>Test 4: TouchableOpacity Items</Text>
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          style={{ height: 100 }}
          contentContainerStyle={styles.basicContent}
        >
          {items.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.basicItem, { backgroundColor: '#fff3e0' }]}
              onPress={() => console.log(`Pressed ${item}`)}
            >
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Debug Information */}
      <View style={styles.debugSection}>
        <Text style={styles.debugTitle}>Debug Info:</Text>
        <Text style={styles.debugText}>Screen Width: {screenWidth}</Text>
        <Text style={styles.debugText}>Platform: {Platform.OS}</Text>
        <Text style={styles.debugText}>Item Width: 150px</Text>
        <Text style={styles.debugText}>Total Content Width: {150 * items.length}px</Text>
        <Text style={styles.debugText}>Items Count: {items.length}</Text>
        <Text style={styles.debugText}>
          {150 * items.length > screenWidth ? '✅ Content is wider than screen' : '❌ Content fits on screen'}
        </Text>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>Instructions:</Text>
        <Text style={styles.instructionText}>
          1. Try swiping left/right on each test section
        </Text>
        <Text style={styles.instructionText}>
          2. Look for horizontal scroll indicators
        </Text>
        <Text style={styles.instructionText}>
          3. Check which test works
        </Text>
        <Text style={styles.instructionText}>
          4. Report back which test scrolls horizontally
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  testSection: {
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
  testTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#666',
  },
  basicScroll: {
    // Let ScrollView size itself naturally
  },
  basicContent: {
    paddingHorizontal: 10,
  },
  basicItem: {
    width: 150, // Fixed width wider than most screens
    height: 80,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  debugSection: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  instructions: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2e7d32',
  },
  instructionText: {
    fontSize: 12,
    color: '#2e7d32',
    marginBottom: 4,
  },
});

export default TestFoodCardsSection;