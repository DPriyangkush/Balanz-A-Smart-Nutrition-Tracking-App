import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {OnboardingData} from '../data/data';
import LottieView from 'lottie-react-native';


type Props = {
  index: number;
  x: SharedValue<number>;
  item: OnboardingData;
};

const RenderItem = ({index, x, item}: Props) => {
  const {width: SCREEN_WIDTH} = useWindowDimensions();
  const circleSize = SCREEN_WIDTH;
  const lottieSize = SCREEN_WIDTH * 0.9;
  const circleRadius = circleSize / 2

  const animationRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH
  ]

   const lottieAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          x.value,
          animationRange,
          [200,0,-200],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const circleAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          x.value,
          animationRange,
          [1,4,4],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const titleAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          x.value,
          animationRange,
          [100,0,-100],
          Extrapolation.CLAMP,
        ),
      },
    ],
    opacity: interpolate(
          x.value,
          animationRange,
          [0,1,0],
          Extrapolation.CLAMP,
        ),
  }));

    const descriptionAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          x.value,
          animationRange,
          [-100,0,100],
          Extrapolation.CLAMP,
        ),
      },
    ],
    opacity: interpolate(
          x.value,
          animationRange,
          [0,1,0],
          Extrapolation.CLAMP,
        ),
  }));

  return (
    <View style={[styles.itemContainer, {width: SCREEN_WIDTH}]}>
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.circle,
            circleAnimation,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleRadius,
              backgroundColor: item.backgroundColor,
            },
            circleAnimation,
          ]}
        />
      </View>
      <Animated.View style={lottieAnimation}>
        <LottieView
          source={item.animation}
          autoPlay
          loop
          resizeMode='contain'
          style={[styles.lottie, {width: lottieSize, height: lottieSize}]}
        />
      </Animated.View>
      <View style = {styles.textContainer}>
          <Animated.Text style={[styles.title, {color: item.textColor},titleAnimation]}>{item.text}</Animated.Text>
          {item.description && <Text style={[styles.description, {color: item.textColor}, descriptionAnimation]}>{item.description}</Text>}
      </View>
    </View>
  );
};

export default RenderItem;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 150,
  },
  itemText: {
    textAlign: 'center',
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  circle: {
    position: 'absolute'
  },
  lottie: {
    alignSelf: "center"
  },
  textContainer: {
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '400',
    opacity: 0.8
  }
});
