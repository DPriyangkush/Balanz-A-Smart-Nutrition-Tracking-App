import {StyleSheet, View} from 'react-native';
import React, { FC } from 'react';
import {SharedValue} from 'react-native-reanimated';
import {OnboardingData} from '../data/data';
import Dot from './Dot';


type PaginationProps = {
  data: OnboardingData[];
  x: SharedValue<number>;
  dotColor?: string;
  activeDotColor?: string;
  activeDotSize?: number;
  dotSize?: number;
  containerStyle?: object;
};
const Pagination: FC<PaginationProps> = ({ 
  data, 
  x, 
  activeDotColor = "#fff",
  activeDotSize = 25,
  dotColor = "#1e1e1e",
  dotSize = 10, 
  containerStyle = {}
}) => {
  return(
    <View style={[styles.paginationContainer, containerStyle]}>
      {data.map((_,index) => {
        return(
          <Dot 
            index={index}
            x={x}
            key={index}
            inactiveColor={dotColor}
            activeColor={activeDotColor}
            inactiveSize={dotSize}
            activeSize={activeDotSize}
          />
        )
      })}
    </View>
  )
}

export default Pagination;

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});
