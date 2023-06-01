import React, {useEffect, useState} from 'react';
import {View, TextInput, Animated, StyleSheet} from 'react-native';
import {colors, font} from '../../assets';

interface Props {
  label: string;
  onChangeText?: (text: string) => void;
  value: string;
  editable?: boolean;
}
const AnimatedInput = ({
  label,
  onChangeText,
  value,
  editable = true,
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  const labelPosition = useState(new Animated.Value(0))[0];
  const labelScale = useState(new Animated.Value(1))[0];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const animateLabel = (position: number, scale: number) => {
    Animated.parallel([
      Animated.timing(labelPosition, {
        toValue: position,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(labelScale, {
        toValue: scale,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (value.trim() !== '') {
      animateLabel(-10, 1);
    }
  }, [value, animateLabel]);

  const handleFocus = () => {
    setIsFocused(true);
    animateLabel(-10, 1);
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (value.trim() === '') {
      animateLabel(0, 1);
    }
  };

  return (
    <View style={styles(isFocused).container}>
      <Animated.Text
        style={[
          styles(isFocused || value.length > 0).label,
          {
            transform: [{translateY: labelPosition}, {scale: labelScale}],
          },
        ]}>
        {label}
      </Animated.Text>
      <TextInput
        editable={editable}
        style={styles(isFocused).input}
        value={value}
        focusable={isFocused}
        returnKeyType="done"
        onSubmitEditing={() => {
          handleBlur();
        }}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  );
};

const styles = (isFocused?: boolean) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      position: 'absolute',
      left: 16,
      top: 16,

      fontSize: isFocused ? 14 : 16,
      color: isFocused ? colors.gray : colors.grey2,
      fontFamily: font.light,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.grey3,
      borderRadius: 5,
      paddingBottom: 8,
      paddingTop: 24,
      paddingHorizontal: 16,
      fontSize: 16,
      color: colors.fontBlack,
      fontFamily: font.light,
      minHeight: 56,
    },
  });

export default AnimatedInput;