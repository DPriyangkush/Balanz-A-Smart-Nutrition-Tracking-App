import React, { useState, useEffect, useRef } from 'react';
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

const MultiSelectDropdown = ({ values = [], onValuesChange, items, placeholder = "Select" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleTags, setVisibleTags] = useState([]);
  const [hasMoreTags, setHasMoreTags] = useState(false);
  const containerRef = useRef(null);
  const animatedHeight = useSharedValue(0);
  const opacity = useSharedValue(0);

  const toggleDropdown = () => {
    if (isVisible) {
      animatedHeight.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
      setTimeout(() => setIsVisible(false), 200);
    } else {
      setIsVisible(true);
      animatedHeight.value = withTiming(1, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    }
  };

  const handleToggle = (selectedValue) => {
    let newValues;
    if (values.includes(selectedValue)) {
      newValues = values.filter(v => v !== selectedValue);
    } else {
      newValues = [...values, selectedValue];
    }
    onValuesChange(newValues);
  };

  const handleRemoveTag = (valueToRemove) => {
    const newValues = values.filter(v => v !== valueToRemove);
    onValuesChange(newValues);
  };

  // Calculate which tags can fit in the available space
  useEffect(() => {
    const selectedItems = items.filter(item => values.includes(item.value));
    
    if (selectedItems.length === 0) {
      setVisibleTags([]);
      setHasMoreTags(false);
      return;
    }

    // Estimate available width (container width minus arrow and padding)
    // Approximate: 16px left padding + 8px spacing + 20px arrow + 16px right padding = 60px
    const availableWidth = 400 - 60; // Increased from 300 to 400 to allow more tags
    const tagSpacing = 8;
    const moreTextWidth = 30; // Width for "..."
    
    let currentWidth = 0;
    let visibleCount = 0;
    
    for (let i = 0; i < selectedItems.length; i++) {
      // Rough estimation: 12px padding * 2 + text width (8px per char) + 20px for remove button
      const estimatedTagWidth = 44 + (selectedItems[i].label.length * 8);
      
      if (currentWidth + estimatedTagWidth + (visibleCount > 0 ? tagSpacing : 0) <= availableWidth - (i < selectedItems.length - 1 ? moreTextWidth : 0)) {
        currentWidth += estimatedTagWidth + (visibleCount > 0 ? tagSpacing : 0);
        visibleCount++;
      } else {
        break;
      }
    }
    
    setVisibleTags(selectedItems.slice(0, visibleCount));
    setHasMoreTags(visibleCount < selectedItems.length);
  }, [values, items]);

  const animatedStyle = useAnimatedStyle(() => {
    const maxHeight = Math.min(items?.length * 52 || 0, 200);
    return {
      height: interpolate(animatedHeight.value, [0, 1], [0, maxHeight]),
      opacity: opacity.value,
    };
  });

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(animatedHeight.value, [0, 1], [0, 180])}deg`,
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={toggleDropdown}
        activeOpacity={0.7}
        ref={containerRef}
      >
        <View style={styles.contentContainer}>
          {values.length === 0 ? (
            <Text style={styles.placeholder}>{placeholder}</Text>
          ) : (
            <View style={styles.tagsContainer}>
              {visibleTags.map((item) => (
                <View key={item.value} style={styles.tag}>
                  <Text style={styles.tagText}>{item.label}</Text>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleRemoveTag(item.value);
                    }}
                    style={styles.tagRemove}
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                  >
                    <Text style={styles.tagRemoveText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {hasMoreTags && (
                <Text style={styles.moreText}>...</Text>
              )}
            </View>
          )}
        </View>
        <Animated.Text style={[styles.arrow, arrowStyle]}>▼</Animated.Text>
      </TouchableOpacity>

      {isVisible && (
        <Animated.View style={[styles.dropdown, animatedStyle]}>
          <FlatList
            data={items}
            keyExtractor={(item, index) => `${item.value}-${index}`}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            renderItem={({ item }) => {
              const isSelected = values.includes(item.value);
              return (
                <TouchableOpacity
                  style={[
                    styles.option,
                    isSelected && styles.selectedOption
                  ]}
                  onPress={() => handleToggle(item.value)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              );
            }}
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
    fontFamily: "Inter",
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#abffb4ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#1e1e1e',
    fontWeight: '500',
    marginRight: 6,
  },
  tagRemove: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 30, 30, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagRemoveText: {
    fontSize: 12,
    color: '#1e1e1e',
    fontWeight: 'bold',
    lineHeight: 16,
  },
  moreText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginLeft: 4,
  },
  arrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  dropdown: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
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
    backgroundColor: '#abffb4ff',
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

export default MultiSelectDropdown;