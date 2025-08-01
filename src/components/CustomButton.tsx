import {
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import React, { FC } from 'react';
import Animated, {
  AnimatedRef,
  SharedValue,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {OnboardingData} from '../data/data';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';



type ButtonProps = {
  dataLength: number;
  flatListIndex: SharedValue<number>;
  flatListRef: AnimatedRef<FlatList<OnboardingData>>;
  x: SharedValue<number>;
  onFinish?: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const CustomButton: FC<ButtonProps> = ({
  dataLength,
  flatListIndex,
  flatListRef,
  x,
  onFinish,
}) => {

  const {width: SCREEN_WIDTH} = useWindowDimensions();
  const buttonScale = useSharedValue(1);

   const animatedStyle = useAnimatedStyle(() => {

    const isLastIndex = flatListIndex.value === dataLength - 1
        return{
          width: isLastIndex ? withSpring(140) : withSpring(60),
          height: 60,
          transform: [{scale: buttonScale.value}],
          backgroundColor: interpolateColor(
            x.value,
            [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
            ["#fff", "#1e1e1", "#fff"],
          )
        }
    });

    const textStyle = useAnimatedStyle(() => {

    const isLastIndex = flatListIndex.value === dataLength - 1
        return{
          opacity: isLastIndex ? withTiming(1) : withTiming(0),
          transform: [{translateX: isLastIndex ? withTiming(0) : withTiming(-100)}],
          
        }
    });

    const iconStyle = useAnimatedStyle(() => {

    const isLastIndex = flatListIndex.value === dataLength - 1
        return{
          width: 30,
          height: 30,
          opacity: isLastIndex ? withTiming(0) : withTiming(1),
          transform: [{translateX: isLastIndex ? withTiming(100) : withTiming(0)}],
        }
    });

    const navigation = useNavigation<any>();

    const navigateToLogin = () => {
      navigation.navigate("AuthScreen");
    }

    
    const handlePress = () => {
      const isLastIndex = flatListIndex.value === dataLength - 1

      if (!isLastIndex) {
        flatListRef.current?.scrollToIndex({
          index: flatListIndex.value + 1,
          animated: true,
        });
      }else{
        if(onFinish){
          runOnJS(onFinish)();
        }else{
          runOnJS(navigateToLogin)();
        }
      }
    }

    const onPress = () => {
      buttonScale.value = withSpring(0.9, {}, () => {
        buttonScale.value = withSpring(1),
        runOnJS(handlePress)()
      })
    }

  return (
    <View style={styles.container}>
      <AnimatedPressable onPress={onPress}>
        <Animated.View style={[styles.button, animatedStyle]}>
          <Animated.Text style={[styles.text, textStyle]}>Get Started</Animated.Text>
          <Animated.Image source={require("../assets/images/ArrowIcon.png")} style={[styles.arrow, iconStyle]}/>
        </Animated.View>
      </AnimatedPressable>
    </View>
  )
}

  

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    padding: 4,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  arrow: {
    position: 'absolute',
    tintColor: "#1e1e1e",
  },
  button: {
    padding: 4,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    overflow: 'hidden',
  },
  text: {
    color: "#1e1e1e",
    fontSize: 16,
    position: "absolute",
    fontWeight: "bold",
  }
});
