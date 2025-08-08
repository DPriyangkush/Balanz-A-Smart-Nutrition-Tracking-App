import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const HalfWidthSelect = ({ value, onValueChange, items, placeholder = "Select" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const animatedHeight = useSharedValue(0);
  const opacity = useSharedValue(0);

  const toggleDropdown = () => {
    if (isVisible) {
      // Close dropdown
      animatedHeight.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
      setTimeout(() => setIsVisible(false), 200);
    } else {
      // Open dropdown
      setIsVisible(true);
      animatedHeight.value = withTiming(1, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    }
  };

  const handleSelect = (selectedValue) => {
    onValueChange(selectedValue);
    // Close dropdown
    animatedHeight.value = withTiming(0, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => setIsVisible(false), 200);
  };

  const selectedItem = items?.find(item => item.value === value);

  const animatedStyle = useAnimatedStyle(() => {
    const maxHeight = Math.min(items?.length * 52 || 0, 200);
    
    return {
      height: interpolate(animatedHeight.value, [0, 1], [0, maxHeight]),
      opacity: opacity.value,
    };
  });

  const arrowStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(animatedHeight.value, [0, 1], [0, 180])}deg`,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <Text style={[styles.triggerText, !selectedItem && styles.placeholder]}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Animated.Text style={[styles.arrow, arrowStyle]}>▼</Animated.Text>
      </TouchableOpacity>

      {isVisible && (
        <Animated.View style={[styles.dropdown, animatedStyle]}>
          <FlatList
            data={items}
            keyExtractor={(item, index) => `${item.value}-${index}`}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.option,
                  value === item.value && styles.selectedOption
                ]}
                onPress={() => handleSelect(item.value)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.optionText,
                  value === item.value && styles.selectedOptionText
                ]}>
                  {item.label}
                </Text>
                {value === item.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    zIndex: 1000,
  },
  trigger: {
    height: 64,
    backgroundColor: '#fff',
    borderColor: '#1e1e1e',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10
  },
  triggerText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    fontFamily: "Inter",
    fontWeight: '500',
  },
  placeholder: {
    color: '#999',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  dropdown: {
    position: 'absolute',
    top: 70, // Just below the trigger (56px height + 2px gap)
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    zIndex: 1001,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  selectedOption: {
    backgroundColor: '#f0f4ff',
  },
  selectedOptionText: {
    fontWeight: '600',
    color: '#1e1e1e',
  },
  checkmark: {
    fontSize: 16,
    color: '#1e1e1e',
    fontWeight: 'bold',
  },
});

export default HalfWidthSelect;