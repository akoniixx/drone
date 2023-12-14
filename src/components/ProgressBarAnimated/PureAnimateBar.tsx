import React, {useState, useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import colors from '../../assets/colors/colors';

interface Props {
  progress: number;
}
const PureAnimatedBar = ({progress}: Props) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View style={[styles.progressBar, {width}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 6,
    width: '100%',
    backgroundColor: '#B0B8BF',
    borderRadius: 10,
  },
  progressBar: {
    backgroundColor: '#FF981E',
    borderRadius: 10,
    height: '130%',
    position: 'relative',
    top: -1,
  },
});

export default PureAnimatedBar;
