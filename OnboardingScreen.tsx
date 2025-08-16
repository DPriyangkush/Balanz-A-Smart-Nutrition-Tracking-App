import {StyleSheet, View, FlatList, ViewToken, Text} from 'react-native';
import React, { useCallback, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from 'react-native-reanimated';
import data, {OnboardingData} from './src/data/data';
import Pagination from './src/components/Pagination';
import CustomButton from './src/components/CustomButton';
import RenderItem from './src/components/RenderItem';


const OnboardingScreen = () => {
  const flatListRef = useAnimatedRef<FlatList<OnboardingData>>();
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);
  const keyExtractor = useCallback(
    (item: any, index: number) => index.toString(),
    [],
  );



  const onViewableItemsChanges = useCallback(({viewableItems}: {viewableItems: ViewToken[]}) => {
    const firstVisibleItem = viewableItems[0];
    if(firstVisibleItem?.index !== null && firstVisibleItem?.index !== undefined){
      flatListIndex.value = firstVisibleItem.index;
    }
  }, []);


  const viewabilityConfig = useRef({
    minimumViewTime: 300,
    viewAreaCoveragePercentThreshold: 10,
  })



  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        onScroll={onScroll}
        data={data}
        renderItem={({item, index}) => (
          <RenderItem index={index} item={item} x={x} key={index}/>
        )}
        keyExtractor={keyExtractor}
        scrollEventThrottle={16}
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanges}
        viewabilityConfig={viewabilityConfig.current}
      />
      <View style={styles.bottomContainer}>
        <Pagination data={data} x={x} />
        <CustomButton
          flatListRef={flatListRef}
          flatListIndex={flatListIndex}
          dataLength={data.length}
          x={x}
        />
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    paddingVertical: 30,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
});
