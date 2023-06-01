import {View, StyleSheet, Platform, useWindowDimensions} from 'react-native';
import React from 'react';
// import LinearGradient from 'react-native-linear-gradient';
import Lottie from 'lottie-react-native';
import {image} from '../../assets';
import LinearGradient from 'react-native-linear-gradient';

export default function ProgressBarAnimated({
  current = 0,
  total = 100,
  height = 8,
  isDisabled = false,
}: {
  current?: number;
  total?: number;
  height?: number;
  color?: string;
  isDisabled?: boolean;
}) {
  const progress = (current / total) * 100;

  return (
    <View
      style={[
        styles.container,

        {
          height,
          backgroundColor: isDisabled ? '#CED7E0' : '#e0e0e0',
        },
      ]}>
      {isDisabled ? (
        <View
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#B0B8BF',
          }}
        />
      ) : Platform.OS === 'ios' ? (
        <>
          <View
            style={{
              height: '100%',
              width: `${progress}%`,
            }}>
            <Lottie
              autoPlay
              loop
              source={image.missionProgressBar}
              style={[
                styles.progress,
                {
                  flex: 1,
                },
              ]}
              resizeMode="cover"
              speed={1}
            />
          </View>
        </>
      ) : (
        <LinearGradient
          colors={['#F89132', '#FFDE1F']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[styles.progress, {width: `${progress}%`, height}]}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 8,
        alignItems: 'flex-start',
      },
      android: {
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 8,
        alignItems: 'flex-start',
      },
    }),
  },
  progress: {
    alignSelf: 'flex-start',
  },
});
