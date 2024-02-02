import React, {useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {colors, font} from '../../assets';
import Text from '../Text';

interface Props {
  onPress?: () => void;
  label: string | null;
  isSelected: boolean;
  belowComponent?: React.ReactNode;
  extra?: JSX.Element | null;
  styleWrapper?: ViewStyle;
  onlyRadio?: boolean;
}
const RadioList = ({
  onPress,
  isSelected,
  label,
  belowComponent,
  extra,
  styleWrapper,
  onlyRadio = false,
}: Props) => {
  const scaleValue = useRef(new Animated.Value(1))?.current;

  const animate = () =>
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  const resetAnimate = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (isSelected) {
      animate();
    } else {
      resetAnimate();
    }
  }, [isSelected]);

  return onlyRadio ? (
    <Animated.View
      style={[
        styles(isSelected).radioButton,
        {
          transform: [
            {
              scale: scaleValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1],
              }),
            },
          ],
        },
      ]}>
      {isSelected && (
        <Animated.View
          style={{
            width: 8,
            height: 8,
            borderRadius: 10,
            backgroundColor: colors.white,
            transform: [
              {
                scale: scaleValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1.2],
                }),
              },
            ],
          }}
        />
      )}
    </Animated.View>
  ) : (
    <View
      style={{
        marginBottom: 16,
        ...styleWrapper,
      }}>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'flex-start'}}
        activeOpacity={0.8}
        onPress={() => {
          onPress?.();
        }}>
        <View
          style={{
            flex: 0.1,
          }}>
          <Animated.View
            style={[
              styles(isSelected).radioButton,
              {
                transform: [
                  {
                    scale: scaleValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1],
                    }),
                  },
                ],
              },
            ]}>
            {isSelected && (
              <Animated.View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 10,
                  backgroundColor: colors.white,
                  transform: [
                    {
                      scale: scaleValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1.2],
                      }),
                    },
                  ],
                }}
              />
            )}
          </Animated.View>
        </View>
        <View
          style={{
            flex: 0.9,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.regular,
                marginLeft: 8,
              }}>
              {label}
            </Text>
            {extra ? extra : null}
          </View>

          {belowComponent ? belowComponent : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = (isSelected?: boolean) =>
  StyleSheet.create({
    radioListButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    radioButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: isSelected ? colors.orange : colors.white,
      borderWidth: isSelected ? 0 : 0.5,
      borderColor: colors.grey2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
  });

export default RadioList;
