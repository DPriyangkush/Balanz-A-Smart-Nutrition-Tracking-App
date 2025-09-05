// EnhancedPromoCard.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground,
  Dimensions,
  Platform
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const PromoCard = ({ 
  promo,
  onPress,
  style,
}) => {
  if (!promo) return null;

  const {
    title,
    subtitle,
    buttonText,
    imageSource, // This matches the PromoDataManager structure
    theme = {},
  } = promo;

  // Use theme colors or fallback to defaults
  const backgroundColor = theme.backgroundColor || '#1e1e1e';
  const primaryColor = theme.primaryColor || '#333';
  const accentColor = theme.accentColor || '#EDFDEE';

  // Dynamic styles based on promo data
  const dynamicStyles = {
    title: {
      color: '#FFF', // White text for better contrast on image
    },
    button: {
      backgroundColor: accentColor,
    },
    buttonText: {
      color: primaryColor,
    },
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={{ uri: imageSource }} // Use imageSource from PromoDataManager
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <View style={styles.content}>
          {/* Text Section - Now takes full width */}
          <View style={styles.textSection}>
            <Text style={[styles.title, dynamicStyles.title]} numberOfLines={2}>
              {title}
            </Text>
            <Text style={[styles.subtitle]} numberOfLines={2}>
              {subtitle}
            </Text>

            {/* Action Button */}
            <TouchableOpacity 
              style={[styles.button, dynamicStyles.button]} 
              onPress={onPress}
            >
              <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
                {buttonText}
              </Text>
              <Text style={[styles.arrow, dynamicStyles.buttonText]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    marginHorizontal: 5,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    minHeight: 180,
  },
  
  backgroundImage: {
    flex: 1,
    width: '100%',
    minHeight: 180,
  },
  
  imageStyle: {
    borderRadius: 25,
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  
  textSection: {
    flex: 1,
    justifyContent: 'center',
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  
  subtitle: {
    fontSize: 14,
    color: '#E0E0E0', // Light color for better visibility on image
    marginBottom: 8,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  
  button: {
    borderRadius: 13,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    minWidth: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 10,
  },
  
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  
  arrow: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PromoCard;